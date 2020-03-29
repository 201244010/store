import React, { Component } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import * as CookieUtil from '@/utils/cookies';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { message, Row, Col, Card, Table, Tooltip, Icon, Spin } from 'antd';
import PageEmpty from '@/components/BigIcon/PageEmpty';
import CurrentCustomerLine from './CurrentCustomerLine';
import CurrentSalesLine from './CurrentSalesLine';
import StatusBar from './StatusBar';
import OverViewBar from './OverViewBar';
import styles from './topView.less';
import { DATABOARD } from '../Charts/constants';

const { LAST_HAND_REFRESH_TIME } = DATABOARD;

@connect(
	({ topview, loading, store }) => {
		const {
			hasCustomerData,
			hasOrderData,
			latestCustomerData,
			latestOrderAmoutData,
			latestCustomerByShop,
			latestOrderAmoutByShop,
		} = topview;
		const { storeList } = store;
		return {
			hasCustomerData,
			hasOrderData,
			latestCustomerData,
			latestOrderAmoutData,
			latestCustomerByShop,
			latestOrderAmoutByShop,
			loading,
			storeList,
		};
	},
	dispatch => ({
		fetchAllData: () => dispatch({ type: 'topview/fetchAllData' }),
		getAgeRanges: () => dispatch({ type: 'dashboard/getAgeRanges' }),
		getShopIdFromStorage: () => dispatch({ type: 'global/getShopIdFromStorage' }),
		goToPath: (pathId, urlParams = {}, anchorId) =>
			dispatch({
				type: 'menu/goToPath',
				payload: {
					pathId,
					urlParams,
					anchorId,
				},
			}),
	})
)
class TopDataBoard extends Component {
	async componentDidMount() {
		const { fetchAllData } = this.props;
		// await getAgeRanges();
		const { startAutoRefresh } = this;
		await fetchAllData();
		startAutoRefresh();
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	isTopView = () => {
		const shopId = CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY);
		return shopId === 0;
	};

