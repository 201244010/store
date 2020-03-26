import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import Storage from '@konata9/storage.js';
// import moment from 'moment';
// import { formatMessage } from 'umi/locale';
import { Card, Row, Col } from 'antd';
import SearchBar from './SearchBar';
// import OverviewCard from './OverviewCard';

import styles from './index.less';

const RANGE = {
	TODAY: 'day',
	WEEK: 'week',
	MONTH: 'month',
	FREE: 'free',
	YESTERDAY: 'yesterday'
};

// const LAST_REFRESH_TIME = 'lastRefreshTime';

@connect(
	state => ({
		databoard: state.databoard
	}),
	dispatch => ({
		fetchAllData: ({ searchValue, needLoading }) => dispatch({
			type: 'databoard/fetchAllData',
			payload: {
				type: 2,
				searchValue,
				needLoading
			}
		}),
	})
)
class RTDataBoard extends PureComponent {

	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		searchValue: {
	// 			rangeType: RANGE.TODAY,
	// 		},
	// 	};
	// }

	async componentDidMount() {
		const { fetchAllData } = this.props;
		await fetchAllData({
			searchValue: {
				rangeType: RANGE.YESTERDAY,
			},
			needLoading: true
		});
	}

	// componentWillUnmount() {
	// 	clearTimeout(this.timer);
	// }

	// startAutoRefresh = () => {
	// 	const { fetchAllData } = this.props;
	// 	const { searchValue } = this.state;
	// 	clearTimeout(this.timer);
	// 	this.timer = setTimeout(async () => {
	// 		await fetchAllData(searchValue);
	// 		this.startAutoRefresh();
	// 		console.log('refreshed');
	// 	}, 1000 * 60 * 2);
	// }

	onSearchChanged = (value) => {
		console.log('======searchValue====', value);
		const { fetchAllData } = this.props;
		clearTimeout(this.timer);
		// this.setState({
		// 	searchValue: {
		// 		rangeType: value,
		// 	}
		// });
		fetchAllData({
			searchValue: {
				rangeType: value,
			},
			needLoading: true
		});
	}

	render() {
		const { databoard: {
			passengerLoading,
			passengerFlowLoading, enteringRateLoading,
			entryCountLoading, frequencyTrendLoading, passFrenquencyLoading,
			majorLoading
		}} = this.props;
		const loading = passengerLoading ||
			passengerFlowLoading || enteringRateLoading ||
			entryCountLoading || frequencyTrendLoading || passFrenquencyLoading ||
			majorLoading;
		return(
			<div className={styles['databoard-wrapper']}>
				<SearchBar onSearchChanged={this.onSearchChanged} />
				<div className={styles['charts-container']}>
					<Row gutter={24}>
						<Col span={8}>
							<Card className={styles['overview-card']} loading={loading}>test</Card>
						</Col>
						<Col span={8}>
							<Card className={styles['overview-card']} loading={loading}>test</Card>
						</Col>
						<Col span={8}>
							<Card className={styles['overview-card']} loading={loading}>test</Card>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<Card className={styles['line-chart-wrapper']} title="客流趋势" loading={loading}>
								客流趋势
							</Card>
						</Col>
						<Col span={12}>
							<Card className={styles['line-chart-wrapper']} title="客流趋势">客流趋势</Card>
						</Col>
					</Row>
					<Card title="客群到店频次" className={styles['distri-chart-wrapper']}>客群到店频次</Card>
					<Card title="主力客群" className={styles['major-chart-wrapper']}>主力客群</Card>
				</div>
			</div>
		);
	}
}
export default RTDataBoard;