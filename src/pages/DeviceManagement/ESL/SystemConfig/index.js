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
		setScanTime: payload => dispatch({ type: 'eslElectricLabel/setScanTime', payload }),
		getAPConfig: ({ networkId }) =>
			dispatch({ type: 'eslBaseStation/getAPConfig', payload: { networkId } }),
		checkClientExist: () => dispatch({ type: 'mqttStore/checkClientExist' }),
	})
)
@Form.create()
class SystemConfig extends Component {
	constructor(props) {
		super(props);
		this.checkTimer = null;
		this.state = {
			time: 5,
		};
	}

	async componentDidMount() {
		const { getNetWorkIdList } = this.props;
		await getNetWorkIdList();
		await this.checkMQTTClient();
	}

	componentWillUnmount() {}

	checkMQTTClient = async () => {
		clearTimeout(this.checkTimer);
		const { checkClientExist } = this.props;
		const isClientExist = await checkClientExist();
		console.log(isClientExist);
		if (isClientExist) {
			console.log('client existed');
		} else {
			this.checkTimer = setTimeout(() => this.checkMQTTClient(), 2000);
		}
	};

	handleSetScanTime = () => {
		const { setScanTime } = this.props;
		const { time } = this.state;

		setScanTime({
			options: {
				time,
			},
		});
	};

	handleSelectChange = networkId => {
		console.log(networkId);
		const { getAPConfig } = this.props;
		getAPConfig({ networkId });
	};

	render() {
		const {
			loading,
			eslBaseStation: { networkIdList = [] },
			form: { getFieldDecorator },
		} = this.props;

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
							className={styles['content-card']}
						>
							<div className={styles['display-content']}>
								<Form.Item
									label={formatMessage({ id: 'esl.device.config.networkId' })}
								>
									{getFieldDecorator('networkId', {
										initialValue: (networkIdList[0] || {}).networkId || null,
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
							className={styles['content-card']}
						>
							<div className={styles['display-content']}>
								<Form.Item
									label={formatMessage({ id: 'esl.device.config.scan.round' })}
								>
									{getFieldDecorator('scanPeriod', {
										initialValue: 15,
									})(
										<Select
											onChange={this.handleSelectChange}
											style={SELECT_STYLE}
										>
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
										initialValue: true,
										valuePropName: 'checked',
									})(<Switch />)}
								</Form.Item>
								<Form.Item label=" " colon={false}>
									<Button type="primary">
										{formatMessage({ id: 'btn.save' })}
									</Button>
								</Form.Item>
							</div>
						</Card>
						{/* 广播这一期不做 */}
						{/* <Card
									title={formatMessage({ id: 'esl.device.config.boardcast' })}
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
