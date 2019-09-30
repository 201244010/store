
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import DeviceBasicInfo from './DeviceBasicInfo';
import ActiveDetection from './ActiveDetection';
import BasicParams from './BasicParams';
// import NetworkSetting from './NetworkSetting';
// import CloudService from './CloudService';
import SoftwareUpdate from './SoftwareUpdate';
import InitialSetting from './InitialSetting';
import CardManagement from './CardManagement';
import styles from './IPCManagement.less';

const Time = 15000;

@connect(
	null,
	dispatch => ({
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class IPCManagement extends Component {

	state={
		loadingState:{
			activeDetection: true,
			basicParams: true,
			cardManagement: true,
			deviceBasicInfo: true
		},
		globalLoadingState: true,
		timer: null
	}

	componentDidMount(){
		this.dectectLoadingHandler();
	}

	setLoadingState = (payload) => {
		let { loadingState } = this.state;
		loadingState = {
			...loadingState,
			...payload,
		};

		this.setState({
			loadingState,
		}, this.dectectLoadingHandler);
	}

	dectectLoadingHandler = () => {
		const {loadingState:{ activeDetection, basicParams, cardManagement, deviceBasicInfo}} = this.state;
		let { timer } = this.state;
		const globalLoadingState = activeDetection || basicParams || cardManagement || deviceBasicInfo;
		if(globalLoadingState === true){
			if(timer === null){
				timer = setTimeout(this.showModalHandler,Time);
				this.setState({
					timer,
					globalLoadingState
				});
			}
		}else if(timer !== null){
			clearTimeout(timer);
			this.setState({
				globalLoadingState,
				timer: null
			});
		}
		this.setState({
			globalLoadingState
		});

	}

	showModalHandler = () => {
		const { goToPath } = this.props;
		// this.setState({
		// 	globalLoadingState: false
		// });
		Modal.error({
			title: formatMessage({ id: 'ipcManagement.operate.fail'}),
			content: formatMessage({ id: 'ipcManagement.loading.fail.tips'}),
			okText: formatMessage({ id: 'ipcManagemet.confirm'}),
			onOk:() => goToPath('deviceList')
		});
	}

	render() {
		// console.log(this.props);
		const { location } = this.props;
		const { query: {sn, showModal} } = location;
		const { globalLoadingState } = this.state;
		return (
			<Spin spinning={globalLoadingState}>
				<div className={styles.wrapper}>
					<DeviceBasicInfo sn={sn} setLoadingState={this.setLoadingState} />
					<ActiveDetection sn={sn} setLoadingState={this.setLoadingState} />
					<BasicParams sn={sn} setLoadingState={this.setLoadingState} />
					<CardManagement sn={sn} setLoadingState={this.setLoadingState} />
					<InitialSetting sn={sn} />
					<SoftwareUpdate sn={sn} showModal={showModal} />
					{/* <NetworkSetting sn={sn} /> */}
					{/* <CloudService sn={sn} /> */}
				</div>
			</Spin>

		);
	}
}

export default IPCManagement;



