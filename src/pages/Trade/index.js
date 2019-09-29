import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { format } from '@konata9/milk-shake';
import { Card, Table, Modal, Button, Tabs, message } from 'antd';
import PaymentRadio from '@/components/BigIcon/PaymentRadio';
import { getCountDown } from '@/utils/utils';
import { TIME } from '@/constants';
import styles from './trade.less';

import businessBank from '@/assets/icon/business-bank.svg';
import accountBank from '@/assets/icon/account-bank.svg';
import alipayPayment from '@/assets/icon/alipay-payment.svg';
import wechatPayment from '@/assets/icon/wechat-payment.svg';
import { ERROR_OK, ALTERT_TRADE_MAP } from '@/constants/errorCode';

import { TRADE } from './constants';

const {
	PAYMENT: { B2B, B2C },
} = TRADE;

const PAYMENT_ICON = {
	[B2B.UNIONPAY]: businessBank,
	[B2C.UNIONPAY]: accountBank,
	[B2C.ALIPAY]: alipayPayment,
	[B2C.WECHAT]: wechatPayment,
	default: null,
};

const { TabPane } = Tabs;

const mockData = {
	orderNumber: 'YCC1234567890213456',
	table: [
		{
			id: '233',
			productImg: '//test.cdn.sunmi.com/IMG/uploadicon/698745/1556108862_thumb.jpg',
			productName: '云存储七天视频存储半年包',
			productPrice: 69,
			productNumber: 1,
		},
	],
};

const NoAuth = ({ visible = false, onCancel = null }) => (
	<Modal title={null} footer={null} visible={visible} onCancel={onCancel}>
		<div className={styles['noAuth-wrapper']}>
			<div>{formatMessage({ id: 'account.no.certify.info1' })}</div>
			<div>{formatMessage({ id: 'account.no.certify.info2' })}</div>
			<Button className={styles['noAuth-btn']} type="primary">
				{formatMessage({ id: 'account.to.certify' })}
			</Button>
		</div>
	</Modal>
);

const columns = [
	{
		title: formatMessage({ id: 'product.name' }),
		dataIndex: 'productName',
		key: 'productName',
		render: (name, record) => (
			<>
				<img src={record.productImg} />
				<span style={{ marginLeft: '20px' }}>{name}</span>
			</>
		),
	},
	{
		title: formatMessage({ id: 'product.price' }),
		dataIndex: 'productPrice',
		key: 'productPrice',
		render: price => <span>{parseFloat(price).toFixed(2)}</span>,
	},
	{
		title: formatMessage({ id: 'product.number' }),
		dataIndex: 'productNumber',
		key: 'productNumber',
	},
	{
		title: formatMessage({ id: 'product.amount' }),
		dataIndex: 'productAmount',
		key: 'productAmount',
		render: (_, record) => {
			const { productPrice = 0, productNumber = 1 } = record || {};
			return <span>{parseFloat(productPrice * productNumber).toFixed(2)}</span>;
		},
	},
];

@connect(
	state => ({
		loading: state.loading,
		trade: state.trade,
		routing: state.routing,
	}),
	dispatch => ({
		getPurchaseType: () => dispatch({ type: 'trade/getPurchaseType' }),
		payOrder: ({ orderNo, purchaseType, source }) =>
			dispatch({ type: 'trade/payOrder', payload: { orderNo, purchaseType, source } }),
		goToPath: (pathId, urlParams = {}, linkType = null) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams, linkType } }),
	})
)
class Trade extends PureComponent {
	constructor(props) {
		super(props);
		this.timer = null;
		this.frame = React.createRef();
		this.state = {
			selectedPurchaseType: null,
			modalVisible: false,
			countDown: TIME.DAY,
		};
	}

