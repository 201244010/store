import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Select, Form, Button, Switch, message, Tooltip, Icon, Input, TimePicker, Table, Tag } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import DataEmpty from '@/components/BigIcon/DataEmpty';
import { FORM_SETTING_LAYOUT } from '@/constants/form';
import { ERROR_OK } from '@/constants/errorCode';
import tagCircle from '@/components/Tag/index';
import styles from './index.less';
import { OPCODE } from '@/constants/mqttStore';

const SELECT_STYLE = { maxWidth: '180px' };
const TIMEPICKER_STYLE = { width: '180px' };
const SCAN_PERIODS = [5, 10, 15];
const SLEEP_PERIODS = [60, 120, 180];
const SAVE_PERIODS = [30, 45, 60];
const SCAN_WINDOWS = [{
	label: formatMessage({id: 'esl.device.config.scan.window.model.performance'}),
	value: 1
}, {
	label: formatMessage({id: 'esl.device.config.scan.window.model.balance'}),
	value: 2
}, {
	label: formatMessage({id: 'esl.device.config.scan.window.model.save.energy'}),
	value: 3
}];
const ACTION = {
	QUERY: 'query',
	UPDATE: 'update'
};

const template = ['esl.device.ap.status.offline', 'esl.device.ap.status.online' ];

const FormTip = ({ text = '', pos = 'right', style = {} }) => (
	<Tooltip placement={pos} title={text}>
		<Icon type="question-circle" style={{ marginLeft: '20px', ...style }} />
	</Tooltip>
);

@connect(
	state => ({
		loading: state.loading,
		eslBaseStation: state.eslBaseStation,
		eslElectricLabel: state.eslElectricLabel,
	}),
	dispatch => ({
		getNetWorkIdList: () => dispatch({ type: 'eslBaseStation/getNetWorkIdList' }),
		setAPHandler: ({ handler }) =>
			dispatch({ type: 'eslBaseStation/setAPHandler', payload: { handler } }),
		getAPConfig: ({ networkId }) =>
			dispatch({ type: 'eslBaseStation/getAPConfig', payload: { networkId } }),
		updateAPConfig: payload => dispatch({ type: 'eslBaseStation/updateAPConfig', payload }),
		generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
		subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
		unsubscribeTopic: () => dispatch({ type: 'eslBaseStation/unsubscribeTopic' }),
		checkClientExist: () => dispatch({ type: 'mqttStore/checkClientExist' }),
		getBaseStationList: payload => dispatch({ type: 'eslBaseStation/getBaseStationList', payload}),
		setNetworkConfig: payload => dispatch({type: 'eslBaseStation/setNetworkConfig', payload})
	})
)
@Form.create()
class SystemConfig extends Component {
	constructor(props) {
		super(props);
		this.checkTimer = null;
		this.state = {
			networkId: null,
			configLoading: true,
			configShow: false,
			settingLoading: true,
			isUpdateSuccess: {
				setApConfig: false,
				// setClksync: false,
				setRefresh: false
			},
			btnLoading: false
		};

		this.columns = [{
			title: formatMessage({id: 'esl.device.ap.sn'}),
			dataIndex: 'sn',
			key: 'sn',
			render: (text, record) => {
				if(record.isMaster === 1) {
					return <span>{text}  <Tag>{formatMessage({id: 'esl.device.ap.mainAP'})}</Tag></span>;
				}
				return text;

			}
		}, {
			title: formatMessage({id: 'esl.device.ap.name'}), dataIndex: 'name', key: 'name'
		}, {
			title: formatMessage({id: 'esl.device.ap.status'}),
			dataIndex: 'status',
			key: 'status',
			render: text => {
				switch(text) {
					case 1: return tagCircle({status: 1, template});
					case 2: return tagCircle({status: 0, template});
					default: return tagCircle({status: 0, template});
				}
			}
		}];
	}

	async componentDidMount() {
		const { getNetWorkIdList, getBaseStationList, getAPConfig } = this.props;
		const networkIdList = await getNetWorkIdList();
		await this.checkMQTTClient();

		if(networkIdList.length > 0) {
			const stationList = await getBaseStationList({
				pageNum: 1, status: -1, keyword: networkIdList[0].networkId
			});
			this.setState({networkId: networkIdList[0].networkId, configLoading: false});

			if(this.isMainApOnline(stationList)) {
				this.setState({configShow: true, settingLoading: false});
				const { networkId } = networkIdList[0] || {};
				getAPConfig({ networkId });
			} else {
				this.setState({configShow: false, settingLoading: false});
			}
		}
	}

