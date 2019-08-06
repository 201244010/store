import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Select, Form, Button, Switch } from 'antd';
import DataEmpty from '@/components/BigIcon/DataEmpty';
import { formatMessage } from 'umi/locale';
import { FORM_SETTING_LAYOUT } from '@/constants/form';
import styles from './systemConfig.less';

const SELECT_STYLE = { maxWidth: '300px' };
const SCAN_PERIODS = [5, 10, 15];

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

	apHandler = (action, receiveConfig) => {
		// console.log('mqtt ap response', networkConfig);
		if (action === 'update') {
			const { getAPConfig } = this.props;
			const { networkId } = this.state;
			getAPConfig({ networkId });
		} else {
			this.setState({ networkConfig: receiveConfig, configLoading: false });
		}
	};

	checkMQTTClient = async () => {
		clearTimeout(this.checkTimer);
		const { checkClientExist, getAPConfig, setAPHandler } = this.props;
		const isClientExist = await checkClientExist();
		if (isClientExist) {
			const {
				eslBaseStation: { networkIdList = [] },
			} = this.props;
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
		// console.log(networkId);
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
				updateAPConfig({
					...values,
					scanMulti,
				});

				this.setState({
					configLoading: true,
				});
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
			networkConfig: { scanPeriod, isEnergySave } = {},
			configLoading,
		} = this.state;
		const hasTouched = isFieldsTouched(['scanPeriod', 'isEnergySave']);

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
							loading={configLoading}
							className={styles['content-card']}
						>
							<div className={styles['display-content']}>
								<Form.Item
									label={formatMessage({ id: 'esl.device.config.scan.round' })}
								>
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
								</Form.Item>
								<Form.Item
									label={formatMessage({ id: 'esl.device.config.scan.green' })}
								>
									{getFieldDecorator('isEnergySave', {
										initialValue: isEnergySave,
										valuePropName: 'checked',
									})(<Switch />)}
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
