import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Table, Radio, /* message, */ Checkbox, Spin, Card, Form, Input, Button, Modal } from 'antd';
import React from 'react';
import { ERR_IPC_NOT_EXIST, ERR_SERVICE_SUBSCRIBE_ERROR , ERROR_OK } from '@/constants/errorCode';
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
		navigateTo: (pathId, urlParams) => dispatch({
			type: 'menu/goToPath',
			payload: {
				pathId,
				urlParams
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
				return(<span>已失效</span>);
				
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
			bundledStatus: freeStatus
		});
		// return response;
		const { code, data } = response;
		if(code === ERROR_OK){
			const { orderNo } = data;
			return orderNo;
		}
		if(code === ERR_SERVICE_SUBSCRIBE_ERROR){
			message.error( formatMessage({ id: 'cloudStorage.binding.err.service.subscribe'}));
		}else if(code === ERR_IPC_NOT_EXIST){
			message.error( formatMessage({ id: 'cloudStorage.binding.ipc.not.exist'}));
		}
		return '';
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
			invoiceSelectValue: e.target.value
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
			if(orderNo !== ''){
				navigateTo('subscriptionSuccess');
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
					storageIpcList[j].serviceTag === SERVICE_TYPE[productNo].serviceTag){
					isNeedCoverTip = true;
					break;
				}
			}
		}
		console.log(isNeedCoverTip);
		return isNeedCoverTip;
	}

	confirmCoverHandler = async () => {
		const { navigateTo } = this.props;
		const { freeStatus } = this.state;
		const orderNo = await this.orderHandler();
		if(freeStatus){
			if(orderNo !== ''){
				navigateTo('subscriptionSuccess');
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
		const { selectedValue, btnDisable, isAgree, invoiceSelectValue, vbrkSelectValue, unitPrice, count, freeStatus, storageIpcList, isNeedCoverTip } = this.state;
		const emailValue = vbrkSelectValue === 2 ? 'companyEmail' : 'personalEmail';
		const phoneValue = vbrkSelectValue === 2 ? 'companyPhone' : 'personalPhone';
		return(
			<>
				<Card title={null} bordered={false} className={styles['order-container']}>
					<div className={styles['bind-container']}>
						<h3 className={styles['bind-title']}>绑定摄像头</h3>
						<Spin spinning={loading.effects['cloudStorage/order'] || loading.effects['cloudStorage/getStorageIpcList']}>
							<div className={styles.content}>
								<Checkbox.Group onChange={this.ipcSelectHandler} value={selectedValue}>
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
									<div className={styles['per-price']}>单价：{unitPrice}</div>
									<div>数量：{count}</div>
								</div>
							</div>
						</Spin>
					</div>
					<div className={styles.invoice}>
						<h3 className={styles['invoice-title']}>发票</h3>
						<div className={styles['select-invoice']}>
							<Radio.Group onChange={this.invoiceSelectHandler} defaultValue={0}>
								<Radio.Button value={0}>无需发票</Radio.Button>
								<Radio.Button value={1}>电子普通发票</Radio.Button>
								<Radio.Button disabled value={2}>增值税普通发票</Radio.Button>
							</Radio.Group>
						</div>
						{invoiceSelectValue !== 0 &&
						<div className={styles.vbrk}>
							<h4 className={styles['vbrk-title']}>发票抬头</h4>
							<Radio.Group className={styles['vbrk-select']} onChange={this.vbrkSelectHandler} defaultValue={1}>
								<Radio value={1}>个人</Radio>
								<Radio value={2}>企业</Radio>
							</Radio.Group>
							<Form layout='vertical' onChange={this.formOnChangeHandler}>
								{vbrkSelectValue === 2 &&
								<div className={styles['vbrk-company']}>
									<Form.Item label='企业名称'>
										{
											getFieldDecorator('titleName', {
												rules: [
													{
														required: true,
														message: '企业名称不能为空',
													},
												],
											})(
												<Input placeholder='请输入企业名称（必填）' />
											)
										}
									</Form.Item>
									<Form.Item label='纳税人识别号'>
										{
											getFieldDecorator('taxRegisterNo', {
												rules: [
													{
														required: true,
														message: '纳税人识别号不能为空',
													},
												],
											})(
												<Input placeholder='请输入纳税人识别号（必填）' />
											)
										}
									</Form.Item>
								</div>
								}
								<div className={styles['vbrk-personal']}>
									<Form.Item label='邮箱'>
										{
											getFieldDecorator(emailValue, {
												rules: [
													{
														required: true,
														message: '不能为空',
													},
													{
														pattern: mail,
														message: '邮箱地址格式错误',
													},
												],
											})(
												<Input placeholder='请输入收票人邮箱（必填）' />
											)
										}
									</Form.Item>
									<Form.Item label='手机号'>
										{
											getFieldDecorator(phoneValue, {
												rules: [
													{
														pattern: phone,
														message: '手机号格式错误',
													},
												],
											})(
												<Input placeholder='请输入收票人手机号码' />
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
									navigateTo('serviceProtocol', 'open');
								}}
							>
								{formatMessage({id: 'cloudStorage.subscription.agreement'})}
							</a>
						</Checkbox>
					</div>
					<div className={styles['price-container']}>
						<div className={styles['total-price']}>
							<span className={styles.text}>合计：</span>
							<span className={styles.value}>¥{count*unitPrice === 0 ? 0 : parseFloat(count*unitPrice).toFixed(2)}</span>
						</div>
						<div className={styles.btns}>
							<Button
								onClick={()=> navigateTo('cloudStorage')}
								className={styles['cancel-btn']}
							>
								取消
							</Button>
							{ !freeStatus &&
							<Button
								type="primary"
								disabled={btnDisable}
								onClick={this.payHandler}
							>
								去支付
							</Button>}
							{ freeStatus &&
							<Button
								type="primary"
								disabled={btnDisable}
								onClick={this.freeSubscribeHandler}
							>
								立即订阅
							</Button>
							}
						</div>
					</div>
				</div>
				<Modal
					title='提示'
					visible={isNeedCoverTip}
					onOk={this.confirmCoverHandler}
					onCancel={() => {this.setState({isNeedCoverTip:false});}}
					okText='确认替代'
					closable={false}
				>
					<p>您选择的服务与已生效的服务不一致，订阅后将替换原服务</p>
				</Modal>
			</>
		);
	}
}

export default OrderSubmission;