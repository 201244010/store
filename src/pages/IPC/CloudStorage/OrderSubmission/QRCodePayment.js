import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, message, Modal } from 'antd';
import { format } from '@konata9/milk-shake';
import { ERROR_OK, ALTERT_TRADE_MAP } from '@/constants/errorCode';
import styles from './trade.less';
import { ORDER_STATUS } from '../constant';

@connect(
	state => ({
		loading: state.loading,
		routing: state.routing,
		orderDetail: state.trade.orderDetail,
	}),
	dispatch => ({
		payOrder: ({ orderNo, purchaseType, source }) =>
			dispatch({ type: 'trade/payOrder', payload: { orderNo, purchaseType, source } }),
		getOrderDetail: ({ orderNo }) => 
			dispatch({ type: 'trade/getOrderDetail', payload: { orderNo }}),
		goToPath: (pathId, urlParams = {}, linkType = null) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams, linkType } }),
		getOrderStatus: (orderNo) => 
			dispatch({ type: 'cloudStorage/getOrderStatus', payload: { orderNo }}),
	})
)
class QRCodePayment extends PureComponent {
	constructor(props) {
		super(props);
		const {
			routing: { location: { query: { orderNo, purchaseType, source } = {} } = {} } = {},
		} = props;

		this.qrContainer = React.createRef();
		this.refreshCount = null;

		this.orderNo = orderNo || null;
		this.purchaseType = purchaseType || null;
		this.source = parseInt(source, 10) || null;

		this.state = {
			count: 0,
		};
	}

	async componentDidMount() {
		const { getOrderDetail, goToPath } = this.props;
		await getOrderDetail({ orderNo: this.orderNo });
		const { orderDetail: { status } } = this.props;
		if(status === 4) {
			Modal.info({
				title: formatMessage({id: 'cloudStorage.info'}),
				content: (
					<div>
						<p>{formatMessage({id: 'cloudStorage.info.tips'})}</p>
					</div>
				),
				okText: formatMessage({id: 'cloudStorage.ok.text'}),
				onOk() { goToPath('serviceManagement');},
			});
			return;
		}
		await this.getQRCodeURL();
		this.orderStatusRefresh();
	}

	componentWillUnmount() {
		clearInterval(this.refreshOrderStatus);
		clearInterval(this.refreshWaitSuccess);
		Modal.destroyAll();
	}

	getQRCodeURL = async () => {
		const { payOrder } = this.props;
		const response = await payOrder({
			orderNo: this.orderNo,
			purchaseType: this.purchaseType,
			source: this.source,
		});

		if (response && response.code === ERROR_OK) {
			const { current } = this.qrContainer;
			const { data = {} } = response;
			const { qrCodeUrl = '' } = format('toCamel')(data);
			$(current).qrcode(qrCodeUrl);
		} else if (response && ALTERT_TRADE_MAP[response.code]) {
			message.error(formatMessage({ id: ALTERT_TRADE_MAP[response.code] }));
		} else {
			message.error(formatMessage({ id: 'pay.failed.info' }));
		}
	};

	orderStatusRefresh = () => {
		clearInterval(this.refreshOrderStatus);
		this.refreshOrderStatus = setInterval(async () => {
			const { getOrderStatus, goToPath } = this.props;
			const status = await getOrderStatus(this.orderNo);
			switch(status){
				case ORDER_STATUS.SUBSCRIBING:
					message.open({
						content: formatMessage({ id: 'cloudStorage.waitting.sub' }),
						duration: 0,
						icon: <div className={styles['loading-icon']} />
					});
					clearInterval(this.refreshOrderStatus);
					this.waitSuccessRefresh();
					break;
				case ORDER_STATUS.SUCCESS:
					message.open({
						content: formatMessage({ id: 'cloudStorage.waitting.sub' }),
						duration: 0,
						icon: <div className={styles['loading-icon']} />
					});
					clearInterval(this.refreshOrderStatus);
					setTimeout(()=>{
						message.destroy();
						goToPath('subscriptionSuccess', {orderNo:this.orderNo, status: 'success'});
					},1000);
					break;
				case ORDER_STATUS.CLOSE:
					message.destroy();
					clearInterval(this.refreshOrderStatus);
					goToPath('serviceOrderDetail', {orderNo:this.orderNo});
					break;
				default:
					break;
			}

		}, 5000);
	}

	waitSuccessRefresh = () => {
		clearInterval(this.refreshWaitSuccess);
		this.refreshWaitSuccess = setInterval(async () => {
			const { getOrderStatus, goToPath } = this.props;
			const { count } = this.state;

			const status = await getOrderStatus(this.orderNo);
			switch(status){
				case ORDER_STATUS.SUBSCRIBING:
					if(count < 15){
						this.setState({count: count+1});
					}else{
						this.setState({count: 0});
						message.destroy();
						clearInterval(this.refreshWaitSuccess);
						goToPath('subscriptionSuccess', {orderNo:this.orderNo, status: 'waitting'});
					}
					break;
				case ORDER_STATUS.SUCCESS:
					message.open({
						content: formatMessage({ id: 'cloudStorage.waitting.sub' }),
						duration: 0,
						icon: <div className={styles['loading-icon']} />
					});
					clearInterval(this.refreshWaitSuccess);
					setTimeout(()=>{
						message.destroy();
						goToPath('subscriptionSuccess', {orderNo:this.orderNo, status: 'success'});
					},1000);
					break;
				default:
					break;
			}

		}, 1000);
	}



	render() {
		const { loading, goToPath, orderDetail } = this.props;

		return (
			<Card title={null}>
				<div className={styles['qrCode-title']}>
					<div>
						<h3 className={styles['payment-title']}>{this.purchaseType ? formatMessage({ id: `${this.purchaseType  }.pay` }) : null}</h3>
						<p className={styles['order-num']}>{formatMessage({id: 'cloudStorage.orderNo'})}{this.orderNo}</p>
					</div>
					<div className={styles['order-price']}>
						{formatMessage({ id: 'pay.true.price' })}：
						<span className={styles.price}>{orderDetail.paymentAmount ? `¥${Number(orderDetail.paymentAmount).toFixed(2)}` : '--'}</span>
					</div>
				</div>
				<Card
					type="inner"
					title={this.purchaseType ? formatMessage({ id: `${this.purchaseType}.scan.pay` }) : null}
					loading={loading.effects['trade/payOrder']}
				>
					<div className={styles['qrCode-content']}>
						<div>
							<div className={styles['qrCode-refresh']}>
								{formatMessage({ id: 'cloudStorage.use.tips' })}
								<span>{this.purchaseType ? formatMessage({ id: `${this.purchaseType}.guide` }) : null}</span>
								{formatMessage({ id: 'cloudStorage.scan.code.tips' })}
							</div>
							<div className={styles['qrcode-data']} ref={this.qrContainer} />
						</div>
						<div className={styles[`${this.purchaseType}-guide-pic`]} />
					</div>
				</Card>

				<div className={styles['qrCode-footer']}>
					<a href="javascript:void(0);" onClick={() => goToPath('paymentPage', {orderNo: this.orderNo})}>
						<span className={styles['back-icon']} />{formatMessage({ id: 'pay.retry' })}
					</a>
				</div>
			</Card>
		);
	}
}

export default QRCodePayment;
