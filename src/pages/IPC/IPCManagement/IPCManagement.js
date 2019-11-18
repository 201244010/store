
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
// import NVRManagement from './NVRManagement';
import styles from './IPCManagement.less';
// import ipcTypes from '@/constants/ipcTypes';
// import { comperareVersion } from '@/utils/utils';

const Time = 15000;

@connect(
	state => {
		const {
			activeDetection:{ isReading: isActiveDetectionReading, isSaving: isActiveDetectionSaving },
			ipcBasicParams:{ isReading: isBasicParamsReading, isSaving: isBasicParamsSaving },
			cardManagement:{ isLoading },
			ipcBasicInfo:{ status },
			nvrManagement: { loadState} } = state;
		const deviceBasicInfoLoading = status === 'loading' || false;
		const activeDetectionLoading = isActiveDetectionReading || isActiveDetectionSaving === 'saving';
		const basicParamsLoading = isBasicParamsReading || isBasicParamsSaving === 'saving';
		const cardManagementLoading = isLoading || loadState;
		// const nvrLoading = loadState;

		const loadingObj = {
			deviceBasicInfoLoading,
			activeDetectionLoading,
			basicParamsLoading,
			cardManagementLoading,
			// nvrLoading
		};

		// const loading = deviceBasicInfoLoading || activeDetectionLoading || basicParamsLoading || cardManagementLoading || nvrLoading;

		return {
			loadingObj
		};
	},
	dispatch => ({
		getDeviceInfo({ sn }) {
			return dispatch({
				type: 'ipcList/getDeviceInfo',
				payload: {
					sn
				}
			}).then(info => info);
		},
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		getDeviceType: async(sn) => {
			const result = await dispatch({
				type: 'ipcList/getDeviceType',
				payload: {sn}
			});
			return result;
		}
	})
)
class IPCManagement extends Component {

	constructor(props) {
		super(props);
		this.timer = null;
		this.state = {
			loading: true,
			isOnline: true,
		};
	}

	async componentDidMount(){
		const { 
			getDeviceInfo,
			location,
			loadingObj:{
				deviceBasicInfoLoading,
				activeDetectionLoading,
				basicParamsLoading,
				cardManagementLoading,
				// nvrLoading
			}
		 } = this.props;
		const { query: {sn} } = location;
		const { isOnline } = await getDeviceInfo({sn});
		// const ipcType = await getDeviceType(sn);
		// let loading = true;

		// if(ipcTypes[ipcType].hasNVR){
		// 	loading = deviceBasicInfoLoading || activeDetectionLoading || basicParamsLoading || cardManagementLoading || nvrLoading;
		// }else{
		const loading = deviceBasicInfoLoading || activeDetectionLoading || basicParamsLoading || cardManagementLoading;

		// }

		if(loading && isOnline){
			this.timerHandler();
		}
		this.setState({
			isOnline
		});
	}

	componentWillReceiveProps(nextProps){
		const { isOnline } = this.state;
		const { loadingObj: nextLoadingObj } = nextProps;
		const { loadingObj } = this.props;
		// const { ipcType } = this.state;
		// let loading;
		// let nextLoading;

		const {
			deviceBasicInfoLoading: nextDeviceBasicInfoLoading,
			activeDetectionLoading: nextActiveDetectionLoading,
			basicParamsLoading: nextBasicParamsLoading,
			cardManagementLoading: nextCardManagementLoading,
			// nvrLoading: nextNvrLoading
		} = nextLoadingObj;

		const {
			deviceBasicInfoLoading,
			activeDetectionLoading,
			basicParamsLoading,
			cardManagementLoading,
			// nvrLoading
		} = loadingObj;

		// if(ipcTypes[ipcType].hasNVR){
		// 	loading = deviceBasicInfoLoading || activeDetectionLoading || basicParamsLoading || cardManagementLoading || nvrLoading;
		// 	nextLoading = nextDeviceBasicInfoLoading || nextActiveDetectionLoading || nextBasicParamsLoading || nextCardManagementLoading || nextNvrLoading;
		// }else{
		const loading = deviceBasicInfoLoading || activeDetectionLoading || basicParamsLoading || cardManagementLoading;
		const nextLoading = nextDeviceBasicInfoLoading || nextActiveDetectionLoading || nextBasicParamsLoading || nextCardManagementLoading;
		// }

		// loading ^ nextLoading
		if((!loading && nextLoading) || (loading && !nextLoading)){
			if(isOnline){
				this.timerHandler();
			}
		}
	}

	timerHandler = () => {
		if(this.timer === null){
			this.timer = setTimeout(this.showModalHandler,Time);
			this.setState({
				loading: true
			});
		}else{
			clearTimeout(this.timer);
			this.timer = null;
			this.setState({
				loading: false
			});
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
		const { location } = this.props;
		const { loading, isOnline } = this.state;

		const { query: {sn, showModal} } = location;
		return (
			<Spin spinning={isOnline && loading}>
				<div className={styles.wrapper}>
					<DeviceBasicInfo sn={sn} isOnline={isOnline} />
					<ActiveDetection sn={sn} isOnline={isOnline} />
					<BasicParams sn={sn} isOnline={isOnline} />
					{/* {ipcTypes[ipcType].hasNVR&&<NVRManagement sn={sn} />} */}
					<CardManagement sn={sn} isOnline={isOnline} />
					<InitialSetting sn={sn} isOnline={isOnline} />
					<SoftwareUpdate sn={sn} showModal={showModal} location={location} isOnline={isOnline} />
					{/* <NetworkSetting sn={sn} /> */}
					{/* <CloudService sn={sn} /> */}
				</div>
			</Spin>

		);
	}
}

export default IPCManagement;



