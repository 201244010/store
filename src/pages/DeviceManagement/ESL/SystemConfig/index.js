import React, { Component } from 'react';
import { connect } from 'dva';
import {
	Card,
	Select,
	Form,
	Button,
	Switch,
	message,
	Tooltip,
	Icon,
	Input,
	TimePicker,
} from 'antd';
import DataEmpty from '@/components/BigIcon/DataEmpty';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { FORM_SETTING_LAYOUT } from '@/constants/form';
import styles from './systemConfig.less';
import { ERROR_OK } from '@/constants/errorCode';

const SELECT_STYLE = { maxWidth: '180px' };
const SCAN_PERIODS = [5, 10, 15];
// const SLEEP_PERIODS = [60, 120, 180];

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
		updateAPConfig: ({ networkId, isEnergySave, scanPeriod, scanMulti }) =>
			dispatch({
				type: 'eslBaseStation/updateAPConfig',
				payload: {
					networkId,
					isEnergySave,
					scanPeriod,
					scanMulti,
				},
			}),
		generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
		subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
		unsubscribeTopic: () => dispatch({ type: 'eslBaseStation/unsubscribeTopic' }),
		checkClientExist: () => dispatch({ type: 'mqttStore/checkClientExist' }),
	})
)
@Form.create()
class SystemConfig extends Component {
	constructor(props) {
		super(props);
		this.checkTimer = null;
		this.state = { networkId: null, networkConfig: {}, configLoading: true };
	}

	async componentDidMount() {
		const { getNetWorkIdList } = this.props;
		await getNetWorkIdList();
		await this.checkMQTTClient();
	}

	componentWillUnmount() {
		clearTimeout(this.checkTimer);
		const { unsubscribeTopic } = this.props;
		unsubscribeTopic();
	}

	apHandler = (errcode, action, receiveConfig) => {
		// console.log('errcode: ', errcode);
		if (action === 'update') {
			if (errcode === ERROR_OK) {
				message.success(formatMessage({ id: 'esl.device.config.setting.success' }));
				const { getAPConfig } = this.props;
				const { networkId } = this.state;
				console.log('get updated config');
				getAPConfig({ networkId });
			} else {
				message.error(formatMessage({ id: 'esl.device.config.setting.fail' }));
			}
		} else if (action === 'query') {
			if (errcode === ERROR_OK) {
				this.setState({ networkConfig: receiveConfig, configLoading: false });
			} else {
				message.error(formatMessage({ id: 'esl.device.config.info.fail' }));
				this.setState({ networkConfig: [], configLoading: false });
			}
		} else {
			this.setState({ networkConfig: [], configLoading: false });
		}
	};

	checkMQTTClient = async () => {
		clearTimeout(this.checkTimer);
		const {
			checkClientExist,
			getAPConfig,
			setAPHandler,
			generateTopic,
			subscribe,
		} = this.props;
		const isClientExist = await checkClientExist();
		if (isClientExist) {
			const {
				eslBaseStation: { networkIdList = [] },
			} = this.props;
			const apInfoTopic = await generateTopic({ service: 'ESL/response', action: 'sub' });
			await subscribe({ topic: [apInfoTopic] });
			await setAPHandler({ handler: this.apHandler });
			if (networkIdList.length > 0) {
				const { networkId } = networkIdList[0] || {};
				this.setState(
					{
						networkId,
					},
					() => getAPConfig({ networkId })
				);
			}
			// console.log('client existed', networkIdList);
		} else {
			this.checkTimer = setTimeout(() => this.checkMQTTClient(), 1000);
		}
	};

	handleSelectChange = networkId => {
		// console.log('changed', networkId);
		const { getAPConfig } = this.props;
		this.setState(
			{
				networkId,
				configLoading: true,
			},
			() => getAPConfig({ networkId })
		);
	};

	updateAPConfig = () => {
		const {
			form: { validateFields },
			updateAPConfig,
		} = this.props;

		const {
			networkConfig: { scanMulti },
		} = this.state;

		validateFields((err, values) => {
			if (!err) {
				this.setState(
					{
						configLoading: true,
					},
					() =>
						updateAPConfig({
							...values,
							scanMulti,
						})
				);
			}
		});
	};

