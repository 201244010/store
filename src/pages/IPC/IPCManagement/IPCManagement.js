
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import DeviceBasicInfo from './DeviceBasicInfo';
import ActiveDetection from './ActiveDetection';
import BasicParams from './BasicParams';
import SoftwareUpdate from './SoftwareUpdate';
import InitialSetting from './InitialSetting';
import CardManagement from './CardManagement';
import styles from './IPCManagement.less';

const Time = 15000;

@connect(
	state => {
		const { 
			activeDetection:{ isReading: isActiveDetectionReading, isSaving: isActiveDetectionSaving }, 
			ipcBasicParams:{ isReading: isBasicParamsReading, isSaving: isBasicParamsSaving }, 
			cardManagement:{ isLoading }, 
			ipcBasicInfo:{ status } } = state;
		const deviceBasicInfoLoading = status === 'loading' || false;
		const activeDetectionLoading = isActiveDetectionReading || isActiveDetectionSaving === 'saving';
		const basicParamsLoading = isBasicParamsReading || isBasicParamsSaving === 'saving';
		const cardManagementLoading = isLoading;

		const loading = deviceBasicInfoLoading || activeDetectionLoading || basicParamsLoading || cardManagementLoading;
		
		return {
			loading
		};
	},
	dispatch => ({
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class IPCManagement extends Component {

	constructor(props) {
		super(props);
		this.timer = null;
	}

	componentDidMount(){
		const { loading } = this.props;
		if(loading){
			this.timerHandler();
		}
	}

	componentWillReceiveProps(nextProps){
		const { loading: nextLoading } = nextProps;
		const { loading } = this.props;
		// loading ^ nextLoading
		if((!loading && nextLoading) || (loading && !nextLoading)){
			this.timerHandler();
		}
	}

	timerHandler = () => {
		if(this.timer === null){
			this.timer = setTimeout(this.showModalHandler,Time);
		}else{
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	showModalHandler = () => {
		const { goToPath } = this.props;
		Modal.error({
			title: formatMessage({ id: 'ipcManagement.operate.fail'}),
			content: formatMessage({ id: 'ipcManagement.loading.fail.tips'}),
			okText: formatMessage({ id: 'ipcManagemet.confirm'}),
			onOk:() => goToPath('deviceList')
		});
	}

	render() {
		const { location, loading } = this.props;
		const { query: {sn, showModal} } = location;
		return (
			<Spin spinning={loading}>
				<div className={styles.wrapper}>
					<DeviceBasicInfo sn={sn} />
					<ActiveDetection sn={sn} />
					<BasicParams sn={sn} />
					<CardManagement sn={sn} />
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



