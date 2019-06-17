import React, { Component } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import SearchBar from './SearchBar';
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
	})
)
class DashBoard extends Component {
	async componentDidMount() {
		const { fetchAllData } = this.props;
		await fetchAllData({ needLoading: true });
		this.startAutoRefresh();
		console.log('done');
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
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

	onSearchChanged = () => {
		clearTimeout(this.timer);
		this.startAutoRefresh();
	};

	doHandRefresh = () => {
		clearTimeout(this.timer);
		const lastHandRefreshTime = Storage.get(LAST_HAND_REFRESH_TIME);
		if (
			!lastHandRefreshTime ||
			moment()
				.subtract(60, 'seconds')
				.isAfter(moment(lastHandRefreshTime))
		) {
			Storage.set({ [LAST_HAND_REFRESH_TIME]: moment().format('YYYY-MM-DD HH:mm:ss') });
			window.location.reload();
		} else {
			message.warning(formatMessage({ id: 'dashBoard.refresh.too.fast' }));
			this.startAutoRefresh();
		}
	};

	render() {
		const {
			dashBoard: {
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
					<CardBar
						{...{
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
