import React, { Component } from 'react';
import { unixSecondToDate } from '@/utils/utils';
import { Card, Button, Form, Select, Row, Col, Table } from 'antd';
import styles from './index.less';
import * as Actions from './services/payment';

const purchaseCode = {
	// totalPay: 1,
	ali: 2,
	wechat: 3,
	cash: 4,
	bankCard: 5,
	bankQr: 6,
	qqWallet: 7,
	jdWallet: 8,
	other: 9,
};
const orderCode = {
	// totalTrade: 1,
	normal: 2,
	refund: 3,
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

const res = {
	code: 1,
	msg: '',
	data: {
		order_list: [
			{
				id: 10457,
				order_no: 'test001',
				order_type: '正常销售',
				order_type_id: 1,
				ipc_device_name: '林远峰使用',
				payment_device_name: '收银设备2',
				payment_device_sn: 'VT101D8BS00089',
				purchase_type: '其他',
				purchase_type_id: 1,
				purchase_time: 1593029283,
				amount: '30.10'
			},
			{
				id: 10449,
				order_no: '123',
				order_type: '退款',
				order_type_id: 2,
				ipc_device_name: 'Fake设备',
				payment_device_name: '收银设备PLUS',
				payment_device_sn: 'LTY132456',
				purchase_type: '现金',
				purchase_type_id: 5,
				purchase_time: 1608361200,
				amount: '7.00'
			}
		],
		total_count: 11
	}
};

const detailColumns = [
	{ title: '商品', dataIndex: 'name', key: 'name', width: '150px' },
	{ title: '数量', dataIndex: 'quantity', key: 'quantity' }
];

@Form.create()
class OrderDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orderList: [],
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
				// console.log('getList:', res);
				// const orderList = res;
				this.setState({ orderList });
			}
		);
	};

	handleSubmit = (e, purchase, order) => {
		e.preventDefault();
		const { form: { validateFields } } = this.props;
		validateFields((err, values) => {
			if (!err) {
				// console.log('Received values of form: ', values);
				const { orderType, purchaseType, rankType } = values;
				const options = {};

				options.purchaseType = purchase[purchaseType] ? [purchase[purchaseType]] : [];
				options.orderType = order[orderType] ? [order[orderType]] : [];
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

				this.getList(options)
					.then(
						orderList => {
							// console.log('handlesubmit:',orderList[0])
							this.setState({ orderList });
							this.forceUpdate();
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

	handleExpand = (expanded, record) => {
		record.expanded = expanded;
		const id = record.orderId;
		const { orderList } = this.state;

		// 展开订单无详情时拉取一次
		if (!record.detail || !record.detail[0]) {
			record.loading = true;
			this.getDetailList(id).then(
				detailList => {
					record.detail = detailList;
					record.loading = false;
					this.setState({ orderList });
				}
			);
		}
	};

	getList = (options = {}) => {
		/*         {
                    "company_id":319,
                    "shop_id": 7948,
                    "time_range_start":1522652400,
                    "time_range_end":1560322800,
                    "order_type_list": [1],
                    "purchase_type_list": [],
                    "sort_by_amount":1,
                    "sort_by_time":-1; 
                    "page_size":3,
                    "page_num":1
                } */

		const {
			sortByPrice: sort_by_amount = -1, // 空时取默认值-1
			sortByTime: sort_by_time = -1,
			purchaseType: purchase_type_list = [],
			orderType: order_type_list = [],
		} = options;

		return Actions.getList({
			time_range_start: 15438823200,
			time_range_end: 1608361200000,
			sort_by_amount,
			sort_by_time,
			order_type_list,
			purchase_type_list
		}).then(
			response => {
				// console.log('afterGetList:', response)
				// console.log('fakeRes:', res)
				response = res;
				return this.createOrderData(response);
			}
		);
	};

	getDetailList = orderId => Actions.getDetailList({ order_id: orderId })
		.then(
			response => this.createOrderDetail(response)
		);

	createOrderData = resData => {
		const orderList = [];
		// const detailList = []
		resData.data.order_list.forEach(item => {
			const obj = {};
			obj.key = item.id;
			obj.orderId = item.id;
			obj.orderType = item.order_type;
			obj.orderTypeId = item.order_type_id;
			obj.purchaseType = item.purchase_type;
			obj.tradeValue = item.amount;
			obj.purchaseTime = unixSecondToDate(item.purchase_time);
			obj.expanded = false;

			orderList.push(obj);
		});
		// console.log('orderList:', orderList)
		return orderList;
	};

	createOrderDetail = resdetail => {
		const detailList = resdetail.data.detail_list;
		return detailList;
	}

	render() {
		const { orderList: resData } = this.state;

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
					<a>{record.expanded ? '收起支付明细' : '查看支付明细'}</a>
			},
		];

		const {
			form: { getFieldDecorator },
		} = this.props;

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
					onExpand={(expanded, record) => {
						// console.log('onexpand')
						this.handleExpand(expanded, record);
					}}
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
					pagination={{ showQuickJumper: true, showSizeChanger: true }}
				/>
			</Card>
		);
	};
}

export default OrderDetail;