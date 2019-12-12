import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Table, Radio, message, Checkbox, Spin, Card, Form, Input, Button, Modal } from 'antd';
import React from 'react';
import { ERR_IPC_NOT_EXIST, ERR_SERVICE_SUBSCRIBE_ERROR , ERROR_OK, ERR_FREE_SERVICE_USED } from '@/constants/errorCode';
import { SERVICE_TYPE } from '@/constants/cloudStorage';
import styles from './OrderSubmission.less';
import { phone, mail } from '@/constants/regexp';

const FREE_PRODUCT_NO = 'YCC0002';

@connect(
	(state) => {
		const { cloudStorage:{ bundledStatus }, loading } = state;
		return {
			loading,
			bundledStatus
		};
	},
	(dispatch) => ({
		navigateTo: (pathId, urlParams, linkType) => dispatch({
			type: 'menu/goToPath',
			payload: {
				pathId,
				urlParams,
				linkType
			}
		}),
		getStorageIpcList:(sn) => (dispatch({
			type:'cloudStorage/getStorageIpcList',
			payload: { 
				sn
			}
		})),
		// ipcSelectedList, invoiceInfo, productNo, bundledStatus
		order:(params) => dispatch({
			type:'cloudStorage/order',
			payload: params
		})

	}))
@Form.create()
class OrderSubmission extends React.Component{
	columns = [
		{
			key:'seleted',
			render: (obj) => {
				const { deviceSn } = obj;
				return(<Checkbox value={deviceSn} />);
			}
		},
		{
			key:'deviceName',
			title: formatMessage({ id: 'cloudStorage.device.name'}),
			dataIndex: 'deviceName',
			render:(deviceName) => (<div className={styles.deviceName}>{deviceName}</div>)
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
				if(status === 3){
					return(<span>{formatMessage({ id: 'cloudStorage.expired'})}</span>);
				}
				return(<span>{formatMessage({ id: 'cloudStorage.failure'})}</span>);
				
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
			selectedValue: [],
			btnDisable: true,
			isAgree: false,
			sn: undefined,
			productNo: undefined,
			invoiceSelectValue: 0, // 0:无需发票, 1: 电子普通发票, 2:增值税普通发票
			vbrkSelectValue: 1, // 1:个人, 2: 企业
			unitPrice: 0,
			count: 0,
			freeStatus: false,
			storageIpcList: [],
			isNeedCoverTip: false,
			noChange: false,
			// isNeedInputReady: false,
		};
	}

	componentDidMount(){
		const { location, navigateTo } = this.props;
		const { query: { sn, productNo } } = location;
		if(!productNo || Object.keys(SERVICE_TYPE).indexOf(productNo) === -1){
			navigateTo('cloudStorage');
			return;
		}

		this.setState({
			sn,
			productNo,
			count: sn && !Array.isArray(sn) ? 1 : 0,
		}, async() => {
			await this.init();
		});
	}

	async componentWillReceiveProps(nextProps){
		const { visible } = this.props;
		const { visible: nextVisible } = nextProps;
		if(nextVisible === true && visible !== nextVisible ){
			await this.init();
		}
	}

	onCancel= () =>{
		const { handleCancel } = this.props;
		this.setState({
			selectedValue: [],
			btnDisable: true,
			isAgree: false
		});
		handleCancel();
	}

	ipcSelectHandler = checkedValues => {
		const { sn } = this.state;
		if(checkedValues.indexOf(sn) === -1 && !Array.isArray(sn) && sn){
			checkedValues.push(sn);
			this.setState({
				noChange: true
			});
		}


		this.setState({
			selectedValue: checkedValues,
			count: checkedValues.length,
		}, () => {
			this.checkedBtnDisable();
		});
	};

