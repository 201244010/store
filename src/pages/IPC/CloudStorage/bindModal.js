import React from 'react';
import { Modal, Table, Radio, message, Checkbox, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { ERR_IPC_NOT_EXIST, ERR_SERVICE_SUBSCRIBE_ERROR , ERROR_OK } from '@/constants/errorCode';
import styles from './BindModal.less';



const SERVICE = {
	'YCC0001': {
		serviceName: formatMessage({id: 'cloudStorage.seven.days.service'}),
		expireTime: formatMessage({id: 'cloudStorage.one.month'})
	},
	// 以下都是未确定product_no的
	'YCC0002': {
		serviceName: formatMessage({id: 'cloudStorage.seven.days.service'}),
		expireTime:  formatMessage({id: 'cloudStorage.half.year'}),
	},
	'YCC0003': { 
		serviceName: formatMessage({id: 'cloudStorage.seven.days.service'}),
		expireTime: formatMessage({id: 'cloudStorage.one.year'}),
	},
	'YCC0004': {
		serviceName: formatMessage({id: 'cloudStorage.thirty.days.service'}),
		expireTime: formatMessage({id: 'cloudStorage.half.year'}),
	},
	'YCC0005': { 
		serviceName: formatMessage({id: 'cloudStorage.thirty.days.service'}),
		expireTime: formatMessage({id: 'cloudStorage.one.year'}),
	}
};

const THREE_DAYS_SECONDS = 259200;

@connect(
	(state) => {
		const { cloudStorage:{ storageIpcList }, loading } = state;
		return {
			storageIpcList,
			loading
		};
	},
	(dispatch) => ({
		navigateTo: (pathId,linkType) => dispatch({
			type: 'menu/goToPath',
			payload: {
				pathId,
				linkType
			}
		}),
		getStorageIpcList:(sn) => (dispatch({
			type:'cloudStorage/getStorageIpcList',
			payload: { 
				sn
			}
		})),
		order:(productNo, deviceSn) => dispatch({
			type:'cloudStorage/order',
			payload: {
				productNo, 
				deviceSn
			}
		})

	}))
class BindModal extends React.Component{
	columns = [
		{
			key:'seleted',
			render: (obj) => {
				const { deviceSn, validTime } = obj;
				let disabled;
				if(validTime < THREE_DAYS_SECONDS){
					disabled = false;
				}else{
					disabled = true;
				}
				return(<Radio disabled={disabled} value={deviceSn} />);
			}
		},
		{
			key:'deviceName',
			title: formatMessage({ id: 'cloudStorage.device.name'}),
			dataIndex: 'deviceName',
		},
		{
			key: 'sn',
			title: 'SN',
			dataIndex: 'deviceSn',
		},
		{
			key: 'status',
			title: formatMessage({ id: 'cloudStorage.service.status'}),
			dataIndex: 'status',
			render: (status) => {
				if(status === 1){
					return (<span>{formatMessage({ id: 'cloudStorage.opened'})}</span>);
				}
				if(status === 2){
					return(<span>{formatMessage({ id: 'cloudStorage.not.opened'})}</span>);
				}
				return(<span>{formatMessage({ id: 'cloudStorage.expired'})}</span>);
			}
		},
		{
			key: 'validTime',
			title: formatMessage({ id: 'cloudStorage.validTime'}),
			dataIndex:'validTime',
			render:(validTime) => {
				const duration = Math.floor(validTime / 3600);
				const days = Math.floor(duration/24);
				const hours = duration%24;
				if(days === 0 && hours === 0){
					return(<span>--</span>);
				}
				// if(hours === 0){
				// 	return (<span>{days}天</span>);
				// }
				// if(days === 0){
				// 	return (<span>{hours}小时</span>);
				// }
				return (
					<span>
						{days}{formatMessage({ id: 'cloudStorage.day'})}{hours}{formatMessage({ id: 'cloudStorage.hour'})}
					</span>);

			}
		},
		{
			key: 'img',
			title: formatMessage({ id: 'cloudStorage.monitoringArea.img'}),
			dataIndex:'imgUrl',
			render: (img) => {
				if(img){
					return (<img className={styles['ipc-img']} src={img} /> );
				}
				return(<div className={styles['no-img']} />);
			}
		}
	];

	constructor(props) {
		super(props);
		this.state = {
			selectedValue: '',
			btnDisable: true,
			isAgree: false
		};
	}

	async componentDidMount(){
		await this.init();
		// const { getStorageIpcList, sn } = this.props;
		// const { isAgree } = this.state;
		// const deviceList = await getStorageIpcList(sn);
		// let selectedValue = '';
		// let btnDisable = true;
		// for(let i=0; i < deviceList.length; i++){
		// 	if(deviceList[i].deviceSn === sn && deviceList[i].validTime < THREE_DAYS_SECONDS){
		// 		selectedValue = sn;
		// 		break;
		// 	}
		// }
		// if(selectedValue && isAgree){
		// 	btnDisable = false;
		// }
		// this.setState({
		// 	btnDisable,
		// 	selectedValue,
		// });
	}

	async componentWillReceiveProps(nextProps){
		const { visible } = this.props;
		const { visible: nextVisible } = nextProps;
		if(nextVisible === true && visible !== nextVisible ){
			// await getStorageIpcList(sn);
			await this.init();
		}
	}

	onCancel= () =>{
		const { handleCancel } = this.props;
		this.setState({
			selectedValue: '',
			btnDisable: true,
			isAgree: false
		});
		handleCancel();
	}

	onChange = e => {
		const { isAgree } = this.state;
		let btnDisable = true;
		if(isAgree) btnDisable = false;
		this.setState({
		  selectedValue: e.target.value,
		  btnDisable
		});
	};

	handleOk = async() => {
		const { navigateTo, storageIpcList, productNo } = this.props;
		const { selectedValue } = this.state;
		const { order } = this.props;
		if(storageIpcList.length !== 0){
			const response = await order(productNo, selectedValue);
			const { code } = response;
			if(code === ERROR_OK){
				navigateTo('subscriptionSuccess');
			}else if(code === ERR_SERVICE_SUBSCRIBE_ERROR){
				message.error( formatMessage({ id: 'cloudStorage.binding.err.service.subscribe'}));
			}else if(code === ERR_IPC_NOT_EXIST){
				message.error( formatMessage({ id: 'cloudStorage.binding.ipc.not.exist'}));
			}
		}else{
			this.onCancel();
		}
		
	}

	agreementChangeHandler = (e) =>{
		const { selectedValue } = this.state;
		const isAgree = e.target.checked;
		let btnDisable = true;
		if(isAgree && selectedValue !== ''){
			btnDisable = false;
		}
		this.setState({
			isAgree,
			btnDisable
		});
		
	}

	async init(){
		const { getStorageIpcList, sn } = this.props;
		const { isAgree } = this.state;
		const deviceList = await getStorageIpcList(sn);
		let selectedValue = '';
		let btnDisable = true;
		for(let i=0; i < deviceList.length; i++){
			if(deviceList[i].deviceSn === sn && deviceList[i].validTime < THREE_DAYS_SECONDS){
				selectedValue = sn;
				break;
			}
		}
		if(selectedValue && isAgree){
			btnDisable = false;
		}
		this.setState({
			btnDisable,
			selectedValue,
		});
	}

	

	render(){
		const { storageIpcList, productNo, visible, navigateTo, loading } = this.props;
		const { selectedValue, btnDisable, isAgree } = this.state;
		return(
			<Modal
				title={formatMessage({ id:'cloudStorage.binding.ipc'})}
				className={styles['bind-modal']}
				width={620}
				visible={visible}
				closable={false}
				onOk={this.handleOk}
				okText={storageIpcList.length === 0 ? 
					formatMessage({ id: 'cloudStorage.confirm'}) : 
					formatMessage({ id: 'cloudStorage.confirm.subscribe'})}
				onCancel={this.onCancel}
				okButtonProps={{
					disabled: storageIpcList.length === 0 ? false : btnDisable,
					loading: loading.effects['cloudStorage/order']
				}}
				cancelButtonProps={{
					style: storageIpcList.length === 0 ? {display:'none'} : {},
					loading: loading.effects['cloudStorage/order']
				}}
			>
				<Spin spinning={loading.effects['cloudStorage/order'] || loading.effects['cloudStorage/getStorageIpcList']}>
					<div className={styles['modal-content']}>
						<p className={styles.tips}>
							{formatMessage({id: 'cloudStorage.open.tips.first'})}
							<span className={styles.time}>{SERVICE[productNo].serviceName}</span>
							{formatMessage({id:'cloudStorage.open.tips.second'})}
							<span className={styles.time}>{SERVICE[productNo].expireTime}</span>
							{formatMessage({ id:'cloudStorage.open.tips.third'})}
						</p>
						<Radio.Group onChange={this.onChange} value={selectedValue}>
							<Table
								// loading={loading.effects['cloudStorage/getStorageIpcList']}
								className={styles.table}
								bordered 
								columns={this.columns}
								locale={{
									emptyText: formatMessage({id: 'cloudStorage.no.ipc'})
								}}
								rowKey='deviceSn'
								dataSource={storageIpcList}
								pagination={{
									pageSize: 5
								}}
							/>
						</Radio.Group>
						<div className={loading.effects['cloudStorage/getStorageIpcList'] ? styles['agreement-loading'] : styles.agreement}>
							<Checkbox onChange={this.agreementChangeHandler} checked={isAgree}>
								{formatMessage({id: 'cloudStorage.subscription.agreement.tips'})}
								<a 
									className={styles['agreement-content']} 
									onClick={() => {
										navigateTo('serviceProtocol', 'open');
									}}
								>
									{formatMessage({id: 'cloudStorage.subscription.agreement'})}
								</a>
							</Checkbox>
						</div>
					</div>
				</Spin>
			</Modal>
		);
	}
}

export default BindModal;