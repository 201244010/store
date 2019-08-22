import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Table } from 'antd';
import styles from './payment.less';

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
	render() {
		return (
			<Card title={formatMessage({ id: 'product.info' })}>
				<div className={styles['order-title']}>
					{formatMessage({ id: 'order.number' })}：{mockData.orderNumber}
				</div>
				<Table columns={columns} dataSource={mockData.table} pagination={false} />
				{/* <div className={styles['product-info']}></div> */}
			</Card>
		);
	}
}

export default Payment;
