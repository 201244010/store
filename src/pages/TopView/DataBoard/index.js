import React, { Component } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { message, Row, Col, Card, Table } from 'antd';
import CurrentCustomerLine from './CurrentCustomerLine';
import CurrentSalesLine from './CurrentSalesLine';
import StatusBar from './StatusBar';
import OverViewBar from './OverViewBar';
import styles from './topView.less';
import { DATABOARD } from './constants';

const { LAST_HAND_REFRESH_TIME } = DATABOARD;

@connect(
	({ topview }) => {
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
		const { handleRefresh, foramtTabelData } = this;
		const {
			latestCustomerData,
			latestOrderAmoutData,
			latestCustomerByShop,
			latestOrderAmoutByShop,
		} = this.props;
		const columns = [
			{
				title: '排名',
				dataIndex: 'rank',
				sorter: (a, b) => a.value - b.value,
			},
			{
				title: '门店',
				dataIndex: 'shopName',
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
					<Row gutter={20}>
						<Col span={12}>
							<Card title="客流趋势">
								<CurrentCustomerLine data={latestCustomerData} />
							</Card>
						</Col>
						<Col span={12}>
							<Card title="经营趋势">
								<CurrentSalesLine data={latestOrderAmoutData} />
							</Card>
						</Col>
					</Row>
					<Row gutter={20}>
						<Col span={12}>
							<Card title="客流量排行" className="tabel-wrapper">
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
							<Card title="销售额排行" className="tabel-wrapper">
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
