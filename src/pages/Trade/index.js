import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { format } from '@konata9/milk-shake';
import { Card, Table, Modal, Button, Tabs } from 'antd';
import PaymentRadio from '@/components/BigIcon/PaymentRadio';
import { getCountDown } from '@/utils/utils';
import { TIME } from '@/constants';
import styles from './trade.less';

import businessBank from '@/assets/icon/business-bank.svg';
import accountBank from '@/assets/icon/account-bank.svg';
import alipayPayment from '@/assets/icon/alipay-payment.svg';
import wechatPayment from '@/assets/icon/wechat-payment.svg';
import { ERROR_OK } from '@/constants/errorCode';

const PAYMENT_ICON = {
	'purchase-type-b2b-unionpay': businessBank,
	'purchase-type-b2c-unionpay': accountBank,
	'purchase-type-alipay': alipayPayment,
	'purchase-type-wechat': wechatPayment,
	default: null,
};

const { TabPane } = Tabs;

const mockData = {
	orderNumber: 'YCC1234567890213456',
	table: [
		{
			id: '233',
			productImg: 'http://test.cdn.sunmi.com/IMG/uploadicon/698745/1556108862_thumb.jpg',
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
		trade: state.trade,
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
		this.state = {
			selectedPurchaseType: null,
			modalVisible: false,
			countDown: TIME.DAY,
		};
	}

	async componentDidMount() {
		// TODO 获取支付方式
		// const { getPurchaseType } = this.props;
		// await getPurchaseType();
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

	payOrder = async () => {
		const { selectedPurchaseType } = this.state;
		const { payOrder } = this.props;

		const response = await payOrder({
			orderNo: '',
			purchaseType: selectedPurchaseType,
			source: '',
		});

		if (response && response.code === ERROR_OK) {
			const { data = {} } = response || {};
			const { qrCodeUrl = '', unionPayForm = '' } = format('toCamel')(data);
			if (qrCodeUrl) {
				// TODO 二维码操作页面
			}

			if (unionPayForm) {
				// TODO 跳转到银联页面
			}
		} else {
			// TODO 支付错误的情况
		}

		const { open } = window;
		const newWindow = open('/network', '_blank');
		newWindow.document.write('<p>这是\'我的窗口\'</p>');
		// const myWindow = window.open(
		// 	'',
		// 	'_blank',
		// 	'location=no, toolbar=no, menubar=no, status=no'
		// );
		// myWindow.document.write('<p>这是\'我的窗口\'</p>');
		// myWindow.focus();
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
		} = this.props;

		const { modalVisible, countDown } = this.state;
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
				>
					<Tabs defaultActiveKey="business" animated={false}>
						<TabPane tab={formatMessage({ id: 'business.account' })} key="business">
							{b2b.map(info => {
								const { id, tag } = info;
								return (
									<PaymentRadio
										key={id}
										{...{
											backgroundImg:
												PAYMENT_ICON[tag] || PAYMENT_ICON.default,
											name: 'b2b',
											id,
											value: id,
											onChange: this.radioChange,
										}}
									/>
								);
							})}
						</TabPane>
						<TabPane tab={formatMessage({ id: 'person.account' })} key="account">
							<div>
								{b2c.map(info => {
									const { id, tag } = info;
									return (
										<PaymentRadio
											{...{
												backgroundImg:
													PAYMENT_ICON[tag] || PAYMENT_ICON.default,
												name: 'b2c',
												id,
												value: id,
												onChange: this.radioChange,
											}}
										/>
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
						<Button type="primary" onClick={this.payOrder}>
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