	orderHandler = async() => {
		const { form:{ getFieldsValue }} = this.props;
		const { selectedValue, productNo, invoiceSelectValue, vbrkSelectValue, freeStatus } = this.state;
		const { order } = this.props;
		
		const invoiceInfo = invoiceSelectValue === 0 ? undefined : {
			// ...values,
			titleName: getFieldsValue().titleName,
			taxRegisterNo: getFieldsValue().taxRegisterNo,
			mobilePhone: vbrkSelectValue === 1 ? getFieldsValue().personalPhone : getFieldsValue().companyPhone,
			email: vbrkSelectValue === 1 ? getFieldsValue().personalEmail : getFieldsValue().companyEmail,
			invoiceKind: invoiceSelectValue,
			titleType: vbrkSelectValue,
		};
		const response = await order({
			ipcSelectedList: selectedValue,
			invoiceInfo,
			productNo,
			bundledStatus: freeStatus ? 1 : 2
		});
		// return response;
		const { code, data } = response;
		if(code === ERROR_OK){
			const { orderNo } = data;
			return orderNo;
		}
		if(code === ERR_SERVICE_SUBSCRIBE_ERROR){
			message.warning( formatMessage({ id: 'cloudStorage.binding.err.service.subscribe'}));
		}else if(code === ERR_IPC_NOT_EXIST){
			message.warning( formatMessage({ id: 'cloudStorage.binding.ipc.not.exist'}));
			await this.init();
		}else if(code === ERR_FREE_SERVICE_USED){
			message.warning( formatMessage({ id: 'cloudStorage.free.service.used'}));
		}
		return '-1';
	}

	agreementChangeHandler = (e) =>{
		const isAgree = e.target.checked;
		this.setState({
			isAgree,
		},() => {
			this.checkedBtnDisable();
		});
		
	}

	invoiceSelectHandler = (e) => {
		this.setState({
			invoiceSelectValue: e.target.value,
			vbrkSelectValue: 1
		}, ()=>{
			this.checkedBtnDisable();
		});
	}

	checkedBtnDisable = () => {
		const { selectedValue, isAgree } = this.state;
		const { form: { getFieldsValue, getFieldsError }} = this.props;
		let btnDisable = true;
		let noEmpty = true;
		let noFieldError = true;

		for(let i=0; i<Object.keys(getFieldsValue()).length; i++){
			if(Object.keys(getFieldsValue())[i] !== 'companyPhone' && Object.keys(getFieldsValue())[i] !== 'personalPhone'){
				if(getFieldsValue()[Object.keys(getFieldsValue())[i]] === undefined){
					noEmpty = false;
					break;
				}
			}
		}
		for(let i=0; i<Object.keys(getFieldsError()).length; i++){
			if(getFieldsError()[Object.keys(getFieldsError())[i]]){
				noFieldError = false;
				break;
			}
		}
		if(isAgree && selectedValue.length > 0 && noEmpty && noFieldError){
			btnDisable = false;
		}
		this.setState({
			btnDisable
		});
	}

	vbrkSelectHandler = (e) => {
		this.setState({
			vbrkSelectValue: e.target.value,
		}, () => {
			this.checkedBtnDisable();
		});
	}

	payHandler = async () => {
		const { navigateTo } = this.props;
		const isNeedCoverTip = this.checkHasServiceCover();
		if(isNeedCoverTip){
			this.setState({
				isNeedCoverTip
			});
		}else{
			const orderNo = await this.orderHandler();
			if(orderNo === '-1'){
				return;
			}
			navigateTo('paymentPage',{
				orderNo,
			});
		}
	}

	freeSubscribeHandler = async () => {
		const { navigateTo } = this.props;
		const isNeedCoverTip = this.checkHasServiceCover();
		if(isNeedCoverTip){
			this.setState({
				isNeedCoverTip
			});
		}else{
			const orderNo = await this.orderHandler();
			if(orderNo === '-1'){
				return;
			}
			if(orderNo !== ''){
				navigateTo('subscriptionSuccess', {orderNo, status: 'success'});
			}
		}
		
	}

	formOnChangeHandler = () => {
		this.checkedBtnDisable();
	}

	checkHasServiceCover = () => {
		const { selectedValue, storageIpcList, productNo } = this.state;
		let isNeedCoverTip = false;
		for(let i=0; i<selectedValue.length; i++){
			for(let j=0; j<storageIpcList.length; j++){
				if(storageIpcList[j].deviceSn === selectedValue[i] &&
					SERVICE_TYPE[productNo] &&
					storageIpcList[j].serviceTag === SERVICE_TYPE[productNo].serviceTag &&
					storageIpcList[j].status === 1){
					isNeedCoverTip = true;
					break;
				}
			}
		}
		return isNeedCoverTip;
	}

	confirmCoverHandler = async () => {
		const { navigateTo } = this.props;
		const { freeStatus } = this.state;
		const orderNo = await this.orderHandler();
		if(orderNo === '-1'){
			this.setState({isNeedCoverTip:false});
			return;
		}
		if(freeStatus){
			if(orderNo !== ''){
				navigateTo('subscriptionSuccess', {orderNo, status: 'success'});
			}
		}else{
			navigateTo('paymentPage',{
				orderNo,
			});
		}
		
	}

