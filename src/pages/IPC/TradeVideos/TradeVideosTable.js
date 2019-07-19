import React from 'react';
import { Table, Divider } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';

import styles from './TradeVideos.less';

class TradeVideosTable extends React.Component {

	render() {

		const { tradeVideos, loading, total, currentPage, pageSize, expandedRowKeys } = this.props;
		const { onShowSizeChange, onPaginationChange, watchVideoHandler, onExpand } = this.props;

		// const tradeVideo  = [
		// 	{
		// 		ipcName: '林远峰使用',
		// 		paymentDeviceName: 'T2',
		// 		paymentDeviceSn: '9988776655',
		// 		totalPrice: '123',
		// 		paymentMethod: '支付宝',
		// 		purchaseTime: '',
		// 		key: '1',
		// 		details: [{
		// 			name: 'test',
		// 			quantity: 100
		// 		}]
		// 	}
		// ];
		const columns = [
			{
				title: formatMessage({ id: 'tradeVideos.camera' }), // '摄像头',
				dataIndex: 'ipcName',
				key: 'ipcName',
				sorter: (a, b) => a.ipcName.localeCompare(b.ipcName),
			},
			{
				title: formatMessage({ id: 'tradeVideos.pos' }), // '收银设备',
				dataIndex: 'paymentDeviceName',
				key: 'paymentDeviceName',
				sorter: (a, b) => a.paymentDeviceName.localeCompare(b.paymentDeviceName),
				render: item => item || formatMessage({ id: 'tradeVideos.unknownDevice' }),
			},
			{
				title: formatMessage({ id: 'tradeVideos.sn' }), // '设备SN',
				dataIndex: 'paymentDeviceSn',
				key: 'paymentDeviceSn',
				sorter: (a, b) => a.paymentDeviceSn.localeCompare(b.paymentDeviceSn),
			},
			{
				title: formatMessage({ id: 'tradeVideos.totalPrice' }), // '交易金额',
				dataIndex: 'totalPrice',
				key: 'totalPrice',
				sorter: (a, b) => a.totalPrice - b.totalPrice,
			},
			{
				title: formatMessage({ id: 'tradeVideos.paymentMethod' }), // '支付方式',
				dataIndex: 'paymentMethod',
				key: 'paymentMethod',
				sorter: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod),
				render: item => (
					<span>
						{item || formatMessage({ id: 'tradeVideos.unknown' })}
					</span>
				),
			},
			{
				title: formatMessage({ id: 'tradeVideos.purchaseTime' }), // '交易时间',
				dataIndex: 'purchaseTime',
				key: 'purchaseTime',
				sorter: (a, b) => moment(a.purchaseTime).valueOf() - moment(b.purchaseTime).valueOf(),
			},
			{},
			{
				title: formatMessage({ id: 'tradeVideos.operation' }), // '操作',
				dataIndex: 'key',
				key: 'action',
				render: (item, record) => (
					<>
						<a
							className={`${styles['video-watch']} ${
								record.url ? '' : styles.disabled
							}`}
							href="javascript:void(0);"
							onClick={() =>
								watchVideoHandler(record.paymentDeviceSn, record.url)
							}
						>
							{record.url
								? formatMessage({ id: 'tradeVideos.viewVideo' })
								: formatMessage({ id: 'tradeVideos.viewVideo.merging' })}
						</a>
						<Divider type="vertical" />
						<a
							className={styles['video-watch']}
							href="javascript:void(0);"
							onClick={() => {
								onExpand(record.key);
							}}
						>
							{expandedRowKeys.includes(record.key)
								? formatMessage({ id: 'tradeVideos.closeDetails' })
								: formatMessage({ id: 'tradeVideos.viewDetails' })}
						</a>
					</>
				),
			},
		];
		return(
			<Table
				columns={columns}
				dataSource={tradeVideos}
				loading={loading}
				defaultExpandedRowKeys={['details']}
				expandedRowKeys={expandedRowKeys}
				// onExpand={this.onExpand}
				expandIconColumnIndex={-1}
				expandIconAsCell={false}
				pagination={{
					current: currentPage,
					pageSize,
					total,
					defaultCurrent: 1,
					showSizeChanger: true,
					showQuickJumper: true,
					defaultPageSize: DEFAULT_PAGE_SIZE,
					pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
					onShowSizeChange,
					onChange: onPaginationChange,
				}}
				expandedRowRender={record => (
					<div className={styles['paymemt-detail']}>
						<span
							className={`${styles['payment-detail-title']} ${
								styles['payment-detail-item-name']
							} ${styles['payment-detail-item']}`}
						>
							{/* 商品 */}
							{formatMessage({ id: 'tradeVideos.product' })}
						</span>
						{/* <span className={`${styles['payment-detail-title']} ${styles['payment-detail-item']}`}>单价</span> */}
						<span
							className={`${styles['payment-detail-title']} ${
								styles['payment-detail-item-amount']
							} ${styles['payment-detail-item']}`}
						>
							{/* 数量 */}
							{formatMessage({ id: 'tradeVideos.amount' })}
						</span>
						{/* <span className={`${styles['payment-detail-title']} ${styles['payment-detail-item']}`}>折扣价</span> */}
						{record.details &&
							record.details.map((item, index) => (
								<div key={index}>
									<span
										className={`${styles['payment-detail-item-name']} ${
											styles['payment-detail-item']
										}`}
									>
										{item.name}
									</span>
									{/* <span className={`${styles['payment-detail-item']}`}>{item.perPrice}</span> */}
									<span
										className={`${styles['payment-detail-item']} ${
											styles['payment-detail-item-amount']
										}`}
									>
										{item.quantity}
									</span>
									{/* <span className={`${styles['payment-detail-item']}`}>{item.promotePrice}</span> */}
								</div>
							))}
					</div>
				)}
			/>
		);
	}
}

export default TradeVideosTable;