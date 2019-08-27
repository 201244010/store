import React, { Component } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import SearchBar from './SearchBar';
import Overview from './Overview';
import CardBar from './CardBar';
import ContentChart from './ContentChart';
import FooterChart from './FooterChart';

import { DASHBOARD } from './constants';

import styles from './DashBoard.less';

const { LAST_HAND_REFRESH_TIME } = DASHBOARD;

@connect(
	state => ({
		loading: state.loading,
		dashBoard: state.dashBoard,
	}),
	dispatch => ({
		fetchAllData: ({ needLoading }) =>
			dispatch({ type: 'dashBoard/fetchAllData', payload: { needLoading } }),
		setSearchValue: payload => dispatch({ type: 'dashBoard/setSearchValue', payload }),
		clearSearch: () => dispatch({ type: 'dashBoard/clearSearch' }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class DashBoard extends Component {
	componentWillMount() {
		const { fetchAllData } = this.props;
		fetchAllData({ needLoading: true });
	}

	componentDidMount() {
		this.startAutoRefresh();
	}

	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearTimeout(this.timer);
		clearSearch();
	}

	startAutoRefresh = () => {
		const { fetchAllData } = this.props;
		clearTimeout(this.timer);
		this.timer = setTimeout(async () => {
			await fetchAllData({ needLoading: false });
			this.startAutoRefresh();
			console.log('refreshed');
		}, 1000 * 60 * 2);
	};

	onSearchChanged = async () => {
		const { fetchAllData } = this.props;
		clearTimeout(this.timer);
		await fetchAllData({ needLoading: true });
		this.startAutoRefresh();
	};

	doHandRefresh = async () => {
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
			message.warning(formatMessage({ id: 'dashBoard.refresh.too.fast' }));
			this.startAutoRefresh();
		}
	};

	render() {
		const {
			dashBoard: {
				overviewProductLoading,
				overviewDeviceLoading,
				overviewIPCLoading,
				overviewNetworkLoading,

				productOverview,
				deviceOverView,
				ipcOverView,
				networkOverview,

				totalAmountLoading,
				totalCountLoading,
				totalRefundLoading,
				avgUnitLoading,

				barLoading,
				skuLoading,
				chartLoading,

				totalAmount,
				totalCount,
				totalRefund,
				avgUnitSale,
				searchValue,
				lastModifyTime,
				orderList,
				skuRankList,
				purchaseInfo,
			},
			fetchAllData,
			setSearchValue,
			goToPath,
		} = this.props;

		return (
			<div className={styles['dashboard-wrapper']}>
				<SearchBar
					{...{
						searchValue,
						lastModifyTime,
						fetchAllData,
						setSearchValue,
						doHandRefresh: this.doHandRefresh,
						onSearchChanged: this.onSearchChanged,
					}}
				/>
				<div className={styles['display-content']}>
					<Overview
						{...{
							overviewProductLoading,
							overviewDeviceLoading,
							overviewIPCLoading,
							overviewNetworkLoading,
							productOverview,
							deviceOverView,
							ipcOverView,
							networkOverview,
							goToPath,
						}}
					/>
					<CardBar
						{...{
							searchValue,
							totalAmount,
							totalCount,
							totalRefund,
							avgUnitSale,
							totalAmountLoading,
							totalCountLoading,
							totalRefundLoading,
							avgUnitLoading,
						}}
					/>
					<ContentChart
						{...{
							searchValue,
							orderList,
							skuRankList,
							barLoading,
							skuLoading,
							setSearchValue,
						}}
					/>
					<FooterChart {...{ searchValue, chartLoading, purchaseInfo, setSearchValue }} />
				</div>
			</div>
		);
	}
}

export default DashBoard;
