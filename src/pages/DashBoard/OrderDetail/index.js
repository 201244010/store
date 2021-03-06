import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Select, Row, Col, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { unixSecondToDate, getLocationParam } from '@/utils/utils';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';
import { SEARCH_FORM_COL, SEARCH_FORM_GUTTER } from '@/constants/form';
import global from '@/styles/common.less';
import styles from './index.less';


const PURCHASECODE = {
	ALL: '0',
	ALI: '9',
	WECHAT: '2',
	CASH: '5',
	BANKCARD: '10',
	BANKQR: '4',
	QQWALLET: '11',
	JDWALLET: '12',
	OTHER: '1',
};
const ORDERCODE = {
	ALL: '0',
	NORMAL: '1',
	REFUND: '2',
};
const RANKTYPE = {
	DESC: '1',
	ASC: '0',
	NOT: '-1',
};

@connect(
	state => {
		const { orderList, detailList, total } = state.orderDetail;
		return {
			orderList,
			detailList,
			total,
		};
	},
	dispatch => ({
		getList: options => {
			dispatch({ type: 'orderDetail/getList', payload: { options } });
		},
		getDetailList: orderId => {
			dispatch({ type: 'orderDetail/addDetailList', payload: { orderId } });
		},
	})
)
@Form.create()
class OrderDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expandKeys: [],
			postOptions: {},
		};
	}

	componentDidMount() {
		this.initTimeRange();
	}

	handleSubmit = e => {
		e.preventDefault();
		const {
			form: { validateFields },
		} = this.props;
		validateFields((err, values) => {
			if (!err) {
				const { orderType, purchaseType, rankType } = values;
				const { postOptions: options = {} } = this.state;

				if (rankType === 'priceDesc') {
					options.sortByTime = RANKTYPE.NOT;
					options.sortByAmount = RANKTYPE.DESC;
				}
				if (rankType === 'priceAsc') {
					options.sortByTime = RANKTYPE.NOT;
					options.sortByAmount = RANKTYPE.ASC;
				}
				if (rankType === 'timeDesc') {
					options.sortByAmount = RANKTYPE.NOT;
					options.sortByTime = RANKTYPE.DESC;
				}
				if (rankType === 'timeAsc') {
					options.sortByAmount = RANKTYPE.NOT;
					options.sortByTime = RANKTYPE.ASC;
				}

				options.purchaseTypeList = purchaseType === PURCHASECODE.ALL ? [] : [purchaseType];
				options.orderTypeList = orderType === ORDERCODE.ALL ? [] : [orderType];
				options.pageNum = 1; // 默认请求第1页

				this.setState({
					postOptions: options,
					expandKeys: [],
				});
				this.getList(options);
			}
		});
	};

	handleReset = () => {
		const {
			form: { setFieldsValue },
		} = this.props;
		setFieldsValue({
			rankType: 'timeDesc',
			purchaseType: PURCHASECODE.ALL,
			orderType: ORDERCODE.ALL,
		});
	};

	handleExpand = async record => {
		const { expandKeys } = this.state;

		const index = expandKeys.findIndex(key => key === record.key); // 是否在展开列表中

		if (index >= 0) {
			expandKeys.splice(index, 1); // 存在时删除
		} else {
			expandKeys.push(record.key);
		}

		this.setState({ expandKeys });

		// 展开订单无详情时拉取一次
		if (!record.detail || !record.detail[0]) {
			this.getDetailList(record.id);
		}
	};

	handlePaginate = (page, pageSize) => {
		// console.log('page:,ps:', page, pageSize);
		const { postOptions } = this.state;
		postOptions.pageNum = page;
		postOptions.pageSize = pageSize;
		this.setState({ postOptions });

		this.getList(postOptions);
		const expandKeys = [];
		this.setState({ expandKeys });
	};

	initTimeRange = () => {
		const postOptions = {};
		postOptions.timeRangeEnd = getLocationParam('timeRangeEnd');
		postOptions.timeRangeStart = getLocationParam('timeRangeStart');

		this.setState({ postOptions }, () => this.getList());
	};

	getList = async (options = {}) => {
		const { getList } = this.props;
		const { postOptions } = this.state;
		await getList({ ...postOptions, ...options });
	};

	getDetailList = async id => {
		const { getDetailList } = this.props;
		await getDetailList(id);
	};

	createOrderData = list => {
		const orderList = [];

		list.forEach(item => {
			const obj = {};
			obj.key = item.id;
			obj.orderId = item.orderNo;
			obj.id = item.id;
			obj.orderType = item.orderType;
			obj.orderTypeId = item.orderTypeId;
			obj.purchaseType = item.purchaseType;
			obj.purchaseTime = unixSecondToDate(item.purchaseTime);
			obj.expanded = this.isExpand(item.id);
			obj.tradeValue = item.amount;
			obj.detail = item.detail;

			orderList.push(obj);
		});

		return orderList;
	};

	isExpand = orderId => {
		const { expandKeys } = this.state;
		const index = expandKeys.indexOf(orderId);
		return index >= 0;
	};

	render() {
		const {
			orderList,
			total: orderTotal,
			form: { getFieldDecorator },
		} = this.props;
		const {
			expandKeys,
			postOptions: { pageNum },
		} = this.state;

		const orderData = this.createOrderData(orderList);

		const columns = [
			{
				title: formatMessage({ id: 'payment.order.id' }),
				dataIndex: 'orderId',
				key: 'orderId',
			},
			{
				title: formatMessage({ id: 'payment.purchase.type' }),
				dataIndex: 'purchaseType',
				key: 'purchaseType',
			},
			{
				title: formatMessage({ id: 'payment.order.type' }),
				dataIndex: 'orderType',
				key: 'orderType',
			},
			{
				title: formatMessage({ id: 'payment.order.amount' }),
				dataIndex: 'tradeValue',
				key: 'tradeValue',
				align: 'right',
			},
			{
				title: formatMessage({ id: 'payment.order.time' }),
				dataIndex: 'purchaseTime',
				key: 'purchaseTime',
			},
			{
				title: formatMessage({ id: 'payment.list.action' }),
				dataIndex: '',
				key: 'x',
				render: record => (
					<a
						onClick={() => {
							this.handleExpand(record);
						}}
					>
						{record.expanded
							? formatMessage({ id: 'payment.order.detail.expanded' })
							: formatMessage({ id: 'payment.order.detail.show' })}
					</a>
				),
			},
		];

		const detailColumns = [
			{
				title: formatMessage({ id: 'order.goods' }),
				dataIndex: 'name',
				key: 'name',
				width: '150px',
			},
			{
				title: formatMessage({ id: 'order.goods.amount' }),
				dataIndex: 'quantity',
				key: 'quantity',
			},
		];

		return (
			<Card>
				<div className={global['search-bar']}>
					<Form
						className={styles['ant-form-change']}
						layout="inline"
						onSubmit={this.handleSubmit}
					>
						<Row gutter={SEARCH_FORM_GUTTER.NORMAL}>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item
									label={formatMessage({ id: 'order.search.rankdefault' })}
								>
									{getFieldDecorator('rankType', {
										initialValue: 'timeDesc',
									})(
										<Select>
											<Select.Option value='priceDesc'>
												{formatMessage({ id: 'order.search.price.desc' })}
											</Select.Option>
											<Select.Option value='priceAsc'>
												{formatMessage({ id: 'order.search.price.asc' })}
											</Select.Option>
											<Select.Option value='timeDesc'>
												{formatMessage({ id: 'order.search.time.desc' })}
											</Select.Option>
											<Select.Option value='timeAsc'>
												{formatMessage({ id: 'order.search.time.asc' })}
											</Select.Option>
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'payment.purchase.type' })}>
									{getFieldDecorator('purchaseType', {
										initialValue: PURCHASECODE.ALL,
									})(
										<Select>
											<Select.Option value={PURCHASECODE.ALL}>
												{formatMessage({ id: 'select.all' })}
											</Select.Option>
											<Select.Option value={PURCHASECODE.ALI}>
												{formatMessage({
													id: 'payment-purchase-type-alipay',
												})}
											</Select.Option>
											<Select.Option value={PURCHASECODE.WECHAT}>
												{formatMessage({
													id: 'payment-purchase-type-wechat',
												})}
											</Select.Option>
											<Select.Option value={PURCHASECODE.CASH}>
												{formatMessage({
													id: 'payment-purchase-type-cash',
												})}
											</Select.Option>
											<Select.Option value={PURCHASECODE.BANKCARD}>
												{formatMessage({
													id: 'payment-purchase-type-card',
												})}
											</Select.Option>
											<Select.Option value={PURCHASECODE.BANKQR}>
												{formatMessage({
													id: 'payment-purchase-type-unionpayqr',
												})}
											</Select.Option>
											<Select.Option value={PURCHASECODE.QQWALLET}>
												{formatMessage({
													id: 'payment-purchase-type-qqwallet',
												})}
											</Select.Option>
											<Select.Option value={PURCHASECODE.JDWALLET}>
												{formatMessage({
													id: 'payment-purchase-type-jdwallet',
												})}
											</Select.Option>
											<Select.Option value={PURCHASECODE.OTHER}>
												{formatMessage({
													id: 'payment-purchase-type-other',
												})}
											</Select.Option>
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'payment.order.type' })}>
									{getFieldDecorator('orderType', {
										initialValue: ORDERCODE.ALL,
									})(
										<Select>
											<Select.Option value={ORDERCODE.ALL}>
												{formatMessage({ id: 'select.all' })}
											</Select.Option>
											<Select.Option value={ORDERCODE.NORMAL}>
												{formatMessage({ id: 'payment-order-type-normal' })}
											</Select.Option>
											<Select.Option value={ORDERCODE.REFUND}>
												{formatMessage({ id: 'payment-order-type-refund' })}
											</Select.Option>
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.OFFSET_TWO_THIRD}>
								<Form.Item className={global['query-item']}>
									<Button type="primary" htmlType="submit">
										{formatMessage({ id: 'btn.query' })}
									</Button>
									<Button
										className={global['btn-margin-left']}
										onClick={this.handleReset}
										htmlType="reset"
									>
										{formatMessage({ id: 'btn.reset' })}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>

				<Table
					columns={columns}
					dataSource={orderData}
					expandRowByClick
					expandIconAsCell={false}
					expandedRowKeys={expandKeys}
					expandedRowRender={
						record =>
							<Table
								className={styles['expanded-table']}
								size='small'
								columns={detailColumns}
								dataSource={record.detail}
								pagination={false}
							/>
					}
					pagination={
						{
							current: pageNum,
							showQuickJumper: true,
							showSizeChanger: true,
							total: orderTotal,
							onChange: this.handlePaginate,
							onShowSizeChange: this.handlePaginate,
							defaultPageSize: DEFAULT_PAGE_SIZE,
							pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
						}
					}
				/>
			</Card>
		);
	}
}

export default OrderDetail;