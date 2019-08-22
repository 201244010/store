import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Table, Modal, Button, Tabs } from 'antd';
import PaymentRadio from '@/components/BigIcon/PaymentRadio';
import styles from './payment.less';

import businessBank from '@/assets/icon/business-bank.svg';
import accountBank from '@/assets/icon/account-bank.svg';
import alipayPayment from '@/assets/icon/alipay-payment.svg';
import wechatPayment from '@/assets/icon/wechat-payment.svg';

const { TabPane } = Tabs;

const mockData = {
	orderNumber: 'YCC1234567890213456',
	table: [
		{
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

@connect()
class Payment extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
		};
	}

	closeModal = () => {
		this.setState({
			modalVisible: false,
		});
	};

	radioChange = value => {
		console.log('radio value: ', value);
	};

	render() {
		const { modalVisible } = this.state;

		return (
			<>
				<Card title={formatMessage({ id: 'product.info' })}>
					<div className={styles['order-title']}>
						{formatMessage({ id: 'order.number' })}：{mockData.orderNumber}
					</div>
					<Table columns={columns} dataSource={mockData.table} pagination={false} />
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
							<PaymentRadio
								{...{
									backgroundImg: businessBank,
									name: 'payment',
									id: 'businessBank',
									value: 'businessBank',
									onChange: this.radioChange,
								}}
							/>
						</TabPane>
						<TabPane tab={formatMessage({ id: 'person.account' })} key="account">
							<div>
								<PaymentRadio
									{...{
										backgroundImg: alipayPayment,
										name: 'accountPayment',
										id: 'alipayPayment',
										value: 'alipayPayment',
										onChange: this.radioChange,
									}}
								/>
								<PaymentRadio
									{...{
										backgroundImg: wechatPayment,
										name: 'accountPayment',
										id: 'wechatPayment',
										value: 'wechatPayment',
										onChange: this.radioChange,
									}}
								/>
								<PaymentRadio
									{...{
										backgroundImg: accountBank,
										name: 'accountPayment',
										id: 'accountBank',
										value: 'accountBank',
										onChange: this.radioChange,
									}}
								/>
							</div>
						</TabPane>
					</Tabs>

					<div className={styles['action-bar']}>
						<div className={styles['rest-time']}>
							{formatMessage({ id: 'purchase.time.rest' })}：
						</div>
						<Button type="primary">{formatMessage({ id: 'purchase.intime' })}</Button>
					</div>
				</Card>

				<NoAuth visible={modalVisible} onCancel={this.closeModal} />
			</>
		);
	}
}

export default Payment;
