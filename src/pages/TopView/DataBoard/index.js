import React, { Component } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { message, Row, Col, Card, Table, Tooltip, Icon } from 'antd';
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
		const { handleRefresh, foramtTabelData, handleTabelFilters } = this;
		const {
			latestCustomerData,
			latestOrderAmoutData,
			latestCustomerByShop,
			latestOrderAmoutByShop,
			loading,
		} = this.props;
		const columnsFilter = handleTabelFilters(foramtTabelData(latestCustomerByShop));
		console.log('columnsFilter:', columnsFilter);
		const columns = [
			{
				title: '排名',
				dataIndex: 'rank',
				sorter: (a, b) => a.value - b.value,
			},
			{
				title: '门店',
				dataIndex: 'shopName',
				filters: columnsFilter,
				onFilter: (value, record) => record.key === value,
			},
			{ title: 'value', dataIndex: 'value' },
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
					<Row gutter={20} className={styles['data-detail']}>
						<Col span={12}>
							<Card
								title="客流趋势"
								loading={loading.effects['topview/getLatestPassengerTrend']}
							>
								<CurrentCustomerLine data={latestCustomerData} />
							</Card>
						</Col>
						<Col span={12}>
							<Card
								title="经营趋势"
								loading={loading.effects['topview/getLatestOrderTrend']}
							>
								<CurrentSalesLine data={latestOrderAmoutData} />
							</Card>
						</Col>
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
									dataSource={foramtTabelData(latestCustomerByShop, 'customer')}
									columns={columns}
									pagination={{
										pageSize: 5,
									}}
								/>
							</Card>
						</Col>
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
									dataSource={foramtTabelData(latestOrderAmoutByShop, 'order')}
									columns={columns}
									pagination={{
										pageSize: 5,
									}}
								/>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default DataBoard;
