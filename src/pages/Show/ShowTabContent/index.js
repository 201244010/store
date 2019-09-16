import React from 'react';
import { connect } from 'dva';
// import { formatMessage } from 'umi/locale';
import ShowCards from '../ShowCards';
// import ShowChart from '../ShowChart';
import ShowSaleList from '../ShowSaleList';
import ShowPayChart from '../ShowPayChart';
// import CashierAudit from '../CashierAudit';
import { DASHBOARD } from '@/pages/DashBoard/constants';

import styles from './index.less';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

// const FILL_COLOR = ['l(90) 0:#FFBC50 1:#FFBC50', 'l(90) 0:#B38F6B 1:#B37047'];
// const SHADOW_COLOR = '#FF7750';

@connect(
	null,
	dispatch => ({
		fetchAllData: ({ range, activeKey }) =>
			dispatch({ type: 'showInfo/fetchAllData', payload: { range, activeKey } }),
		clearSearch: () => dispatch({ type: 'showInfo/clearSearch' }),
	})
)
class ShowTabContent extends React.Component {
	componentDidMount() {
		const { time = 'today', activeKey } = this.props;

		if (time === 'today') {
			this.atuoRefresh(RANGE.TODAY);
		}

		if (time === 'week') {
			this.atuoRefresh(RANGE.WEEK);
		}

		if (time === 'month') {
			this.atuoRefresh(RANGE.MONTH);
		}

		setTimeout(() => {
			if (time === 'today') {
				this.atuoRefresh(RANGE.TODAY, activeKey);
			}

			if (time === 'week') {
				this.atuoRefresh(RANGE.WEEK, activeKey);
			}

			if (time === 'month') {
				this.atuoRefresh(RANGE.MONTH, activeKey);
			}
			this.startAutoRefresh();
		}, 1000 * 30);
	}

	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearTimeout(this.timer);
		clearSearch();
	}

	atuoRefresh = (type, activeKey = 'all') => {
		const { fetchAllData } = this.props;
		fetchAllData({ range: type, activeKey });
	};

	startAutoRefresh = () => {
		clearTimeout(this.timer);
		this.timer = setTimeout(async () => {
			const { time = 'today', activeKey = 'all' } = this.props;
			if (time === 'today') {
				this.atuoRefresh(RANGE.TODAY, activeKey);
			}

			if (time === 'week') {
				this.atuoRefresh(RANGE.WEEK, activeKey);
			}

			if (time === 'month') {
				this.atuoRefresh(RANGE.MONTH, activeKey);
			}
			this.startAutoRefresh();
		}, 1000 * 60);
	};

	render() {
		const { time = 'today' } = this.props;

		return (
			<>
				<ShowCards
					{...{
						time,
					}}
				/>
				<div className={styles['content-body']}>
					<div className={styles['body-chart']}>
						{/* <CashierAudit /> */}
						{/* <ShowChart
							chartName={formatMessage({ id: 'dashboard.order.show.sales' })}
							saleType="amount"
							{...{
								time,
							}}
						/>
						<ShowChart
							chartName={formatMessage({ id: 'dashboard.order.show.count' })}
							saleType="count"
							fillColor={FILL_COLOR}
							shadowColor={SHADOW_COLOR}
							{...{
								time,
							}}
						/> */}

					</div>
					<ShowSaleList
						{...{
							time,
						}}
					/>
					<ShowPayChart
						{...{
							time,
						}}
					/>
				</div>
			</>
		);
	}
}

export default ShowTabContent;
