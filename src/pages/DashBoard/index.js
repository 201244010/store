import React, { Component } from 'react';
import { connect } from 'dva';
import SearchBar from './SearchBar';
import CardBar from './CardBar';
import ContentChart from './ContentChart';
import FooterChart from './FooterChart';

import styles from './DashBoard.less';

@connect(
	state => ({
		loading: state.loading,
		dashBoard: state.dashBoard,
	}),
	dispatch => ({
		fetchAllData: () => dispatch({ type: 'dashBoard/fetchAllData' }),
		setSearchValue: payload => dispatch({ type: 'dashBoard/setSearchValue', payload }),
	})
)
class DashBoard extends Component {
	componentDidMount() {
		const { fetchAllData } = this.props;
		fetchAllData();
	}

	render() {
		const {
			loading,
			dashBoard: {
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
				<SearchBar {...{ searchValue, lastModifyTime, fetchAllData, setSearchValue }} />
				<div className={styles['display-content']}>
					<CardBar {...{ totalAmount, totalCount, totalRefund, avgUnitSale, loading }} />
					<ContentChart
						{...{ searchValue, orderList, skuRankList, loading, setSearchValue }}
					/>
					<FooterChart {...{ searchValue, loading, setSearchValue }} />
				</div>
			</div>
		);
	}
}

export default DashBoard;