	toggleShop = shopInfo => {
		const { shopId } = shopInfo;
		const { goToPath } = this.props;
		CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, shopId);
		goToPath('dashboard', {}, 'href');
	};

	handleTabelFilters = data =>
		data.map(({ shopName }, index) => ({
			text: shopName,
			value: index,
		}));

	foramtTabelData = (data, dataType) => {
		const tabelData = data
			.map(item => {
				const { shopName, shopId } = item;
				let value;
				if (dataType) {
					if (dataType === 'order') {
						value = item.orderAmount;
					}
					if (dataType === 'customer') {
						value = item.totalCount;
					}
				} else {
					value = 0;
				}
				return {
					value,
					shopName,
					shopId,
				};
			})
			.sort((a, b) => b.value - a.value)
			.map((item, index) => {
				const { value, shopName, shopId } = item;
				return {
					rank: index + 1,
					key: index,
					shopName,
					value,
					shopId,
				};
			});

		return tabelData;
	};

	startAutoRefresh = () => {
		const { fetchAllData } = this.props;
		clearTimeout(this.timer);
		this.timer = setTimeout(async () => {
			await fetchAllData();
			this.startAutoRefresh();
			console.log('refreshed');
		}, 1000 * 60 * 2);
		console.log('wx:', 'setAutoRefresh');
	};

	handleRefresh = async () => {
		const { fetchAllData } = this.props;
		clearTimeout(this.timer);
		const lastHandRefreshTime = Storage.get(LAST_HAND_REFRESH_TIME);
		if (
			!lastHandRefreshTime ||
			moment()
				.subtract(60, 'seconds')
				.isAfter(moment(lastHandRefreshTime))
		) {
			Storage.set({ [LAST_HAND_REFRESH_TIME]: moment().format('YYYY-MM-DD HH:mm:ss') });
			await fetchAllData();
			this.startAutoRefresh();
		} else {
			message.warning(formatMessage({ id: 'dashboard.refresh.too.fast' }));
			this.startAutoRefresh();
		}
	};

	render() {
		const { handleRefresh, foramtTabelData, handleTabelFilters, toggleShop, isTopView } = this;
		const {
			latestCustomerData,
			latestOrderAmoutData,
			latestCustomerByShop,
			latestOrderAmoutByShop,
			loading,
			hasOrderData,
			hasCustomerData,
		} = this.props;

		// 总部状态
		if (isTopView()) {
			console.log('======================总部视角');
		}

		const columnsCustomer = [
			{
				title: formatMessage({ id: 'databoard.top.rank' }),
				dataIndex: 'rank',
				sorter: (a, b) => a.value - b.value,
			},
			{
				title: formatMessage({ id: 'databoard.top.shop' }),
				dataIndex: 'shopName',
				filters: handleTabelFilters(foramtTabelData(latestCustomerByShop)),
				onFilter: (value, record) => record.key === value,
				render: (text, record) => <a onClick={() => toggleShop(record)}>{text}</a>,
			},
			{ title: formatMessage({ id: 'databoard.top.customer.count' }), dataIndex: 'value' },
		];
		const columnsOrder = [
			{
				title: formatMessage({ id: 'databoard.top.rank' }),
				dataIndex: 'rank',
				sorter: (a, b) => a.value - b.value,
			},
			{
				title: formatMessage({ id: 'databoard.top.shop' }),
				dataIndex: 'shopName',
				filters: handleTabelFilters(foramtTabelData(latestOrderAmoutByShop)),
				onFilter: (value, record) => record.key === value,
				render: text => <a onClick={toggleShop}>{text}</a>,
			},
			{ title: formatMessage({ id: 'databoard.order.sales' }), dataIndex: 'value' },
		];

		return (
			<div className={styles['dashboard-wrapper']}>
				<StatusBar
					{...{
						handleRefresh,
					}}
				/>
				<div className={styles['display-content']}>
					<OverViewBar />
					{/* <Spin spinning={loading.effects['topview/getDeviceOverView']}> */}
					<Spin spinning={loading.effects['topview/getLatestPassengerTrend']}>
						<Row gutter={20} className={styles['data-detail']}>
							{!(
								hasCustomerData ||
								hasOrderData ||
								loading.effects['topview/getDeviceOverView']
							) && (
								<div>
									<PageEmpty
										description={formatMessage({
											id: 'databoard.top.data.empty.current',
										})}
									/>
								</div>
							)}
							{hasCustomerData && (
								<Col span={12}>
									<Card
										title={formatMessage({
											id: 'databoard.passenger.trend.title',
										})}
										loading={loading.effects['topview/getLatestPassengerTrend']}
									>
										<CurrentCustomerLine data={latestCustomerData} />
									</Card>
								</Col>
							)}
							{hasOrderData && (
								<Col span={12}>
									<Card
										title={formatMessage({
											id: 'databoard.transaction.trend.title',
										})}
										loading={loading.effects['topview/getLatestOrderTrend']}
									>
										<CurrentSalesLine data={latestOrderAmoutData} />
									</Card>
								</Col>
							)}
							{hasCustomerData && (
								<Col span={12}>
									<Card
										title={
											<>
												<span>
													{formatMessage({
														id: 'databoard.top.rank.customer',
													})}
												</span>
												<Tooltip
													title={formatMessage({
														id: 'databoard.top.rank.customer.tip',
													})}
													className="tooltip__icon"
												>
													<Icon type="info-circle" />
												</Tooltip>
											</>
										}
										className="tabel-wrapper"
									>
										<Table
											dataSource={foramtTabelData(
												latestCustomerByShop,
												'customer'
											)}
											columns={columnsCustomer}
											pagination={{
												pageSize: 5,
												hideOnSinglePage: true,
											}}
										/>
									</Card>
								</Col>
							)}
							{hasOrderData && (
								<Col span={12}>
									<Card
										title={
											<>
												<span>
													{formatMessage({
														id: 'databoard.top.rank.sales',
													})}
												</span>
												<Tooltip
													title={formatMessage({
														id: 'databoard.top.rank.sales.tip',
													})}
													className="tooltip__icon"
												>
													<Icon type="info-circle" />
												</Tooltip>
											</>
										}
										className="tabel-wrapper"
									>
										<Table
											dataSource={foramtTabelData(
												latestOrderAmoutByShop,
												'order'
											)}
											columns={columnsOrder}
											pagination={{
												hideOnSinglePage: true,
												pageSize: 5,
											}}
										/>
									</Card>
								</Col>
							)}
						</Row>
					</Spin>
				</div>
			</div>
		);
	}
}

export default TopDataBoard;
