import React, { Component } from 'react';
import { Card, Form, Select, Button, Input, Icon, Spin, Modal,Alert } from 'antd';
import { FormattedMessage} from 'umi/locale';
import{ connect } from 'dva';

import styles from './NetworkSetting.less';

const {Option} = Select;

const mapStateToProps = (state) => {
	const { networkSetting } = state;
	return {
		networkSetting
	};
};
const mapDispatchToProps = (dispatch) => ({
		loadCurrentWifi: () => {
			dispatch({
				type: 'networkSetting/read'
			});
		},
		loadWifiList: () => {
			dispatch({
				type: 'networkSetting/loadList'
			});
		},
		chooseNet: (id) => {
			dispatch({
				type: 'networkSetting/select',
				payload: id
			});
		},
		connectNet: () => {
			dispatch({
				type: 'networkSetting/connect'
			});
		},
	});
@connect(mapStateToProps, mapDispatchToProps)
class NetworkSetting extends Component {
	state = {
		visible:false,
		isSelect:false,
		isConnecting:false,
	}

	onSelect = () => {
		this.setState({
			isSelect:true
		});
	}

	showModal = () =>{
		const { loadWifiList } = this.props;
		loadWifiList();
		this.setState({
			visible:true,
		});
	}

	handleCancel = () => {
		this.setState({
			visible:false
		});
	}

	componentDidMount = () => {
		const { loadCurrentWifi } = this.props;
		loadCurrentWifi();
	}

	handleConnect = () => {
		this.setState({
			isConnecting: true
		});

	}

	render() {
		const { networkSetting } = this.props;
		const { wifiList, status, current, isSearch, isConnected } = networkSetting;
		const { visible, isSelect, isConnecting } = this.state;
		// const tempList = [
		// 	{
		// 		id:'1',
		// 		name:'aaaa',
		// 		password:'1234'
		// 	},
		// 	{
		// 		id:'2',
		// 		name:'bbbb',
		// 		password:'12345'
		// 	}
		// ];
		// console.log(this.props)
		return (
			<div>
				<Card className={styles.card} title={<FormattedMessage id='networkSetting.title' />}>
					<Form>
						<Form.Item label={<FormattedMessage id='networkSetting.wifi' />}>
							<span>{current}<Icon type='wifi' /></span>
						</Form.Item>
						<Form.Item>
							<Button type='default' onClick={this.showModal}>
								<FormattedMessage id='networkSetting.modification' />
							</Button>
						</Form.Item>
					</Form>
				</Card>
				<Modal 
					visible={visible}
					title='修改WiFi网络'
					closable={false}
					footer={[
						<Button onClick={this.handleCancel}><FormattedMessage id='networkSetting.cancel' /></Button>,
						<Button type='primary' onClick={this.handleConnect}><FormattedMessage id='networkSetting.connect' /></Button>
					]}
				>
					
					{
						isSearch?
							<div>
								<Spin />
								<FormattedMessage id='networkSetting.searchMsg' />
							</div>
							:
							<Form onSubmit={this.handleSubmit}>
								<Form.Item label={<FormattedMessage id='networkSetting,ssidList' />}>
									<Select onChange={this.onSelect} placeholder={<FormattedMessage id='networkSetting.chooseNetwork' />}>
										{
											wifiList ? wifiList.map(item => <Option value={item.id}>{item.name}<Icon type="wifi" /></Option>) : ''
										}
									</Select>
								</Form.Item>
								{
									isSelect ? 
										<Form.Item label={<FormattedMessage id='networkSetting.password' />}>
											<Input suffix={<Icon type='lock' />} type='password' />
										</Form.Item> : ''
								}
								{
									isConnecting && !isConnected ? <FormattedMessage id='networkSetting.connectMsg' /> : ''
								}
							</Form>
					}
					{status === 'success' ? <Alert type='success' message={<FormattedMessage id='networkSetting.successMsg' />} />:''}
					{status === 'error' ? <Alert type='error' message={<FormattedMessage id='networkSetting.failMsg' />} />:''}
				</Modal>
			</div>
			
		);
	}
}

export default NetworkSetting;