	async init(){
		const { getStorageIpcList } = this.props;
		const { isAgree, sn, productNo } = this.state;
		const deviceList = !Array.isArray(sn) ? await getStorageIpcList(sn) : await getStorageIpcList();
		const { bundledStatus } = this.props;
		const freeStatus = bundledStatus === 1 && productNo === FREE_PRODUCT_NO;
		let storageIpcList = deviceList;
		if(freeStatus){
			storageIpcList = deviceList.filter((item) => (
				item.activeStatus === 1
			));
		}
		
		let selectedValue = [];
		let btnDisable = true;
		for(let i=0; i < storageIpcList.length; i++){
			if(storageIpcList[i].deviceSn === sn){
				selectedValue = [sn];
				this.setState({
					noChange: true
				});
				break;
			}
		}
		if(selectedValue.length > 0 && isAgree){
			btnDisable = false;
		}
		
		this.setState({
			btnDisable,
			selectedValue,
			unitPrice: SERVICE_TYPE[productNo] && !freeStatus ? SERVICE_TYPE[productNo].price : 0,
			freeStatus,
			storageIpcList
		});
	}

	

	render(){

		const { navigateTo, loading, form: { getFieldDecorator } } = this.props;
		const { selectedValue, btnDisable, isAgree, invoiceSelectValue, vbrkSelectValue, unitPrice, count, freeStatus, storageIpcList, isNeedCoverTip, sn, noChange } = this.state;
		const emailValue = vbrkSelectValue === 2 ? 'companyEmail' : 'personalEmail';
		const phoneValue = vbrkSelectValue === 2 ? 'companyPhone' : 'personalPhone';
		return(
			<>
				<Card title={null} bordered={false} className={styles['order-container']}>
					<div className={styles['bind-container']}>
						<h3 className={styles['bind-title']}>{formatMessage({id: 'cloudStorage.bind.ipc'})}</h3>
						<Spin spinning={loading.effects['cloudStorage/order'] || loading.effects['cloudStorage/getStorageIpcList']}>
							<div className={styles.content}>
								<Checkbox.Group onChange={this.ipcSelectHandler} value={selectedValue} disabled={noChange}>
									<Table
										className={styles.table}
										bordered 
										columns={this.columns}
										locale={{
											emptyText: formatMessage({id: 'cloudStorage.no.ipc'})
										}}
										rowKey='deviceSn'
										dataSource={storageIpcList}
										pagination={false}
									/>
								</Checkbox.Group>
								<div className={styles['price-and-num']}>
									<div className={styles['per-price']}>{formatMessage({id: 'cloudStorage.per.price'})}¥{unitPrice}</div>
									<div>{formatMessage({id: 'cloudStorage.num'})}{count}</div>
								</div>
							</div>
						</Spin>
					</div>
					<div className={styles.invoice}>
						<h3 className={styles['invoice-title']}>{formatMessage({id: 'cloudStorage.invoice'})}</h3>
						<div className={styles['select-invoice']}>
							<Radio.Group onChange={this.invoiceSelectHandler} defaultValue={0}>
								<Radio.Button value={0}>{formatMessage({id: 'cloudStorage.noNeed.invoice'})}</Radio.Button>
								<Radio.Button value={1} disabled={freeStatus}>{formatMessage({id: 'cloudStorage.elec.invoice'})}</Radio.Button>
								<Radio.Button disabled value={2}>{formatMessage({id: 'cloudStorage.normal.invoice'})}</Radio.Button>
							</Radio.Group>
						</div>
						{invoiceSelectValue !== 0 &&
						<div className={styles.vbrk}>
							<h4 className={styles['vbrk-title']}>{formatMessage({id: 'cloudStorage.invoice.title'})}</h4>
							<Radio.Group className={styles['vbrk-select']} onChange={this.vbrkSelectHandler} defaultValue={1}>
								<Radio value={1}>{formatMessage({id: 'cloudStorage.invoice.personal'})}</Radio>
								<Radio value={2}>{formatMessage({id: 'cloudStorage.invoice.company'})}</Radio>
							</Radio.Group>
							<Form layout='vertical' onChange={this.formOnChangeHandler}>
								{vbrkSelectValue === 2 &&
								<div className={styles['vbrk-company']}>
									<Form.Item label={formatMessage({id: 'cloudStorage.invoice.company.name'})}>
										{
											getFieldDecorator('titleName', {
												validateTrigger: 'onBlur',
												rules: [
													{
														required: true,
														message: formatMessage({id: 'cloudStorage.no.invoice.company.name'}),
													},
												],
											})(
												<Input placeholder={formatMessage({id: 'cloudStorage.input.invoice.company.name'})} />
											)
										}
									</Form.Item>
									<Form.Item label={formatMessage({id: 'cloudStorage.invoice.taxRegisterNo'})}>
										{
											getFieldDecorator('taxRegisterNo', {
												validateTrigger: 'onBlur',
												rules: [
													{
														required: true,
														message: formatMessage({id: 'cloudStorage.no.invoice.taxRegisterNo'}),
													},
												],
											})(
												<Input placeholder={formatMessage({id: 'cloudStorage.input.invoice.taxRegisterNo'})} />
											)
										}
									</Form.Item>
								</div>
								}
								<div className={styles['vbrk-personal']}>
									<Form.Item label={formatMessage({id: 'cloudStorage.email'})}>
										{
											getFieldDecorator(emailValue, {
												validateTrigger: 'onBlur',
												rules: [
													{
														required: true,
														message: formatMessage({id: 'cloudStorage.no.email'}),
													},
													{
														pattern: mail,
														message: formatMessage({id: 'cloudStorage.email.error'}),
													},
												],
											})(
												<Input placeholder={formatMessage({id: 'cloudStorage.input.email'})} />
											)
										}
									</Form.Item>
									<Form.Item label={formatMessage({id: 'cloudStorage.phone'})}>
										{
											getFieldDecorator(phoneValue, {
												validateTrigger: 'onBlur',
												rules: [
													{
														pattern: phone,
														message: formatMessage({id: 'cloudStorage.phone.error'}),
													},
												],
											})(
												<Input placeholder={formatMessage({id: 'cloudStorage.phone.placeholder'})} />
											)
										}
									</Form.Item>
								</div>
							</Form>
						</div>
						}
					</div>
				</Card>
				<div className={styles.footer}>
					<div className={styles.protocol}>
						<Checkbox onChange={this.agreementChangeHandler} checked={isAgree}>
							{formatMessage({id: 'cloudStorage.subscription.agreement.tips'})}
							<a 
								className={styles['agreement-content']} 
								onClick={() => {
									navigateTo('serviceProtocol',undefined, 'open');
								}}
							>
								{formatMessage({id: 'cloudStorage.subscription.agreement'})}
							</a>
						</Checkbox>
					</div>
					<div className={styles['price-container']}>
						<div className={styles['total-price']}>
							<span className={styles.text}>{formatMessage({id: 'cloudStorage.sum'})}</span>
							<span className={styles.value}>¥{count*unitPrice === 0 ? 0 : parseFloat(count*unitPrice).toFixed(2)}</span>
						</div>
						<div className={styles.btns}>
							<Button
								onClick={()=> {
									if(sn){
										navigateTo('cloudStorage',{sn});
									}else{
										navigateTo('cloudStorage');
									}
								}}
								className={styles['cancel-btn']}
							>
								{formatMessage({id: 'cloudStorage.cancel'})}
							</Button>
							{ !freeStatus &&
							<Button
								type="primary"
								disabled={btnDisable}
								// disabled
								onClick={this.payHandler}
							>
								{formatMessage({id: 'cloudStorage.pay'})}
							</Button>}
							{ freeStatus &&
							<Button
								type="primary"
								disabled={btnDisable}
								onClick={this.freeSubscribeHandler}
							>
								{formatMessage({id: 'cloudStorage.freeSubscribeHandler'})}
							</Button>
							}
						</div>
					</div>
				</div>
				<Modal
					title={formatMessage({id: 'cloudStorage.tips'})}
					visible={isNeedCoverTip}
					onOk={this.confirmCoverHandler}
					onCancel={() => {this.setState({isNeedCoverTip:false});}}
					okText={formatMessage({id: 'cloudStorage.confirmCover'})}
					closable={false}
				>
					<p>{formatMessage({id: 'cloudStorage.confirmCover.tips'})}</p>
				</Modal>
			</>
		);
	}
}

export default OrderSubmission;