	componentWillUnmount() {
		clearTimeout(this.checkTimer);
		const { unsubscribeTopic } = this.props;
		unsubscribeTopic();
	}

	isMainApOnline = array => {
		if(array.length > 0) {
			const mainAp = array.filter(item => item.isMaster === 1);
			if(mainAp.length === 1 && mainAp[0].status === 1) {
				return true;
			}
		}
		return false;
	};

	// 三个更新接口全部成功才拉取最新的配置并toast提示成功
	apHandler = (errcode, action, receiveConfig, opcode) => {
		const { networkId, isUpdateSuccess } = this.state;
		const { getAPConfig, setNetworkConfig } = this.props;
		const updateSuccess = {
			setApConfig: false,
			// setClksync: false,
			setRefresh: false
		};

		if (action === ACTION.UPDATE) {
			if (errcode === ERROR_OK) {
				switch (opcode) {
					case OPCODE.SET_AP_CONFIG:
						isUpdateSuccess.setApConfig = true;
						this.setState({isUpdateSuccess});
						break;
					case OPCODE.SET_CLKSYNC:
						isUpdateSuccess.setClksync = true;
						this.setState({isUpdateSuccess});
						break;
					case OPCODE.SET_SELF_REFRESH:
						isUpdateSuccess.setRefresh = true;
						this.setState({isUpdateSuccess});
						break;
					default: break;
				}

				const {
					setApConfig,
					// setClksync,
					setRefresh
				} = isUpdateSuccess;
				if(setApConfig && setRefresh) {
					message.success(formatMessage({ id: 'esl.device.config.setting.success' }));
					getAPConfig({ networkId });
					this.setState({isUpdateSuccess: updateSuccess, btnLoading: false});
				}
			} else {
				message.error(formatMessage({ id: 'esl.device.config.setting.fail' }));
				this.setState({ isUpdateSuccess: updateSuccess, btnLoading: false});
			}
		} else if (action === ACTION.QUERY) {
			if (errcode === ERROR_OK) {
				setNetworkConfig({networkConfig: receiveConfig});
				this.setState({ configLoading: false });
			} else {
				setNetworkConfig({networkConfig: {}});
				message.error(formatMessage({ id: 'esl.device.config.info.fail' }));
				this.setState({ configLoading: false, configShow: false });
			}
		}
	};

	checkMQTTClient = async () => {
		clearTimeout(this.checkTimer);
		const {
			checkClientExist,
			setAPHandler,
			generateTopic,
			subscribe,
		} = this.props;
		const isClientExist = await checkClientExist();

		if (isClientExist) {
			const apInfoTopic = await generateTopic({ service: 'ESL/response', action: 'sub' });
			await subscribe({ topic: [apInfoTopic] });
			await setAPHandler({ handler: this.apHandler });
		} else {
			this.checkTimer = setTimeout(() => this.checkMQTTClient(), 1000);
		}
	};

	handleSelectChange = networkId => {
		const { getAPConfig, getBaseStationList } = this.props;

		this.setState(
			{
				networkId,
				configLoading: true,
				configShow: false,
				settingLoading: true,
			},
			async () => {
				const stationList = await getBaseStationList({
					pageNum: 1, status: -1, keyword: networkId
				});

				this.setState({configLoading: false});

				if(this.isMainApOnline(stationList)) {
					getAPConfig({ networkId });
					this.setState({configShow: true, settingLoading: false});
				} else {
					this.setState({configShow: false, settingLoading: false});
				}
			}
		);
	};

	updateAPConfig = () => {
		const {
			form: { validateFields },
			updateAPConfig,
		} = this.props;

		const { networkId } = this.state;

		validateFields((err, values) => {
			if (!err) {
				this.setState({btnLoading: true}, () => {
					updateAPConfig({
						...values,
						networkId,
					});
				});
			}
		});
	};

