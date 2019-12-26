import { connect } from 'dva';
import { Card, Button } from 'antd';
import React from 'react';
import { formatMessage } from 'umi/locale';
import { getCountDown } from '@/utils/utils';
import PaymentRadio from '@/components/BigIcon/PaymentRadio';
import styles from './PaymentPage.less';
import alipayPayment from '@/assets/icon/alipay-payment.svg';
import wechatPayment from '@/assets/icon/wechat-payment.svg';


export const TRADE = {
	PAYMENT: {
		B2B: {
			UNIONPAY: 'purchase-type-b2b-unionpay',
		},
		B2C: {
			WECHAT: 'purchase-type-wechat',
			ALIPAY: 'purchase-type-alipay',
			// UNIONPAY: 'purchase-type-b2c-unionpay',
		},
	},
};


const {
	PAYMENT: { B2C },
} = TRADE;

const PURCHASE_TYPE = {
	b2b: [],
	b2c: [
		{
			id: 2,
			tag: 'purchase-type-alipay',
			type: 1
		},
		{
			id: 1,
			tag: 'purchase-type-wechat',
			type: 1,
		}
	],
};

const PAYMENT_ICON = {
	[B2C.ALIPAY]: alipayPayment,
	[B2C.WECHAT]: wechatPayment,
	default: null,
};

@connect(
	state => ({
		loading: state.loading,
		trade: state.trade,
		routing: state.routing,
		orderDetail: state.trade.orderDetail,
	}),
	dispatch => ({
		getPurchaseType: () => dispatch({ type: 'trade/getPurchaseType' }),
		payOrder: ({ orderNo, purchaseType, source }) =>
			dispatch({ type: 'trade/payOrder', payload: { orderNo, purchaseType, source } }),
		goToPath: (pathId, urlParams = {}, linkType = null) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams, linkType } }),
		getCountDownFromCloud: (orderNo) => 
			dispatch({ type: 'cloudStorage/getCountDown', payload: {orderNo}}),
		getOrderDetail: ({ orderNo }) => 
			dispatch({ type: 'trade/getOrderDetail', payload: { orderNo }}),
		clearOrderDetail: () => 
			dispatch({ type: 'trade/clearOrderDetail'}),
	})
)

class PaymentPage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			countDown: undefined,
			selectedPurchaseType: 'purchase-type-alipay',
			orderNo: null
		};
	}

	async componentDidMount() {
		const {
			routing: { location: { query: { orderNo = null } = {} } = {} },
			goToPath,
			getCountDownFromCloud,
			getOrderDetail
		} = this.props;
		if(!orderNo){
			goToPath('cloudStorage');
		}
		await getOrderDetail({ orderNo });
	
		const countDown = await getCountDownFromCloud(orderNo);
		if(countDown <= 0) this.locationToOrderDetail(orderNo);
		this.setState({
			orderNo,
			countDown
		},() => {
			this.startCountDown();
		});
	}

	componentWillUnmount() {
		const { clearOrderDetail } = this.props;
		clearTimeout(this.timer);
		clearOrderDetail();
	}

	startCountDown = () => {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			const { countDown, orderNo } = this.state;
			if (countDown <= 0) {
				clearTimeout(this.timer);
				this.locationToOrderDetail(orderNo);
			} else {
				this.setState({
					countDown: countDown - 1,
				},() => {
					this.startCountDown();
				});
			}
		}, 1000);
	};

	radioChange = value => {
		this.setState({
			selectedPurchaseType: value,
		});
	};

	goToPayOrder = async () => {
		const { selectedPurchaseType } = this.state;
		const {
			routing: { location: { query: { orderNo = null } = {} } = {} },
			goToPath,
		} = this.props;

		const opts = {
			orderNo,
			purchaseType: selectedPurchaseType,
			source: 1,
		};

		goToPath('qrpay', {
			...opts,
		});
	};

	locationToOrderDetail(orderNo) {
		const { goToPath } = this.props;
		goToPath('serviceOrderDetail', {orderNo});
	}
	
	render(){
		const { orderDetail } = this.props;
		const { countDown, selectedPurchaseType, orderNo } = this.state;
		const b2c = PURCHASE_TYPE.b2c;
		const { minute = '--', second = '--' } = countDown ? getCountDown(countDown) : {};
		return(
			<>
				<Card title={null} bordered={false} className={styles['payment-container']}>
					<div className={styles['qrCode-title']}>
						<div>
							<h3 className={styles['payment-title']}>{formatMessage({id: 'cloudStorage.order.success'})}</h3>
							<p className={styles['order-num']}>{formatMessage({id: 'cloudStorage.orderNo'})}{orderNo}</p>
						</div>
						<div className={styles['order-price']}>
							{formatMessage({ id: 'pay.true.price' })}：
							<span className={styles.price}>{orderDetail.paymentAmount ? `¥${Number(orderDetail.paymentAmount).toFixed(2)}` : '--'}</span>
						</div>
					</div>
					<Card
						style={{ marginTop: 16 }}
						type="inner"
						title={formatMessage({id: 'cloudStorage.pay.way'})}
					>
						<div className={styles['payment-content']}>
							{b2c.map(info => {
								const { id, tag } = info;
								return (
									<div className={styles['payment-radio-wrapper']} key={id}>
										<PaymentRadio
											{...{
												backgroundImg:
														PAYMENT_ICON[tag] || PAYMENT_ICON.default,
												name: 'b2c',
												id,
												value: tag,
												onChange: this.radioChange,
												selectValue: selectedPurchaseType
											}}
										/>
									</div>
								);
							})}
						</div>
					</Card>
					<div className={styles['action-bar']}>
						<div className={styles['rest-time']}>
							<span className={styles.text}>{formatMessage({ id: 'purchase.time.rest' })}：</span>{minute}
							{formatMessage({ id: 'minute.unit' })} {second}
							{formatMessage({ id: 'second.unit' })}
						</div>
						<Button
							type="primary"
							disabled={!selectedPurchaseType}
							onClick={this.goToPayOrder}
						>
							{formatMessage({ id: 'purchase.intime' })}
						</Button>
					</div>
				</Card>
			</>
		);
	}
}

export default PaymentPage;