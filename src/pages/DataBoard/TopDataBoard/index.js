import React, { Component } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { message, Row, Col, Card, Table, Tooltip, Icon, Spin, Modal } from 'antd';
import PageEmpty from '@/components/BigIcon/PageEmpty';
import CurrentCustomerLine from './CurrentCustomerLine';
import CurrentSalesLine from './CurrentSalesLine';
import * as CookieUtil from '@/utils/cookies';
import StatusBar from './StatusBar';
import OverViewBar from './OverViewBar';
import styles from './topView.less';
import { DATABOARD } from '../Charts/constants';
import { passengerNumFormat, saleMoneyFormat } from '@/utils/format';

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
		this.shopListOptions = JSON.parse(localStorage.getItem('__shop_list__'));
		console.log('shopListOptions:', this.shopListOptions);
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
		const { shopListOptions } = this;
		const hasAdmin = shopListOptions.find(shop => shop.shopId === shopId);
		// const { goToPath } = this.props;
		if (hasAdmin) {
			Modal.confirm({
				title: formatMessage({ id: 'databoard.top.toggleShop.confirm' }),
				okText: formatMessage({ id: 'list.action.view' }),
				cancelText: formatMessage({ id: 'btn.cancel' }),
				maskClosable: false,
				onOk: () => {
					CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, shopId);
					window.location.reload();
				},
			});
		} else {
			Modal.info({
				title: formatMessage({ id: 'databoard.top.toggleShop.info' }),
				okText: formatMessage({ id: 'btn.confirm' }),
				maskClosable: false,
			});
		}

		// goToPath('dashboard', {}, 'href');
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
				const valueFormat =
					dataType === 'order'
						? saleMoneyFormat({ value, returnType: 'join' })
						: passengerNumFormat({ value, returnType: 'join' });
				return {
					rank: index + 1,
					key: index,
					shopName,
					value,
					shopId,
					valueFormat,
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
				width: 100,
				sorter: (a, b) => a.rank - b.rank,
			},
			{
				title: formatMessage({ id: 'databoard.top.shop' }),
				dataIndex: 'shopName',
				filters: handleTabelFilters(foramtTabelData(latestCustomerByShop)),
				onFilter: (value, record) => record.key === value,
				render: (text, record) => <a onClick={() => toggleShop(record)}>{text}</a>,
			},
			{
				title: formatMessage({ id: 'databoard.top.customer.count' }),
				width: 100,
				dataIndex: 'valueFormat',
			},
		];
		const columnsOrder = [
			{
				title: formatMessage({ id: 'databoard.top.rank' }),
				dataIndex: 'rank',
				width: 100,
				sorter: (a, b) => a.rank - b.rank,
			},
			{
				title: formatMessage({ id: 'databoard.top.shop' }),
				dataIndex: 'shopName',
				filters: handleTabelFilters(foramtTabelData(latestOrderAmoutByShop)),
				onFilter: (value, record) => record.key === value,
				render: (text, record) => <a onClick={() => toggleShop(record)}>{text}</a>,
			},
			{
				title: formatMessage({ id: 'databoard.order.sales' }),
				width: 100,
				dataIndex: 'valueFormat',
			},
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
