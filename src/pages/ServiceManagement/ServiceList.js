import React from 'react';
import { formatMessage } from 'umi/locale';
import { Card, Form, Table, Select, Input, DatePicker, Button, Col, Row, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE} from '../../constants';
import { SEARCH_FORM_COL, SEARCH_FORM_GUTTER } from '@/constants/form';
import ServiceDetail from './ServiceDetail';
import global from '@/styles/common.less';


const STATUS = [
	formatMessage({id: 'serviceManagement.status.all'}),
	formatMessage({id: 'serviceManagement.status.unActivate'}),
	formatMessage({id: 'serviceManagement.status.activated'}),
	formatMessage({id: 'serviceManagement.status.disabled'})
];
const { RangePicker } = DatePicker;

@connect(
	state => ({
		service: state.serviceManagement,
		loading: state.loading
	}),
	dispatch => ({
		getList: payload => dispatch({type: 'serviceManagement/getServiceList', payload}),
		getDetail: payload => dispatch({type: 'serviceManagement/getServiceDetail', payload})
	})
)
@Form.create()
class ServiceList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDetail: false,
			pageSize: 10,
			pageNum: 1,
		};
		this.columns = [
			{
				title: formatMessage({id: 'serviceManagement.column.name'}),
				dataIndex: 'serviceName',
				key: 'serviceName'
			},{
				title: formatMessage({id: 'serviceManagement.column.no'}),
				dataIndex: 'serviceNo',
				key: 'serviceNo'
			},{
				title: formatMessage({id: 'serviceManagement.column.subscribeDate'}),
				dataIndex: 'subscribeTime',
				key: 'subscribeTime',
				render: record => moment.unix(record).format('YYYY-MM-DD')
			},{
				title: formatMessage({id: 'serviceManagement.column.validity'}),
				dataIndex: 'validTime',
				key: 'validTime',
				render: (text, record)  => {
					if(record.status === 2) {
						let hours = Math.floor(text / 3600);
						if(hours >= 24) {
							const days = Math.floor(hours / 24);
							hours %= 24;
							return days + formatMessage({id: 'day.unit'}) + hours + formatMessage({id: 'hour.unit'});
						}
						return hours + formatMessage({id: 'hour.unit'});
						// return moment.unix(text).format('MM-DD-hh')
					}
					return formatMessage({id: 'serviceManagement.expired'});
				}
			},{
				title: formatMessage({id: 'serviceManagement.column.status'}),
				dataIndex: 'status',
				key: 'status',
				render: record => STATUS[record]
			},{
				title: formatMessage({id: 'serviceManagement.column.operation'}),
				render: (_, record) => <a onClick={() => this.showDetail(record)}>{formatMessage({id: 'serviceManagement.column.checkDetail'})}</a>
			}
		];
	}
	
	componentDidMount() {
		const { getList } = this.props;
		getList({pageSize: 10, pageNum: 1, search: null});
	}
	
	onSearch = () => {
		const { form: {getFieldsValue }, getList} = this.props;
		const search = getFieldsValue();
		getList({pageSize: 10, pageNum: 1, search});
		this.setState({pageSize: 10, pageNum: 1});
	};
	
	reset = () => {
		const { form: { resetFields }} = this.props;
		resetFields();
	};
	
	closeModal = () => {
		this.setState({showDetail: false});
	};
	
	showDetail = record => {
		const { getDetail } = this.props;
		const { serviceNo } = record;
		getDetail({serviceNo});
		this.setState({showDetail: true});
	};
	
	handlePageChange = (pageNum, pageSize) => {
		const { getList } = this.props;
		getList({pageNum, pageSize, search: null});
		this.setState({pageSize, pageNum});
	};
	
	render() {
		const {
			service: { serviceList: { list, totalCount }},
			form: { getFieldDecorator},
			loading
		} = this.props;
		const { showDetail, pageSize, pageNum } = this.state;
		
		return (
			<Card
				title={formatMessage({id: 'serviceManagement.title'})}
				className={global['search-bar']}
			>
				<div className={global['search-bar']}>
					<Form layout="inline">
						<Row gutter={SEARCH_FORM_GUTTER.NORMAL}>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'serviceManagement.service.info' })}>
									{getFieldDecorator('key', {
									})(
										<Input placeholder={formatMessage({id: 'serviceManagement.placeholder.search'})} />
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'serviceManagement.service.status' })}>
									{getFieldDecorator('status', {
										initialValue: 0
									})(
										<Select>
											{STATUS.map((item, index) =>
												<Select.Option value={index} key={item}>{item}</Select.Option>
											)}
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'serviceManagement.service.subscribe.date' })}>
									{getFieldDecorator('date', {
									})(
										<RangePicker />
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.OFFSET_TWO_THIRD}>
								<Form.Item className={global['query-item']}>
									<Button
										onClick={this.onSearch}
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
				<Spin spinning={loading.effects['serviceManagement/getServiceList']}>
					<Table
						columns={this.columns}
						dataSource={list}
						pagination={{
							total: totalCount,
							showSizeChanger: true,
							defaultPageSize: DEFAULT_PAGE_SIZE,
							pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
							showQuickJumper: true,
							onShowSizeChange: this.handlePageChange,
							onChange: this.handlePageChange,
							showTotal: total => `${formatMessage({id: 'serviceManagement.total'})}${total}${formatMessage({id: 'serviceManagement.record'})}`,
							pageSize,
							current: pageNum
						}}
						rowKey='serviceNo'
					/>
				</Spin>
				{
					showDetail && <ServiceDetail closeModal={this.closeModal} />
				}
			</Card>
		);
	}
}

export default ServiceList;