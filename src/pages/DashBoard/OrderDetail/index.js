import React, { Component } from 'react';
import { unixSecondToDate } from '@/utils/utils';
import { Card, Button, Form, Select, Row, Col, Table } from 'antd';
import styles from './index.less';
import * as Actions from './services/payment';

@Form.create()
class OrderDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orderList: [],
			expandKeys: [],
			orderTotal: 50,
			postOptions: {},
		};
	};

	componentDidMount() {
		const { form: { validateFields, setFieldsValue } } = this.props;
		validateFields();
		setFieldsValue(
			{
				'rankType': 'rankDefault',
				'purchaseType': 'totalPay',
				'orderType': 'totalTrade'
			}
		);
		this.getList().then(
			orderList => {
				// console.log('getList:', orderList);
				this.setState({ orderList });
			}
		);
	};

	handleSubmit = (e, purchase, order) => {
		e.preventDefault();
		const { form: { validateFields } } = this.props;
		validateFields((err, values) => {
			if (!err) {
				const { orderType, purchaseType, rankType } = values;
				const { postOptions: options = {} } = this.state;


				options.purchaseType = purchase[purchaseType] ? [purchase[purchaseType]] : [];
				options.orderType = order[orderType] ? [order[orderType]] : [];
				
				if(purchase[purchaseType] || order[orderType]){ // 筛选时，默认请求第一页
					options.current = 1;
				}
				switch (rankType) {
					case 'rankDefault':
						break;
					case 'priceNegativ':
						options.sortByPrice = 1;
						break;
					case 'pricePositive':
						options.sortByPrice = 0;
						break;
					case 'timeNegtiv':
						options.sortByTime = 1;
						break;
					case 'timePositive':
						options.sortByTime = 0;
						break;
					default:
						break;
				}

				this.setState({ postOptions: options });
				this.getList(options)
					.then(
						orderList => {
							const expandKeys = [];
							this.setState({ orderList, expandKeys });
						}
					);
			}
		});
	};

	handleReset = () => {
		const { form: { setFieldsValue } } = this.props;
		setFieldsValue(
			{
				'rankType': 'rankDefault',
				'purchaseType': 'totalPay',
				'orderType': 'totalTrade'
			}
		);
	};

	handleExpand = (record) => {
		const { expandKeys, orderList } = this.state;
		const id = record.orderId;
		const index = expandKeys.findIndex(key => key === record.key); // 是否在展开列表中

		if (index >= 0) {
			expandKeys.splice(index, 1); // 存在时删除
			record.expanded = false;
		} else {
			expandKeys.push(record.key);
			record.expanded = true;
		}

		this.setState({ expandKeys });

		// 展开订单无详情时拉取一次
		if (!record.detail || !record.detail[0]) {
			record.loading = true;
			this.getDetailList(id).then(
				detailList => {
					detailList.key = id;
					record.detail = detailList;
					record.loading = false;
					this.setState({ orderList });
				}
			);
		}
	};

	handlePaginate = (page, pageSize) => {
		// console.log('page:,ps:', page, pageSize);
		const { postOptions } = this.state;
		postOptions.current = page;
		postOptions.pageSize = pageSize;
		this.setState({ postOptions });
		this.getList(postOptions)
			.then(
				orderList => {
					const expandKeys = [];
					this.setState({ orderList, expandKeys });
				}
			);
		// this.getList();
	}

	getList = (options = {}) => {
		const {
			sortByPrice: sort_by_amount = -1, // 空时取默认值-1，不排序
			sortByTime: sort_by_time = -1,
			purchaseType: purchase_type_list = [],
			orderType: order_type_list = [],
			current: page_num = 1,
			pageSize: page_size = 10,
		} = options;

		const timeRange = this.getUrlkey(window.location.href);
		// console.log('timeRange:', timeRange);

		return Actions.getList({
			time_range_end: timeRange.timeRangeEnd,
			time_range_start: timeRange.timeRangeStart,
			sort_by_amount,
			sort_by_time,
			order_type_list,
			purchase_type_list,
			page_num,
			page_size,
		}).then(
			response => {
				let { orderTotal } = this.state;
				orderTotal = response.data.total_count;
				// console.log('setstate:', orderTotal);
				this.setState({ orderTotal });
				return this.createOrderData(response);
			}
		);
	};

	getDetailList = orderId => Actions.getDetailList({ order_id: orderId })
		.then(
			response => this.createOrderDetail(response)
		);

	createOrderData = response => {
		const orderList = [];
		// const detailList = []

		response.data.order_list.forEach(item => {
			const obj = {};
			obj.key = item.id;
			obj.orderId = item.id;
			obj.orderType = item.order_type;
			obj.orderTypeId = item.order_type_id;
			obj.purchaseType = item.purchase_type;
			obj.purchaseTime = unixSecondToDate(item.purchase_time);
			obj.expanded = false;
			obj.tradeValue = item.amount;

			orderList.push(obj);
		});
		return orderList;
	};

	createOrderDetail = res => {
		const detailList = res.data.detail_list;
		return detailList;
	};

	getUrlkey = url => {
		const params = {};
		const urls = url.split('?');
		if (urls[1]) {
			const arr = urls[1].split('&') || [];
			for (let i = 0, l = arr.length; i < l; i++) {
				const a = arr[i].split('=');
				params[a[0]] = a[1];
			}
			return params;
		}
		params.timeRangeStart = 946656000;// 2000year
		params.timeRangeEnd = 4102444800;// 2100year
		return params;
	};

	render() {
		const { orderList: resData, expandKeys, orderTotal } = this.state;

		const columns = [
			{ title: '订单号', dataIndex: 'orderId', key: 'orderId' },
			{ title: '支付类型', dataIndex: 'purchaseType', key: 'purchaseType' },
			{ title: '交易类型', dataIndex: 'orderType', key: 'orderType' },
			{ title: '交易金额', dataIndex: 'tradeValue', key: 'tradeValue', align: 'right' },
			{ title: '交易时间', dataIndex: 'purchaseTime', key: 'purchaseTime' },
			{
				title: '操作',
				dataIndex: '',
				key: 'x',
				render: record =>
					<a onClick={() => {
						this.handleExpand(record);
					}}
					>
						{record.expanded ? '收起支付明细' : '查看支付明细'}
					</a>

			},
		];

		const {
			form: { getFieldDecorator },
		} = this.props;

		const purchaseCode = {
			// totalPay: 1,
			ali: 9,
			wechat: 2,
			cash: 5,
			bankCard: 4,
			bankQr: 4,
			qqWallet: 11,
			jdWallet: 8,
			other: 1,
		};
		const orderCode = {
			// totalTrade: 1,
			normal: 1,
			refund: 2,
		};
		
		const formItemLayout = {
			labelCol: {
				span: 8
			},
			wrapperCol: {
				span: 16
			}
		};
		const buttonItemLayout = {
			wrapperCol: {
				span: 24,
			}
		};
		const formLayout = 'inline';
		
		const detailColumns = [
			{ title: '商品', dataIndex: 'name', key: 'name', width: '150px' },
			{ title: '数量', dataIndex: 'quantity', key: 'quantity' }
		];

		return (
			<Card className={styles.wrapper}>
				<Form
					className={styles['ant-form-change']}
					layout={formLayout}
					onSubmit={e => this.handleSubmit(e, purchaseCode, orderCode)}
				>
					<Row>
						<Col span={8}>
							<Form.Item label="综合排序" {...formItemLayout}>
								{getFieldDecorator('rankType', {

								})(
									<Select>
										<Select.Option value="rankDefault">综合排序</Select.Option>
										<Select.Option value="priceNegativ">金额倒序</Select.Option>
										<Select.Option value="pricePositive">金额正序</Select.Option>
										<Select.Option value="timeNegtiv">时间倒序</Select.Option>
										<Select.Option value="timePositive">时间正序</Select.Option>
									</Select>
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label="支付类型" {...formItemLayout}>
								{getFieldDecorator(
									'purchaseType'
								)(
									<Select>
										<Select.Option value="totalPay">全部</Select.Option>
										<Select.Option value="ali">支付宝</Select.Option>
										<Select.Option value="wechat">微信</Select.Option>
										<Select.Option value="cash">现金</Select.Option>
										<Select.Option value="bankCard">银行卡刷卡</Select.Option>
										<Select.Option value="bankQr">银行卡二维码</Select.Option>
										<Select.Option value="qqWallet">QQ钱包</Select.Option>
										<Select.Option value="jdWallet">京东钱包</Select.Option>
										<Select.Option value="other">其它</Select.Option>
									</Select>
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label="交易类型" {...formItemLayout}>
								{getFieldDecorator(
									'orderType'
								)(
									<Select>
										<Select.Option value="totalTrade">全部</Select.Option>
										<Select.Option value="normal">正常销售</Select.Option>
										<Select.Option value="refund">退款</Select.Option>
									</Select>
								)}
							</Form.Item>
						</Col>
					</Row>

					<Row style={{ margin: '10px 0' }}>
						<Col style={{ textAlign: 'right' }}>
							<Form.Item className={styles['form-button-wrapper']} {...buttonItemLayout}>
								<Button type="primary" htmlType="submit">
									查询
								</Button>
								<Button
									onClick={this.handleReset}
									htmlType="reset"
									style={{ marginLeft: 10 }}
								>
									重置
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>

				<Table
					columns={columns}
					dataSource={resData}
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
								loading={record.loading}
							/>
					}
					pagination={
						{
							showQuickJumper: true,
							showSizeChanger: true,
							total: orderTotal,
							onChange: this.handlePaginate
						}
					}
				/>
			</Card>
		);
	};
}

export default OrderDetail;