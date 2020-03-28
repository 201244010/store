import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import Storage from '@konata9/storage.js';
// import moment from 'moment';
// import { formatMessage } from 'umi/locale';
import { Row, Col } from 'antd';
import SearchBar from './SearchBar';
import OverviewCard from './OverviewCard';
import PassengerTrend from './PassengerTrend';
import EnteringRateTrend from './EnteringRateTrend';
import CustomerFrequency from './CustomerFrequency';
import MajorCustomer from './MajorCustomer';
import AbnormalTip from './AbnormalTip';

import styles from './index.less';

const RANGE = {
	TODAY: 'day',
	WEEK: 'week',
	MONTH: 'month',
	FREE: 'free',
	YESTERDAY: 'yesterday'
};

const queryTimeType = {
	[RANGE.YESTERDAY]: 1,
	[RANGE.WEEK]: 2,
	[RANGE.MONTH]: 3,
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
		checkIsNormal: () => dispatch({
			type: 'databoard/checkIsNormal',
			payload: {
				type: 2
			}
		}),
		resetCheckState: () => dispatch({
			type: 'databoard/resetCheckNormal',
		}),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class PassengerDataBoard extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			searchValue: {
				rangeType: RANGE.YESTERDAY,
			},
		};
	}

	async componentDidMount() {
		const { fetchAllData, checkIsNormal } = this.props;
		const { searchValue } = this.state;
		await fetchAllData({
			searchValue,
			needLoading: true
		});
		await checkIsNormal();
	}

	componentWillUnmount() {
		// clearTimeout(this.timer);
		const { resetCheckState } = this.props;
		resetCheckState();
	}

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
		this.setState({
			searchValue: {
				rangeType: value,
			}
		});
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
			majorLoading, hasFS
		}, goToPath} = this.props;
		const loading = passengerLoading ||
			passengerFlowLoading || enteringRateLoading ||
			entryCountLoading || frequencyTrendLoading || passFrenquencyLoading ||
			majorLoading;
		const { databoard: { passengerCount, enteringRate, regularCount, avgFrequency,
			passengerFlowList, enteringList, frequencyList, frequencyTrend, customerDistri, majorList
		}} = this.props;
		const { searchValue: { rangeType }} = this.state;
		const timeType = queryTimeType[rangeType];
		console.log('+++++++++++++', this.props);
		return(
			<div className={styles['databoard-wrapper']}>
				<SearchBar onSearchChanged={this.onSearchChanged} />
				{
					hasFS ?
						<div className={styles['charts-container']}>
							<OverviewCard {...{passengerCount, enteringRate, regularCount, avgFrequency, loading, timeType, goToPath}} />
							<Row gutter={24}>
								<Col span={12}>
									<PassengerTrend passengerFlowList={passengerFlowList} timeType={timeType} loading={loading} />
								</Col>
								<Col span={12}>
									<EnteringRateTrend enteringList={enteringList} timeType={timeType} loading={loading} />
								</Col>
							</Row>
							<CustomerFrequency {...{frequencyList, frequencyTrend, customerDistri, timeType, loading}} />
							<MajorCustomer {...{majorList, timeType, loading}} />
						</div>
						:
						<AbnormalTip />
				}
			</div>
		);
	}
}
export default PassengerDataBoard;