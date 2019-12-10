import  React  from 'react';
import { formatMessage } from 'umi/locale';
import { Card, Form, Table, Select, Input, DatePicker, Button, Col, Row, Spin, Badge, Divider } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE} from '../../constants';
import { SEARCH_FORM_COL, SEARCH_FORM_GUTTER } from '@/constants/form';
import global from '@/styles/common.less';
import styles from './orderManagement.less';

const { RangePicker } = DatePicker;
const STATUS = [
	{name: formatMessage({id: 'orderManagement.status.all'}), value: -1},
	{name: formatMessage({id: 'orderManagement.status.success'}), value: 4},
	{name: formatMessage({id: 'orderManagement.status.waitingPay'}), value: 1},
	{name: formatMessage({id: 'orderManagement.status.fail'}), value: 5},
];

@connect(
	state => ({
		loading: state.loading,
		order: state.orderManagement
	}),
	dispatch => ({
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		getOrderList: payload => dispatch({type: 'orderManagement/getOrderList', payload}),
		updateState: payload => dispatch({type: 'orderManagement/updateState', payload})
	})
)
@Form.create()
class OrderList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageSize: 10,
			pageNum: 1,
			order: 0
		};
		
		this.columns = [
			{
				title: formatMessage({id: 'orderManagement.orderId'}),
				dataIndex: 'orderNo',
				key: 'orderNo'
			},{
				title: formatMessage({id: 'orderManagement.orderName'}),
				dataIndex: 'orderName',
				key: 'orderName'
			},{
				title: formatMessage({id: 'orderManagement.createdTime'}),
				dataIndex: 'createdTime',
				key: 'createdTime',
				render: record => moment.unix(record).format('YYYY-MM-DD HH:mm:ss'),
				sorter: true
			},{
				title: formatMessage({id: 'orderManagement.tradeStatus'}),
				dataIndex: 'status',
				key: 'status',
				render: value => {
					switch (value) {
						case 4: return <Badge status='success' text={STATUS[1].name} />;
						case 1: return <Badge status='success' className={styles['waiting-dot']} text={STATUS[2].name} />;
						case 5: return <Badge status='success' className={styles['fail-dot']} text={STATUS[3].name} />;
						default: return <Badge status='success' className={styles['fail-dot']} text={STATUS[3].name} />;
					}
				}
			},{
				title: formatMessage({id: 'orderManagement.actuallyPay'}),
				dataIndex: 'paymentAmount',
				key: 'paymentAmount',
				render: (value, record) => {
					if(record.status !== 4) {
						return '--';
					}
					
					if(value === 0) {
						return `${formatMessage({id: 'orderManagement.yuan'})}0`;
					}
					
					return `${formatMessage({id: 'orderManagement.yuan'})}${value.toFixed(2)}`;
					
				}
			},{
				title: formatMessage({id: 'orderManagement.operation'}),
				render: (_, record) => {
					
					switch (record.status) {
						case 4: return <a onClick={() => this.showDetail(record)}>{formatMessage({id: 'orderManagement.operation.detail'})}</a>;
						case 1: return(
							<div>
								<a onClick={() => this.showDetail(record)}>{formatMessage({id: 'orderManagement.operation.detail'})}</a>
								<Divider type="vertical" />
								<a onClick={() => this.pay(record)}>{formatMessage({id: 'orderManagement.operation.payImmediately'})}</a>
							</div>
						);
						case 5: return (
							<div>
								<a onClick={() => this.showDetail(record)}>{formatMessage({id: 'orderManagement.operation.detail'})}</a>
								<Divider type="vertical" />
								<a onClick={this.bugAgain}>{formatMessage({id: 'orderManagement.operation.purchaseAgain'})}</a>
							</div>
						);
						default: return <a onClick={() => this.showDetail(record)}>{formatMessage({id: 'orderManagement.operation.detail'})}</a>;
					}
				}
			}
		];
	};
	
	componentDidMount() {
		this.getList(10, 1, 'descend');
	}
	
	getList = ( pageSize, pageNum, order ) => {
		const { getOrderList } = this.props;
		getOrderList({
			pageSize,
			pageNum,
			sortType: order
		});
		this.setState({
			pageSize,
			pageNum,
			order
		});
	};
	
	handlePageChange = (page, _, sort) => {
		const { current, pageSize } = page;
		const { order = 'descend' } = sort;
		this.changeColumns(sort);
		
		this.getList( pageSize, current, order);
		
	};
	
	showDetail = record => {
		const { orderNo } = record;
		const { goToPath } = this.props;
		goToPath('serviceOrderDetail', { orderNo });
	};
	
	changeColumns = sorter => {
		this.columns.forEach(item => {
			const tmpItem = item;
			if (item.dataIndex === 'createdTime') {
				tmpItem.sortOrder = sorter.columnKey === 'createdTime' && sorter.order;
			}
			
			return tmpItem;
		});
	};
	
	reset = () => {
		const {
			form: { resetFields },
			updateState
		} = this.props;
		
		resetFields();
		this.changeColumns({});
		updateState({
			searchValue: {
				key: '',
				status: -1,
				date: [],
			}
		});
		this.getList(10, 1, 'descend');
	};
	
	handleSearch = () => {
		const { pageSize, order } = this.state;
		const {
			form: { getFieldsValue },
			updateState
		} = this.props;
		let { key, status, date } = getFieldsValue();
		if(key === undefined) key = '';
		if(date === undefined) date = [];
		if(status === undefined) status = -1;
		updateState({
			searchValue: {
				key,
				status,
				date,
			}
		});
		this.getList(pageSize, 1, order);
	};
	
	disabledDate = current => current && current > moment().endOf('day');
	
	bugAgain = () => {
		const { goToPath } = this.props;
		goToPath('cloudStorage');
	};
	
	pay = record => {
		const { goToPath } = this.props;
		const { orderNo } = record;
		goToPath('paymentPage', { orderNo });
	};
	
	render() {
		const { pageSize, pageNum } = this.state;
		const {
			form: { getFieldDecorator },
			loading,
			order: { orderList : { totalCount, list }}
		} = this.props;
		
		
		return (
			<Card
				className={global['search-bar']}
			>
				<div className={global['search-bar']}>
					<Form layout="inline">
						<Row gutter={SEARCH_FORM_GUTTER.NORMAL}>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'orderManagement.orderId' })}>
									{getFieldDecorator('key', {
									})(
										<Input placeholder={formatMessage({id: 'orderManagement.orderId.placeHolder'})} />
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'orderManagement.tradeStatus' })}>
									{getFieldDecorator('status', {
										initialValue: -1
									})(
										<Select>
											{STATUS.map((item, index) =>
												<Select.Option value={item.value} key={index}>{item.name}</Select.Option>
											)}
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'orderManagement.createdDate' })}>
									{getFieldDecorator('date', {
									})(
										<RangePicker
											disabledDate={this.disabledDate}
										/>
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.OFFSET_TWO_THIRD}>
								<Form.Item className={global['query-item']}>
									<Button
										onClick={this.handleSearch}
										type="primary"
									>
										{formatMessage({ id: 'btn.query' })}
									</Button>
									
									<Button
										onClick={this.reset}
										className={global['btn-margin-left']}
									>
										{formatMessage({ id: 'btn.reset' })}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>
				<Spin spinning={loading.effects['orderManagement/getOrderList']}>
					<Table
						columns={this.columns}
						dataSource={list}
						pagination={{
							total: totalCount,
							showSizeChanger: true,
							defaultPageSize: DEFAULT_PAGE_SIZE,
							pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
							
							showTotal: total => `${formatMessage({id: 'serviceManagement.total'})}${total}${formatMessage({id: 'serviceManagement.record'})}`,
							pageSize,
							current: pageNum
						}}
						rowKey='orderNo'
						onChange={this.handlePageChange}
					/>
				</Spin>
				
			</Card>
		);
	}
}

export default OrderList;