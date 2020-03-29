import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { message, Row, Col } from 'antd';
import { getQueryDate } from '@/models/DataBoard/dataBoard';
import SearchBar from './SearchBar';
import OverviewCard from './OverviewCard';
import DistriChart from './DistriChart';
import PassengerTrendLine from './PassengerTrendLine';
import TransactionTrend from './TransactionTrend';
import AbnormalTip from './AbnormalTip';
import styles from './index.less';
// import { formater } from '@/utils/format';

const RANGE = {
	TODAY: 'day',
	WEEK: 'week',
	MONTH: 'month',
	FREE: 'free',
	YESTERDAY: 'yesterday',
};

const queryTimeType = {
	[RANGE.TODAY]: 1,
	[RANGE.WEEK]: 2,
	[RANGE.MONTH]: 3,
};

const LAST_REFRESH_TIME = 'lastRefreshTime';

@connect(
	state => ({
		databoard: state.databoard,
	}),
	dispatch => ({
		fetchAllData: ({ searchValue, needLoading }) =>
			dispatch({
				type: 'databoard/fetchAllData',
				payload: {
					type: 1,
					searchValue,
					needLoading,
				},
			}),
		checkIsNormal: () =>
			dispatch({
				type: 'databoard/checkIsNormal',
				payload: {
					type: 1,
				},
			}),
		resetCheckState: () =>
			dispatch({
				type: 'databoard/resetCheckNormal',
			}),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class RTDataBoard extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: {
				rangeType: RANGE.TODAY,
				startQueryTime: moment()
					.startOf('day')
					.unix(),
				endQueryTime: moment()
					.endOf('day')
					.unix(),
			},
		};
	}

	async componentDidMount() {
		const { fetchAllData, checkIsNormal } = this.props;
		const { searchValue } = this.state;
		await fetchAllData({
			needLoading: true,
			searchValue,
		});
		await checkIsNormal();
		this.startAutoRefresh();
		// console.log('==========', this.props);

		// console.log('formater=', formater);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		const { resetCheckState } = this.props;
		resetCheckState();
	}

	startAutoRefresh = () => {
		const { fetchAllData } = this.props;
		clearTimeout(this.timer);
		this.timer = setTimeout(async () => {
			const { searchValue } = this.state;
			await fetchAllData({
				searchValue,
				needLoading: false,
			});
			this.startAutoRefresh();
			console.log('refreshed', searchValue);
		}, 1000 * 60 * 2);
	};

	onSearchChanged = value => {
		console.log('======searchValue====', value);
		const { fetchAllData } = this.props;
		clearTimeout(this.timer);
		const [startQueryTime, endQueryTime] = getQueryDate(value);
		this.setState({
			searchValue: {
				rangeType: value,
				startQueryTime,
				endQueryTime,
			},
		});
		fetchAllData({
			searchValue: {
				rangeType: value,
			},
			needLoading: true,
		});
		this.startAutoRefresh();
	};

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
	};

	render() {
		const {
			databoard: {
				RTPassLoading,
				RTDevicesLoading,
				totalAmountLoading,
				totalCountLoading,
				totalRateLoading,
				RTPassengerFlowLoading,
				transactionCountLoading,
				transactionRateLoading,
				regularDistriLoading,
				genderAndAgeLoading,
				hasFS,
				isSaasAuth,
			},
			goToPath,
		} = this.props;
		const loading =
			RTPassLoading ||
			RTDevicesLoading ||
			totalAmountLoading ||
			totalCountLoading ||
			totalRateLoading ||
			RTPassengerFlowLoading ||
			transactionCountLoading ||
			transactionRateLoading ||
			regularDistriLoading ||
			genderAndAgeLoading;

		const {
			searchValue: { rangeType, startQueryTime, endQueryTime },
		} = this.state;

		const {
			databoard: {
				regularList,
				RTPassengerFlowList,
				lastModifyTime,
				ageGenderList,
				RTPassengerCount,
				RTEnteringRate,
				RTDeviceCount,
				paymentTotalAmount,
				paymentTotalCount,
				transactionRate,
				amountList,
				countList,
				transactionRateList,
			},
		} = this.props;
		const timeType = queryTimeType[rangeType];
		return (
			<div className={styles['databoard-wrapper']}>
				<SearchBar
					{...{
						onSearchChanged: this.onSearchChanged,
						handleRefresh: this.handleRefresh,
						lastModifyTime,
					}}
				/>
				{hasFS && isSaasAuth ? (
					<div className={styles['charts-container']}>
						<OverviewCard
							loading={loading}
							{...{
								RTPassengerCount,
								RTEnteringRate,
								RTDeviceCount,
								paymentTotalAmount: paymentTotalAmount[rangeType],
								paymentTotalCount: paymentTotalCount[rangeType],
								transactionRate,
								timeType,
								goToPath,
								startQueryTime,
								endQueryTime,
							}}
						/>
						<Row gutter={24}>
							<Col span={12}>
								<PassengerTrendLine
									{...{
										timeType,
										RTPassengerFlowList,
										loading,
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
										loading,
									}}
								/>
							</Col>
						</Row>
						<DistriChart
							regularList={regularList}
							ageGenderList={ageGenderList}
							loading={loading}
						/>
					</div>
				) : (
					<AbnormalTip />
				)}
			</div>
		);
	}
}
export default RTDataBoard;
