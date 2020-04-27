import React from 'react';
import { Card, Form, Row, Col, Button, Table, DatePicker, TreeSelect, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { replaceTemplateWithValue, getShopList } from '@/utils/utils';
import { ONE_DAY_TIMESTAMP } from '@/constants';

import { SEARCH_FORM_COL, FORM_FORMAT } from '@/constants/form';
import * as CookieUtil from '@/utils/cookies';

import styles from './index.less';

const { RangePicker } = DatePicker;

@connect(
	state => ({
		loading: state.loading,
		businessDaily: state.businessDaily,
	}),
	dispatch => ({
		getBusinessData: payload =>
			dispatch({
				type: 'businessDaily/getBusinessData',
				payload,
			}),
		setPagination: payload => dispatch({ type: 'businessDaily/setPagination', payload }),
		getCompanyIdFromStorage: () => dispatch({ type: 'global/getCompanyIdFromStorage' }),
		getOrgnazationTree: () => dispatch({ type: 'store/getOrgnazationTree' }),
		getCompanyListFromStorage: () => dispatch({ type: 'global/getCompanyListFromStorage' }),
	})
)
class BusinessDaily extends React.Component {
	constructor(props) {
		super(props);
		this.date = new Date() - ONE_DAY_TIMESTAMP;
		this.state = {
			orgnizationTree: [],
			shopIdList: [],
			timeRange: [moment(this.date), moment(this.date)],
		};
		this.originalTree = [];
		this.shopId = CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY);
		this.columns = [
			{
				title: formatMessage({ id: 'businessDaily.shopName' }),
				dataIndex: 'shopId',
				render: number => getShopList(this.originalTree)[number] || '--',
			},
			{
				title: formatMessage({ id: 'businessDaily.orderDate' }),
				dataIndex: 'time',
				render: number => number || '--',
			},
			{
				title: formatMessage({ id: 'businessDaily.orderMoney' }),
				dataIndex: 'orderTotalAmount',
			},
			{
				title: formatMessage({ id: 'businessDaily.orderNumber' }),
				dataIndex: 'orderTotalCount',
			},
			{
				title: formatMessage({ id: 'businessDaily.price' }),
				render: (_, record) => {
					const { orderTotalAmount, orderTotalCount } = record;
					return orderTotalCount ? (orderTotalAmount / orderTotalCount).toFixed(2) : '--';
				},
			},
			{
				title: formatMessage({ id: 'businessDaily.Inletflow' }),
				render: (_, record) => {
					const { passengerTotalCount, passengerEntryHeadCount } = record;
					return passengerTotalCount + passengerEntryHeadCount;
				},
			},
			{
				title: formatMessage({ id: 'businessDaily.InRate' }),
				render: (_, record) => {
					const {
						passengerPassCount,
						passengerEntryHeadCount,
						passengerTotalCount,
					} = record;
					return passengerPassCount + passengerEntryHeadCount + passengerTotalCount
						? `${(
							((passengerEntryHeadCount + passengerTotalCount) * 100) /
								(passengerPassCount + passengerEntryHeadCount + passengerTotalCount)
						  ).toFixed(2)}%`
						: '--';
				},
			},
			{
				title: formatMessage({ id: 'businessDaily.trageTransfer' }),
				render: (_, record) => {
					const {
						orderTotalCount,
						passengerTotalCount,
						passengerEntryHeadCount,
					} = record;
					return passengerTotalCount + passengerEntryHeadCount
						? `${(
							(orderTotalCount * 100) /
								(passengerTotalCount + passengerEntryHeadCount)
						  ).toFixed(2)}%`
						: '--';
				},
			},
		];
	}

	async componentDidMount() {
		const { getOrgnazationTree, getBusinessData, setPagination } = this.props;
		const {
			timeRange: [startTime, endTime],
		} = this.state;
		this.originalTree = await getOrgnazationTree();
		await setPagination({ current: 1, pageSize: 10 });
		getBusinessData({
			shopIdList:
				this.shopId === 0 ? Object.keys(getShopList(this.originalTree)) : [this.shopId],
			startTime: startTime.format('YYYY-MM-DD'),
			endTime: endTime.format('YYYY-MM-DD'),
		});
		this.createOrgnizationTree();
	}

	traversalTreeData = (originalList, targetList, companyId) => {
		if (originalList instanceof Array) {
			originalList.forEach(item => {
				const { orgName, orgId } = item;
				const target = {
					title: orgName,
					value: `${orgId}`,
					key: `${orgId}`,
					children: [],
				};
				targetList.push(target);
				if (item.children && item.children.length) {
					this.traversalTreeData(item.children, target.children, companyId);
				}
			});
		}
	};

	createOrgnizationTree = async () => {
		const { getCompanyIdFromStorage, getCompanyListFromStorage } = this.props;
		const currentCompanyId = await getCompanyIdFromStorage();
		const companyList = await getCompanyListFromStorage();
		const targetTree = [];
		if (this.originalTree && this.originalTree.length) {
			this.traversalTreeData(this.originalTree, targetTree, currentCompanyId);
		}
		const companyInfo =
			companyList.find(company => company.companyId === currentCompanyId) || {};
		const orgnizationTree = [
			{
				title: companyInfo.companyName,
				value: companyInfo.companyId,
				key: companyInfo.companyId,
				children: targetTree,
				disabled: currentCompanyId === companyInfo.companyId,
			},
		];
		this.setState({
			orgnizationTree,
		});
	};

	changeTimeRange = dates => {
		this.setState({
			timeRange: [dates[0], dates[1]],
		});
	};

	handleQuery = () => {
		const { getBusinessData, setPagination } = this.props;
		const {
			shopIdList,
			timeRange: [startTime, endTime],
		} = this.state;
		const shopList =
			this.shopId === 0
				? shopIdList.length
					? shopIdList
					: Object.keys(getShopList(this.originalTree))
				: [this.shopId];
		setPagination({ current: 1, pageSize: 10 });
		if (endTime.valueOf() - startTime.valueOf() > 90000 * 86400) {
			message.error(formatMessage({ id: 'businessDaily.message.tip' }));
		} else {
			getBusinessData({
				shopIdList: shopList,
				startTime: startTime.format('YYYY-MM-DD'),
				endTime: endTime.format('YYYY-MM-DD'),
			});
		}
	};

	onChange = value => {
		this.setState({
			shopIdList: value,
		});
	};

	onTableChange = table => {
		const { current, pageSize } = table;
		const { setPagination } = this.props;
		setPagination({ current, pageSize });
	};

	disabledDate = current => current && current > moment().endOf('day') - 1000 * 86400;

	handleReset = () => {
		const { getBusinessData, setPagination } = this.props;
		this.setState({
			shopIdList: [],
			timeRange: [moment(this.date), moment(this.date)],
		});
		setPagination({ current: 1, pageSize: 10 });
		getBusinessData({
			shopIdList:
				this.shopId === 0 ? Object.keys(getShopList(this.originalTree)) : [this.shopId],
			startTime: moment(this.date).format('YYYY-MM-DD'),
			endTime: moment(this.date).format('YYYY-MM-DD'),
		});
	};

	render() {
		const {
			businessDaily: { countList, pagination },
			loading,
		} = this.props;
		const searchCol = this.shopId === 0 ? SEARCH_FORM_COL.ONE_THIRD : SEARCH_FORM_COL.ONE_HALF;
		const { orgnizationTree, shopIdList, timeRange } = this.state;

		return (
			<Card className={styles['business-daily']}>
				<h3>{formatMessage({ id: 'businessDaily.businessDaily' })}</h3>
				<div className={styles['search-bar']}>
					<Form layout="inline">
						<Row gutter={FORM_FORMAT.gutter}>
							{this.shopId === 0 && (
								<Col {...searchCol}>
									<Form.Item label={formatMessage({ id: 'businessDaily.shop' })}>
										<TreeSelect
											value={shopIdList}
											dropdownStyle={{ maxHeight: '50vh' }}
											treeDefaultExpandAll
											multiple
											treeData={orgnizationTree}
											onChange={this.onChange}
										/>
									</Form.Item>
								</Col>
							)}
							<Col
								{...searchCol}
								className={this.shopId === 0 && styles['range-picker']}
							>
								<Form.Item
									label={formatMessage({ id: 'businessDaily.selectDate' })}
								>
									<RangePicker
										value={timeRange}
										format="YYYY-MM-DD"
										allowClear={false}
										onChange={this.changeTimeRange}
										disabledDate={this.disabledDate}
									/>
									<div>{formatMessage({ id: 'businessDaily.tip' })}</div>
								</Form.Item>
							</Col>
							<Col {...searchCol} className={styles['button-left']}>
								<Form.Item className={styles['query-item']}>
									<Button type="primary" onClick={this.handleQuery}>
										{formatMessage({ id: 'btn.query' })}
									</Button>
									<Button
										style={{ marginLeft: '20px' }}
										onClick={this.handleReset}
									>
										{formatMessage({ id: 'btn.reset' })}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>
				<div>
					<Table
						rowKey={(_, index) => index}
						dataSource={countList}
						columns={this.columns}
						pagination={{
							...pagination,
							showTotal: total =>
								replaceTemplateWithValue({
									messageId: 'businessDaily.total.item',
									valueList: [{ key: '##total##', value: total }],
								}),
						}}
						onChange={this.onTableChange}
						loading={loading.effects['businessDaily/getBusinessData']}
					/>
				</div>
			</Card>
		);
	}
}

export default BusinessDaily;