	async componentDidMount() {
		const { getPurchaseType } = this.props;
		await getPurchaseType();
		this.startCountDown();
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	startCountDown = () => {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			const { countDown } = this.state;
			this.setState(
				{
					countDown: countDown - 1,
				},
				() => this.startCountDown()
			);
		}, 1000);
	};

	handleUnionPay = async opts => {
		const { payOrder, goToPath } = this.props;
		const response = await payOrder(opts);

		if (response && response.code === ERROR_OK) {
			const { data = {} } = response;
			const { unionPayForm = '' } = format('toCamel')(data);

			// TODO 银联支付的跳转有风险，如果银联的方法变了可能会失效
			const wf = window.open('');
			wf.document.write(`${unionPayForm} <script>document.forms[0].submit()</script>`);

			Modal.confirm({
				title: formatMessage({ id: 'pay.confirm.title' }),
				content: formatMessage({ id: 'pay.confirm.title' }),
				okText: formatMessage({ id: 'pay.success' }),
				cancelText: formatMessage({ id: 'pay.failed' }),
				onOk: () => goToPath('tradeResult', { status: 'success' }),
				onCancel: () => goToPath('tradeResult', { status: 'failed' }),
			});
		} else if (response && ALTERT_TRADE_MAP[response.code]) {
			message.error(formatMessage({ id: ALTERT_TRADE_MAP[response.code] }));
		} else {
			message.error(formatMessage({ id: 'pay.failed.info' }));
		}
	};

	goToPayOrder = async () => {
		const { selectedPurchaseType } = this.state;
		const {
			routing: { location: { query: { orderNo = null } = {} } = {} },
			goToPath,
		} = this.props;

		// TODO 目前部分参数为写死的，今后会进行修改
		const opts = {
			orderNo: orderNo || 'AS20190823',
			purchaseType: selectedPurchaseType,
			source: 1,
		};

		if ([B2B.UNIONPAY, B2C.UNIONPAY].includes(selectedPurchaseType)) {
			this.handleUnionPay(opts);
		} else {
			goToPath('qrpay', {
				...opts,
			});
		}
	};

	closeModal = () => {
		this.setState({
			modalVisible: false,
		});
	};

	radioChange = value => {
		this.setState({
			selectedPurchaseType: value,
		});
	};

	render() {
		const {
			trade: { purchaseType: { b2b = [], b2c = [] } = {} },
			loading,
		} = this.props;

		const { modalVisible, countDown, selectedPurchaseType } = this.state;
		const { hour = '--', minute = '--', second = '--' } = getCountDown(countDown);

		return (
			<>
				<Card title={formatMessage({ id: 'product.info' })}>
					<div className={styles['order-title']}>
						{formatMessage({ id: 'order.number' })}：{mockData.orderNumber}
					</div>
					<Table
						rowKey="id"
						columns={columns}
						dataSource={mockData.table}
						pagination={false}
					/>
					<div className={styles['product-info']}>
						<div>
							<div className={styles['product-wrapper']}>
								<div className={styles['product-title']}>
									{formatMessage({ id: 'product.count' })}：
								</div>
								<div className={styles['product-content']}>1</div>
							</div>

							<div className={styles['product-wrapper']}>
								<div className={styles['product-title']}>
									{formatMessage({ id: 'product.total' })}：
								</div>
								<div className={styles['product-content']}>69</div>
							</div>

							<div className={styles['product-wrapper']}>
								<div className={styles['product-title']}>
									{formatMessage({ id: 'product.discount' })}：
								</div>
								<div className={styles['product-content']}>-0.00</div>
							</div>

							<div className={styles['total-amount']}>¥ 69.00</div>
						</div>
					</div>
				</Card>

				<Card
					title={formatMessage({ id: 'purchase.choose' })}
					style={{ marginTop: '20px' }}
					loading={loading.effects['trade/getPurchaseType']}
				>
					<Tabs defaultActiveKey="business" animated={false}>
						<TabPane tab={formatMessage({ id: 'business.account' })} key="business">
							<div className={styles['tab-content']}>
								{b2b.map(info => {
									const { id, tag } = info;
									return (
										<div className={styles['payment-radio-wrapper']} key={id}>
											<PaymentRadio
												{...{
													backgroundImg:
														PAYMENT_ICON[tag] || PAYMENT_ICON.default,
													name: 'b2b',
													id,
													value: tag,
													onChange: this.radioChange,
												}}
											/>
										</div>
									);
								})}
							</div>
						</TabPane>
						<TabPane tab={formatMessage({ id: 'person.account' })} key="account">
							<div className={styles['tab-content']}>
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
												}}
											/>
										</div>
									);
								})}
							</div>
						</TabPane>
					</Tabs>

					<div className={styles['action-bar']}>
						<div className={styles['rest-time']}>
							{formatMessage({ id: 'purchase.time.rest' })}：{hour}
							{formatMessage({ id: 'hour.unit' })} {minute}
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

				<NoAuth visible={modalVisible} onCancel={this.closeModal} />
			</>
		);
	}
}

export default Trade;
