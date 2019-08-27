import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import SearchBar from './SearchBar';
import SalseBar from './SalseBar';
import SalseChart from './SalseChart';
import CustomerChart from './CustomerChart';
import OverviewBar from './OverviewBar';
import styles from './DashBoard.less';
import { DASHBOARD } from './constants';

const { LAST_HAND_REFRESH_TIME } = DASHBOARD;

@connect(
	null,
	dispatch => ({
		fetchAllData: ({ needLoading }) =>
			dispatch({ type: 'dashboard/fetchAllData', payload: { needLoading } }),
	})
)
class DashBoard extends PureComponent {
	componentDidMount() {
		const { fetchAllData } = this.props;
		fetchAllData({ needLoading: true });
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
			message.warning(formatMessage({ id: 'dashboard.refresh.too.fast' }));
			this.startAutoRefresh();
		}
	};

	render() {
		return (
			<div className={styles['dashboard-wrapper']}>
				<SearchBar {...{ doHandRefresh: this.doHandRefresh }} />
				<div className={styles['display-content']}>
					<SalseBar />
					<SalseChart />
					<CustomerChart />
					<OverviewBar />
				</div>
			</div>
		);
	}
}

export default DashBoard;
