import React, { Component } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { message, Row, Col, Card, Table, Tooltip, Icon, Spin } from 'antd';
import PageEmpty from '@/components/BigIcon/PageEmpty';
import CurrentCustomerLine from './CurrentCustomerLine';
import CurrentSalesLine from './CurrentSalesLine';
import StatusBar from './StatusBar';
import OverViewBar from './OverViewBar';
import styles from './topView.less';
import { DATABOARD } from './constants';

const { LAST_HAND_REFRESH_TIME } = DATABOARD;

@connect(
	({ topview, loading }) => {
		const {
			hasCustomerData,
			hasOrderData,
			latestCustomerData,
			latestOrderAmoutData,
			latestCustomerByShop,
			latestOrderAmoutByShop,
		} = topview;
		return {
			hasCustomerData,
			hasOrderData,
			latestCustomerData,
			latestOrderAmoutData,
			latestCustomerByShop,
			latestOrderAmoutByShop,
			loading,
		};
	},
	dispatch => ({
		fetchAllData: () => dispatch({ type: 'topview/fetchAllData' }),
		getAgeRanges: () => dispatch({ type: 'dashboard/getAgeRanges' }),
	})
)
class DataBoard extends Component {
	async componentDidMount() {
		const { fetchAllData } = this.props;
		// await getAgeRanges();
		const { startAutoRefresh } = this;
		await fetchAllData({ needLoading: true });
		startAutoRefresh();
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	toggleShop = () => {
		alert('切换门店');
	};

	handleTabelFilters = data =>
		data.map(({ shopName }, index) => ({
			text: shopName,
			value: index,
		}));

	foramtTabelData = (data, dataType) => {
		const tabelData = data
			.map(item => {
				const { shopName } = item;
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
				};
			})
			.sort((a, b) => b.value - a.value)
			.map((item, index) => {
				const { value, shopName } = item;
				return {
					rank: index + 1,
					key: index,
					shopName,
					value,
				};
			});

		return tabelData;
	};

	startAutoRefresh = () => {
		const { fetchAllData } = this.props;
		clearTimeout(this.timer);
		this.timer = setTimeout(async () => {
			await fetchAllData({ needLoading: false });
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
			await fetchAllData({ needLoading: true });
			this.startAutoRefresh();
		} else {
			message.warning(formatMessage({ id: 'dashboard.refresh.too.fast' }));
			this.startAutoRefresh();
		}
	};

	render() {
		const { handleRefresh, foramtTabelData, handleTabelFilters, toggleShop } = this;
		const {
			latestCustomerData,
			latestOrderAmoutData,
			latestCustomerByShop,
			latestOrderAmoutByShop,
			loading,
			hasOrderData,
			hasCustomerData,
		} = this.props;
		const columnsCustomer = [
			{
				title: '排名',
				dataIndex: 'rank',
				sorter: (a, b) => a.value - b.value,
			},
			{
				title: '门店',
				dataIndex: 'shopName',
				filters: handleTabelFilters(foramtTabelData(latestCustomerByShop)),
				onFilter: (value, record) => record.key === value,
				render: text => <a onClick={toggleShop}>{text}</a>,
			},
			{ title: '客流量', dataIndex: 'value' },
		];
		const columnsOrder = [
			{
				title: '排名',
				dataIndex: 'rank',
				sorter: (a, b) => a.value - b.value,
			},
			{
				title: '门店',
				dataIndex: 'shopName',
				filters: handleTabelFilters(foramtTabelData(latestOrderAmoutByShop)),
				onFilter: (value, record) => record.key === value,
				render: text => <a onClick={toggleShop}>{text}</a>,
			},
			{ title: '销售额', dataIndex: 'value' },
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
					<Spin spinning={loading.effects['topview/getDeviceOverView']}>
						<Row gutter={20} className={styles['data-detail']}>
							{!(
								hasCustomerData ||
								hasOrderData ||
								loading.effects['topview/getDeviceOverView']
							) && (
								<div>
									<PageEmpty
										description={formatMessage({ id: 'dashboard.emptydata' })}
									/>
								</div>
							)}
							{hasCustomerData && (
								<Col span={12}>
									<Card
										title="客流趋势"
										loading={loading.effects['topview/getLatestPassengerTrend']}
									>
										<CurrentCustomerLine data={latestCustomerData} />
									</Card>
								</Col>
							)}
							{hasCustomerData && (
								<Col span={12}>
									<Card
										title="经营趋势"
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
												<span>客流量排行</span>
												<Tooltip title={'x'} className="tooltip__icon">
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
												<span>销售额排行</span>
												<Tooltip title={'x'} className="tooltip__icon">
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

export default DataBoard;
