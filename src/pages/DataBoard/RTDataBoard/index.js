import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { message, Card, Row, Col, Radio } from 'antd';
import SearchBar from './SearchBar';
import OverviewCard from './OverviewCard';
import styles from './index.less';
import DistriChart from './DistriChart';
import PassengerTrendLine from './PassengerTrendLine';
import AbnormalTip from './AbnormalTip';
// const { Meta } = Card;

const RANGE = {
	TODAY: 'day',
	WEEK: 'week',
	MONTH: 'month',
	FREE: 'free',
	YESTERDAY: 'yesterday'
};

const TAB = {
	AMOUNT: 'amount',
	COUNT: 'count',
	RATE: 'rate',
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
		checkIsNormal: () => dispatch({
			type: 'databoard/checkIsNormal',
		}),
		resetCheckState: () => dispatch({
			type: 'databoard/resetCheckNormal',
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
			currentTab: TAB.AMOUNT
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
		console.log('==========', this.props);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		const { resetCheckState } = this.props;
		resetCheckState();
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

	handleSwitchTab = (e) => {
		const {
			target: { value },
		} = e;
		this.setState({
			currentTab: value
		});
	}

	render() {
		const { databoard: {
			RTPassLoading, RTDevicesLoading,
			totalAmountLoading, totalCountLoading, totalRateLoading,
			RTPassengerFlowLoading,
			transactionCountLoading, transactionRateLoading,
			regularDistriLoading, genderAndAgeLoading,
			hasFS, isSaasAuth, tipText
		}} = this.props;
		const loading = RTPassLoading || RTDevicesLoading ||
			totalAmountLoading || totalCountLoading || totalRateLoading ||
			RTPassengerFlowLoading ||
			transactionCountLoading || transactionRateLoading ||
			regularDistriLoading || genderAndAgeLoading;
		const { currentTab } = this.state;
		const { databoard: { regularList, RTPassengerCount, RTPassengerFlowList } } = this.props;
		return(
			<div className={styles['databoard-wrapper']}>
				<SearchBar
					{...{
						onSearchChanged: this.onSearchChanged,
						handleRefresh: this.handleRefresh,
					}}
				/>
				{
					hasFS && isSaasAuth ?
						<div className={styles['charts-container']}>
							<OverviewCard loading={loading} RTPassengerCount={RTPassengerCount} />
							<Row gutter={24}>
								<Col span={12}>
									<PassengerTrendLine data={RTPassengerFlowList} loading={loading} />
								</Col>
								<Col span={12}>
									<Card
										className={styles['line-chart-wrapper']}
										title="客流趋势"
										extra={
											<Radio.Group
												value={currentTab}
												onChange={this.handleSwitchTab}
											>
												<Radio.Button className={styles['chart-tab']} value={TAB.AMOUNT}>
													销售额
												</Radio.Button>
												<Radio.Button className={styles['chart-tab']} value={TAB.COUNT}>
													交易笔数
												</Radio.Button>
												<Radio.Button className={styles['chart-tab']} value={TAB.RATE}>
													转化率
												</Radio.Button>
											</Radio.Group>}
									>经营趋势
									</Card>
								</Col>
							</Row>
							<DistriChart regularList={regularList} />
						</div>
						:
						<AbnormalTip tipText={tipText} />
				}
			</div>
		);
	}
}
export default RTDataBoard;