	render() {
		const {
			loading,
			eslBaseStation: { networkIdList = [] },
			form: { getFieldDecorator, isFieldsTouched },
		} = this.props;
		const {
			networkId,
			networkConfig: {
				scanPeriod,
				isEnergySave,
				clksyncPeriod,
				eslRefleshPeriod,
				eslRefleshTime,
			} = {},
			configLoading,
		} = this.state;
		const hasTouched = isFieldsTouched([
			'scanPeriod',
			'isEnergySave',
			'clksyncPeriod',
			'eslRefleshPeriod',
			'eslRefleshTime',
		]);

		return (
			<Card
				title={formatMessage({ id: 'esl.device.config.title' })}
				bordered={false}
				style={{ width: '100%' }}
				loading={loading.effects['eslBaseStation/getNetWorkIdList']}
			>
				{networkIdList.length > 0 ? (
					<Form {...FORM_SETTING_LAYOUT}>
						<Card
							title={formatMessage({ id: 'esl.device.config.info' })}
							bordered={false}
							loading={configLoading}
							className={styles['content-card']}
						>
							<div className={styles['display-content']}>
								<Form.Item
									label={formatMessage({ id: 'esl.device.config.networkId' })}
								>
									{getFieldDecorator('networkId', {
										initialValue: networkId,
									})(
										<Select
											onChange={this.handleSelectChange}
											style={SELECT_STYLE}
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
									)}
								</Form.Item>
							</div>
						</Card>
						<Card
							title={formatMessage({ id: 'esl.device.config.setting' })}
							bordered={false}
							// loading={configLoading}
							className={styles['content-card']}
						>
							<div className={styles['display-content']}>
								<Form.Item
									label={formatMessage({ id: 'esl.device.config.scan.round' })}
								>
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

								<Form.Item
									label={formatMessage({ id: 'esl.device.config.scan.green' })}
								>
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

								{/* 深度睡眠模式暂时隐去 */}
								{/* <Form.Item
									label={formatMessage({ id: 'esl.device.config.sleep.round' })}
								>
									<div className={styles['form-item-wrapper']}>
										{getFieldDecorator('scanPeriod', {
											initialValue: scanPeriod || 60,
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
								</Form.Item> */}

								<Form.Item
									label={formatMessage({ id: 'esl.device.config.async.round' })}
								>
									<div className={styles['form-item-wrapper']}>
										{getFieldDecorator('clksyncPeriod', {
											initialValue: clksyncPeriod || 3,
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
											/>
										)}
										<FormTip
											text={formatMessage({
												id: 'esl.device.config.async.desc',
											})}
										/>
									</div>
								</Form.Item>

								<Form.Item
									label={formatMessage({
										id: 'esl.device.config.self.refresh.round',
									})}
								>
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
															!/(^[1-9]$)|(^[1-9]\d+$)/.test(value)
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

								<Form.Item
									label={formatMessage({
										id: 'esl.device.config.scan.refresh.time',
									})}
								>
									<div className={styles['form-item-wrapper']}>
										{getFieldDecorator('eslRefleshTime', {
											initialValue:
												eslRefleshTime ||
												moment()
													.startOf('day')
													.add(4, 'hour'),
										})(<TimePicker format="HH:mm" />)}
										<FormTip
											text={formatMessage({
												id: 'esl.device.config.scan.refresh.time.desc',
											})}
										/>
									</div>
								</Form.Item>

								<Form.Item label=" " colon={false}>
									<Button
										type="primary"
										disabled={!hasTouched}
										onClick={this.updateAPConfig}
									>
										{formatMessage({ id: 'btn.save' })}
									</Button>
								</Form.Item>
							</div>
						</Card>
						{/* 广播这一期不做 */}
						{/* <Card
									title={formatMessage({ id: 'esl.device.config.boardcast' })}
									loading={configLoading}
									bordered={false}
								>
									<div className={styles['display-content']}>
										<Form.Item
											label={formatMessage({
												id: 'esl.device.config.boardcast.startTime',
											})}
										>
											{getFieldDecorator('time', {})(<TimePicker />)}
										</Form.Item>
										<Form.Item label=" " colon={false}>
											<Button type="primary">{formatMessage({ id: 'btn.open' })}</Button>
											<Button className={styles['btn-margin-left']}>
												{formatMessage({ id: 'btn.close' })}
											</Button>
										</Form.Item>
									</div>
								</Card> */}
					</Form>
				) : (
					<DataEmpty />
				)}
			</Card>
		);
	}
}

export default SystemConfig;
