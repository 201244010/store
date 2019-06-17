import React, { Component } from 'react';
import { Card, Form, Select, Button, Input, Icon, Spin, Modal, Alert } from 'antd';
import { formatMessage } from 'umi/locale';
import{ connect } from 'dva';

import { FORM_ITEM_LAYOUT, TAIL_FORM_ITEM_LAYOUT } from './IPCManagement';

import styles from './NetworkSetting.less';

const mapStateToProps = (state) => {
	const { ipNetworkSetting } = state;
	return {
		settings: ipNetworkSetting
	};
};

const mapDispatchToProps = (dispatch) => ({
	loadCurrentWifi: (sn) => {
		dispatch({
			type: 'ipNetworkSetting/read',
			sn
		});
	},
	loadWifiList: (sn) => {
		// console.log('loadWifiList', sn);
		dispatch({
			type: 'ipNetworkSetting/loadWifiList',
			sn
		});
	},
	// chooseNet: (id) => {
	// 	dispatch({
	// 		type: 'ipNetworkSetting/select',
	// 		payload: id
	// 	});
	// },
	connectWifi: ({ sn, password, ssid }) => {
		dispatch({
			type: 'ipNetworkSetting/connect',
			payload: {
				sn, password, ssid
			}
		});
	},
});

const STATUS = {
	NORMAL: 'normal',
	CONNECTED: 'connected',
	CONNECTING: 'connecting',
	FAILED: 'failed'
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class NetworkSetting extends Component {
	state = {
		visible:false,
		status: STATUS.NORMAL
	}

	onSelect = (value) => {
		this.setState({
			selected: value
		});
	}

	showModal = () =>{
		const { loadWifiList, sn } = this.props;

		loadWifiList(sn);

		this.setState({
			visible: true,
		});
	}

	handleCancel = () => {
		const { form: { setFieldsValue } } = this.props;

		setFieldsValue({
			ssid: ''
		});

		this.setState({
			status: STATUS.NORMAL,
			visible: false
		});
	}

	componentWillReceiveProps = (props) => {
		const { settings } = props;
		const { isConnected } = settings;

		const { status } = this.state;
		// 若状态是正在连接，同时数据返回connected，则状态边为connected
		if ( status === STATUS.CONNECTING ){

			if (isConnected === 'connected') {
				this.setState({
					status: STATUS.CONNECTED
				});
			} else if (isConnected === 'failed'){
				this.setState({
					status: STATUS.FAILED
				});
			}
		}
	}

	componentDidMount = () => {
		const { loadCurrentWifi, sn } = this.props;
		loadCurrentWifi(sn);
	}

	handleConnect = () => {
		const { connectWifi, sn, form } = this.props;
		const { getFieldValue, validateFields } = form;

		const ssidValue = getFieldValue('ssid');
		const isEncrypted = this.isEncrypted(ssidValue);

		const callback = (errors, { ssid, password }) => {
			if (!errors) {
				connectWifi({
					sn,
					ssid,
					password
				});

				this.setState({
					status: STATUS.CONNECTING
				});
			}
		};

		if (isEncrypted) {
			// 若加密，则验证password和ssid
			validateFields(['ssid', 'password'], callback);
		}else{
			validateFields(['ssid'], callback);
		}

	}

	isEncrypted = () => {
		const { settings } = this.props;
		const { wifiList } = settings;

		const { selected } = this.state;

		const selectedWifi = wifiList.filter(item => {
			if (item.ssid === selected) {
				return true;
			}
			return false;
		});

		let encrypted = false;
		if (selectedWifi.length !== 0) {
			encrypted = selectedWifi[0].isEncrypted;
		};

		return encrypted;
	}

	render() {
		const { settings, form } = this.props;
		const { wifiList, loadingSsid, ssid, loadingWifiList } = settings;
		const { visible, status } = this.state;

		const { getFieldDecorator, getFieldValue } = form;

		const isEncrypted = this.isEncrypted();

		return (
			<>
				<Spin spinning={loadingSsid}>
					<Card className={styles.card} title={formatMessage({ id: 'networkSetting.title' })}>
						<Form>
							<Form.Item {...FORM_ITEM_LAYOUT} label={formatMessage({id: 'networkSetting.wifi'})}>
								<span className={styles.ssid}>{ssid}</span>
								<Icon type='wifi' />
							</Form.Item>
							<Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
								<Button type='default' onClick={this.showModal}>
									{ formatMessage({ id: 'networkSetting.modification'}) }
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Spin>

				<Modal
					visible={visible}
					title={formatMessage({id: 'networkSetting.changeNetwork'})}
					closable={false}

					footer={
						status === STATUS.CONNECTED ? [
							<Button
								type='primary'
								onClick={this.handleCancel}
								key='btn-close'
							>
								{formatMessage({id: 'networkSetting.close'})}
							</Button>
						] : [
							<Button
								key='btn-cancel'
								onClick={this.handleCancel}
							>
								{formatMessage({id: 'networkSetting.cancel'})}
							</Button>,
							<Button
								type='primary'
								disabled={getFieldValue('ssid') === '' || loadingWifiList === true}
								key='btn-connect'
								onClick={this.handleConnect}
							>
								{formatMessage({id: 'networkSetting.connect'})}
							</Button>
						]
					}
				>
					{
						status === STATUS.CONNECTED ?
							<Alert type='success' showIcon banner message={formatMessage({id: 'networkSetting.successMsg'})} />
							: ''
					}
					{
						status === STATUS.FAILED ?
							<Alert type='error' showIcon banner message={formatMessage({id: 'networkSetting.failMsg'})} />
							:''
					}
					<Spin
						spinning={status === STATUS.CONNECTING}
						tip={formatMessage({id: 'networkSetting.connectMsg'})}
					>
						{
							loadingWifiList ?
								<div className={styles['loading-wifi']}>
									<Spin />
									<span className={styles.text}>{formatMessage({id: 'networkSetting.searchMsg'})}</span>
								</div>
								:
								<Form onSubmit={this.handleSubmit}>
									<Form.Item label={formatMessage({id: 'networkSetting,ssidList'})}>
										{
											getFieldDecorator('ssid', {
												rules: [
													{ required: true, message: formatMessage({id: 'networkSetting.noSsid'}) }
												]
											})(
												<Select
													initialValue={ssid}
													className={styles['wifi-select']}
													onChange={this.onSelect}
													placeholder={formatMessage({id: 'networkSetting.chooseNetwork'})}
												>
													{
														wifiList.map(item => (
															<Select.Option
																className={styles['wifi-option']}
																key={item.ssid}
																value={item.ssid}
															>
																<span>{ item.ssid }</span>
																<Icon className={styles['wifi-icon']} type="wifi" />
															</Select.Option>
														))
													}
												</Select>
											)
										}
									</Form.Item>
									{
										getFieldValue('ssid') !== '' && isEncrypted ?
											<Form.Item label={formatMessage({id: 'networkSetting.password'})}>
												{
													getFieldDecorator('password', {
														rules: [
															{ required: true, message: formatMessage({id: 'networkSetting.noPassword'}) }
														]
													})(
														<Input suffix={<Icon type='lock' />} type='password' />
													)
												}
											</Form.Item>
											: ''
									}
									{/* {
										isConnecting && !isConnected ?
											<div>
												<Spin />
												<span className={styles.loading}>{ formatMessage({id: 'networkSetting.connectMsg'}) }</span>
											</div>
											: ''
									} */}
								</Form>
						}
					</Spin>
				</Modal>
			</>

		);
	}
}

export default NetworkSetting;