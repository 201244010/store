import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { message, Row, Col, } from 'antd';
import SearchBar from './SearchBar';
import OverviewCard from './OverviewCard';
import DistriChart from './DistriChart';
import PassengerTrendLine from './PassengerTrendLine';
import TransactionTrend from './TransactionTrend';

import styles from './index.less';

const RANGE = {
	TODAY: 'day',
	WEEK: 'week',
	MONTH: 'month',
	FREE: 'free',
	YESTERDAY: 'yesterday'
};

const queryTimeType = {
	[RANGE.TODAY]: 1,
	[RANGE.WEEK]: 2,
	[RANGE.MONTH]: 3,
};

const LAST_REFRESH_TIME = 'lastRefreshTime';

@connect(
	state => ({
		databoard: state.databoard
	}),
	dispatch => ({
		fetchAllData: ({ searchValue, needLoading }) => dispatch({
			type: 'databoard/fetchAllData',
			payload: {
				type: 1,
				searchValue,
				needLoading
			}
		}),
	})
)
class RTDataBoard extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			searchValue: {
				rangeType: RANGE.TODAY,
			},
		};
	}

	async componentDidMount() {
		const { fetchAllData } = this.props;
		const { searchValue } = this.state;
		await fetchAllData({
			needLoading: true,
			searchValue,
		});
		// console.log('==========', this.props);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	startAutoRefresh = () => {
		const { fetchAllData } = this.props;
		const { searchValue } = this.state;
		clearTimeout(this.timer);
		this.timer = setTimeout(async () => {
			await fetchAllData({
				searchValue,
				needLoading: false,
			});
			this.startAutoRefresh();
			console.log('refreshed');
		}, 1000 * 60 * 2);
	}

	onSearchChanged = (value) => {
		console.log('======searchValue====', value);
		const { fetchAllData } = this.props;
		clearTimeout(this.timer);
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

	handleRefresh = async () => {
		const { fetchAllData } = this.props;
		const { searchValue } = this.state;
		clearTimeout(this.timer);
		const lastRefreshTime = Storage.get(LAST_REFRESH_TIME);
		if (
			!lastRefreshTime ||
			moment()
				.subtract(60, 'seconds')
				.isAfter(moment(lastRefreshTime))
		) {
			Storage.set({ [LAST_REFRESH_TIME]: moment().format('YYYY-MM-DD HH:mm:ss') });
			await fetchAllData({
				searchValue,
				needLoading: true,
			});
			this.startAutoRefresh();
		} else {
			message.warning(formatMessage({ id: 'dashboard.refresh.too.fast' }));
			this.startAutoRefresh();
		}
	}

	render() {
		const { databoard: {
			RTPassLoading, RTDevicesLoading,
			totalAmountLoading, totalCountLoading, totalRateLoading,
			RTPassengerFlowLoading,
			transactionCountLoading, transactionRateLoading,
			regularDistriLoading, genderAndAgeLoading
		}} = this.props;
		const loading = RTPassLoading || RTDevicesLoading ||
			totalAmountLoading || totalCountLoading || totalRateLoading ||
			RTPassengerFlowLoading ||
			transactionCountLoading || transactionRateLoading ||
			regularDistriLoading || genderAndAgeLoading;
		const { searchValue: { rangeType } } = this.state;
		const { databoard: {
			regularList, RTPassengerFlowList, lastModifyTime, ageGenderList,
			RTPassengerCount, RTEnteringRate, RTDeviceCount,
			paymentTotalAmount, paymentTotalCount, transactionRate,
			amountList, countList, transactionRateList,
		} } = this.props;
		const timeType = queryTimeType[rangeType];
		console.log('=====', this.props);
		return(
			<div className={styles['databoard-wrapper']}>
				<SearchBar
					{...{
						onSearchChanged: this.onSearchChanged,
						handleRefresh: this.handleRefresh,
						lastModifyTime,
					}}
				/>
				<div className={styles['charts-container']}>
					<OverviewCard
						loading={loading}
						{...{
							RTPassengerCount, RTEnteringRate, RTDeviceCount,
							paymentTotalAmount: paymentTotalAmount[rangeType],
							paymentTotalCount: paymentTotalCount[rangeType],
							transactionRate
						}}
					/>
					<Row gutter={24}>
						<Col span={12}>
							<PassengerTrendLine
								{...{
									timeType,
									RTPassengerFlowList,
									loading
								}}
							/>
						</Col>
						<Col span={12}>
							<TransactionTrend
								{...{
									timeType,
									amountList,
									countList,
									transactionRateList,
									loading
								}}
							/>
						</Col>
					</Row>
					<DistriChart regularList={regularList} ageGenderList={ageGenderList} />
				</div>

			</div>
		);
	}
}
export default RTDataBoard;