	render() {
		const {
			loading,
			eslBaseStation: { networkIdList = [], baseStationList = [], networkConfig: {
				scanPeriod,
				isEnergySave,
				scanDeepSleep,
				scanMulti,
				eslRefleshPeriod,
				eslRefleshTime,
				clksyncPeriod,
				wakePeriod
			} },
			form: { getFieldDecorator, isFieldsTouched },
		} = this.props;
		const {
			configLoading,
			configShow,
			settingLoading,
			networkId,
			btnLoading
		} = this.state;
		const hasTouched = isFieldsTouched([
			'scanPeriod',
			'isEnergySave',
			'clksyncPeriod',
			'eslRefleshPeriod',
			'eslRefleshTime',
			'scanMulti',
			'scanDeepSleep',
			'wakePeriod'
		]);

		return (
			<Card
				bordered={false}
				className={styles['device-config-card']}
				loading={loading.effects['eslBaseStation/getNetWorkIdList']}
			>
				{networkIdList.length > 0 ? (
					<>
						<Card
							title={formatMessage({ id: 'esl.device.config.info' })}
							bordered={false}
							loading={configLoading}
							className={styles['content-card']}
						>
							<div className={styles['device-info']}>
								<span className={styles['select-margin-right']}>
									{formatMessage({ id: 'esl.device.config.networkId' })}
								</span>
								<Select
									onChange={this.handleSelectChange}
									style={SELECT_STYLE}
									defaultValue={networkId}
								>
									{networkIdList.map(netWork => (
										<Select.Option
											key={netWork.networkId}
											value={netWork.networkId}
										>
											{netWork.networkId}
										</Select.Option>
									))}
								</Select>
								<Table
									columns={this.columns}
									dataSource={baseStationList}
									rowKey='sn'
									pagination={false}
									className={styles['table-margin-top']}
								/>
							</div>
						</Card>
						<Card
							title={formatMessage({ id: 'esl.device.config.setting' })}
							bordered={false}
							loading={settingLoading}
							className={styles['content-card']}
						>
							{configShow ?
								<Form {...FORM_SETTING_LAYOUT} hideRequiredMark>
									<div className={styles['display-content']}>
										<Form.Item label={formatMessage({ id: 'esl.device.config.scan.round' })}>
											<div className={styles['form-item-wrapper']}>
												{getFieldDecorator('scanPeriod', {
													initialValue: scanPeriod || 15,
												})(
													<Select style={SELECT_STYLE}>
														{SCAN_PERIODS.map((period, index) => (
															<Select.Option key={index} value={period}>
																{period}
																{formatMessage({ id: 'countDown.unit' })}
															</Select.Option>
														))}
													</Select>
												)}
												<FormTip
													text={formatMessage({
														id: 'esl.device.config.scan.round.desc',
													})}
												/>
											</div>
										</Form.Item>
										<Form.Item label={formatMessage({ id: 'esl.device.config.scan.green' })}>
											<div className={styles['form-item-wrapper']}>
												{getFieldDecorator('isEnergySave', {
													initialValue: isEnergySave,
													valuePropName: 'checked',
												})(<Switch />)}
												<FormTip
													text={formatMessage({
														id: 'esl.device.config.scan.green.desc',
													})}
												/>
											</div>
										</Form.Item>
										<Form.Item label={formatMessage({ id: 'esl.device.config.scan.greenRound' })}>
											<div className={styles['form-item-wrapper']}>
												{getFieldDecorator('scanMulti', {
													initialValue: scanMulti || 30,
												})(
													<Select style={SELECT_STYLE}>
														{SAVE_PERIODS.map((item, index) => (
															<Select.Option value={item} key={index}>
																{item}
																{formatMessage({ id: 'countDown.unit' })}
															</Select.Option>
														))}
													</Select>
												)}
											</div>
										</Form.Item>
										<Form.Item label={formatMessage({ id: 'esl.device.config.sleep.round' })}>
											<div className={styles['form-item-wrapper']}>
												{getFieldDecorator('scanDeepSleep', {
													initialValue: scanDeepSleep || 60,
												})(
													<Select style={SELECT_STYLE}>
														{SLEEP_PERIODS.map((period, index) => (
															<Select.Option key={index} value={period}>
																{period}
																{formatMessage({ id: 'countDown.unit' })}
															</Select.Option>
														))}
													</Select>
												)}
												<FormTip
													text={formatMessage({
														id: 'esl.device.config.sleep.desc',
													})}
												/>
											</div>
										</Form.Item>
										<Form.Item label={formatMessage({ id: 'esl.device.config.async.round' })}>
											<div className={styles['form-item-wrapper']}>
												{getFieldDecorator('clksyncPeriod', {
													initialValue: 1 || clksyncPeriod,
													validateTrigger: 'onBlur',
													rules: [
														{
															validator: (rule, value, callback) => {
																if (!value) {
																	callback(
																		formatMessage({
																			id:
																				'esl.device.config.async.isEmpty',
																		})
																	);
																} else if (
																	value &&
																	!/(^[1-9]$)|(^1[0-5]$)/.test(value)
																) {
																	callback(
																		formatMessage({
																			id:
																				'esl.device.config.async.formatError',
																		})
																	);
																} else {
																	callback();
																}
															},
														},
													],
												})(
													<Input
														suffix={formatMessage({ id: 'day.unit' })}
														style={SELECT_STYLE}
														disabled
													/>
												)}
												<FormTip
													text={formatMessage({
														id: 'esl.device.config.async.desc',
													})}
												/>
											</div>
										</Form.Item>
										<Form.Item label={formatMessage({id: 'esl.device.config.self.refresh.round'})}>
											<div className={styles['form-item-wrapper']}>
												{getFieldDecorator('eslRefleshPeriod', {
													initialValue: eslRefleshPeriod || 1,
													validateTrigger: 'onBlur',
													rules: [
														{
															validator: (rule, value, callback) => {
																if (!value) {
																	callback(
																		formatMessage({
																			id:
																				'esl.device.config.self.refresh.isEmpty',
																		})
																	);
																} else if (
																	value &&
																	!/(^[1-5]$)/.test(value)
																) {
																	callback(
																		formatMessage({
																			id:
																				'esl.device.config.self.refresh.formatError',
																		})
																	);
																} else {
																	callback();
																}
															},
														},
													],
												})(
													<Input
														suffix={formatMessage({ id: 'day.unit' })}
														style={SELECT_STYLE}
													/>
												)}
												<FormTip
													text={formatMessage({
														id: 'esl.device.config.scan.refresh.desc',
													})}
												/>
											</div>
										</Form.Item>
										<Form.Item label={formatMessage({id: 'esl.device.config.scan.refresh.time'})}>
											<div className={styles['form-item-wrapper']}>
												{getFieldDecorator('eslRefleshTime', {
													initialValue:
														eslRefleshTime
														|| moment()
															.startOf('day')
															.add(4, 'hour'),
													// validateTrigger: 'onBlur',
													rules: [
														{
															required: true,
															message: formatMessage({ id: 'esl.device.config.self.refreshTime.isEmpty'})
														}
													]
												})(<TimePicker format="HH:mm" style={TIMEPICKER_STYLE} />)}
												<FormTip
													text={formatMessage({
														id: 'esl.device.config.scan.refresh.time.desc',
													})}
												/>
											</div>
										</Form.Item>
										<Form.Item label={formatMessage({ id: 'esl.device.config.scan.window' })}>
											<div className={styles['form-item-wrapper']}>
												{getFieldDecorator('wakePeriod', {
													initialValue: wakePeriod || 2,
												})(
													<Select style={SELECT_STYLE}>
														{SCAN_WINDOWS.map((item, index) => (
															<Select.Option key={index} value={item.value}>
																{item.label}
															</Select.Option>
														))}
													</Select>
												)}
												<FormTip
													text={formatMessage({
														id: 'esl.device.config.scan.window.desc',
													})}
												/>
											</div>
										</Form.Item>
										<Form.Item label=" " colon={false}>
											<Button
												type="primary"
												disabled={!hasTouched}
												onClick={this.updateAPConfig}
												loading={btnLoading}
											>
												{formatMessage({ id: 'btn.save' })}
											</Button>
										</Form.Item>
									</div>
								</Form> :
								<DataEmpty dataEmpty={formatMessage({id: 'esl.device.ap.empty'})} />
							}
						</Card>
					</>

				// 	<Card
				// 	title={formatMessage({ id: 'esl.device.config.boardcast' })}
				// 	loading={configLoading}
				// 	bordered={false}
				// 	>
				// 	<div className={styles['display-content']}>
				// 	<Form.Item
				// 	label={formatMessage({
				// 	id: 'esl.device.config.boardcast.startTime',
				// })}
				// 	>
				// {getFieldDecorator('time', {})(<TimePicker />)}
				// 	</Form.Item>
				// 	<Form.Item label=" " colon={false}>
				// 	<Button type="primary">{formatMessage({ id: 'btn.open' })}</Button>
				// 	<Button className={styles['btn-margin-left']}>
				// {formatMessage({ id: 'btn.close' })}
				// 	</Button>
				// 	</Form.Item>
				// 	</div>
				// 	</Card>

				) : (
					<DataEmpty />
				)}
			</Card>
		);
	}
}

export default SystemConfig;
