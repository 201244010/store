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
	componentDidMount() {
		const { fetchAllData } = this.props;
		fetchAllData({ needLoading: true });
		this.startAutoRefresh();
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	startAutoRefresh = () => {
		const { fetchAllData } = this.props;
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			console.log('refreshed');
			fetchAllData({ needLoading: false });
			this.startAutoRefresh();
		}, 1000 * 60 * 2);
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
				totalLoading,
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
					}}
				/>
				<div className={styles['display-content']}>
					<CardBar
						{...{ totalAmount, totalCount, totalRefund, avgUnitSale, totalLoading }}
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
					<FooterChart {...{ searchValue, chartLoading, setSearchValue }} />
				</div>
			</div>
		);
	}
}

export default DashBoard;
