import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { Card, Table, Form, Row, Col, Select, Button, DatePicker, Spin, Radio } from 'antd';
import * as CookieUtil from '@/utils/cookies';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PageEmpty from '@/components/BigIcon/PageEmpty';
import { FORM_FORMAT, SEARCH_FORM_COL } from '@/constants/form';
import TopDataCard from '../Charts/TopDataCard/TopDataCard';
import MainCustomerCard from './MainCustomerCard';
import Pie from '../Charts/Pie/Pie';
import styles from './index.less';

const GUEST_OPTIONS = {
	TITLE: [
		formatMessage({ id: 'databoard.top.passenger.title.regularRate' }),
		formatMessage({ id: 'databoard.top.passenger.title.genderRate' }),
		formatMessage({ id: 'databoard.top.passenger.title.ageRate' }),
	],
	COLOR_ARRAY: [
		['rgba(90, 151, 252, 1)', 'rgba(255, 128, 0, 1)'],
		['rgba(255, 102, 102, 1)', 'rgba(75, 122, 250, 1)'],
		[
			'rgba(75, 192, 250, 1)',
			'rgba(75, 133, 250, 1)',
			'rgba(122, 98, 245, 1)',
			'rgba(184, 122, 245, 1)',
			'rgba(255, 102, 128, 1)',
			'rgba(255, 136, 77, 1)',
		],
	],
};
const GROUP_BY = [
	[
		{ label: formatMessage({ id: 'databoard.data.regular' }), key: 'regularCount' },
		{ label: formatMessage({ id: 'databoard.data.stranger' }), key: 'newCount' },
	],
	[
		{ label: formatMessage({ id: 'databoard.chart.gender.female' }), key: 'femaleCount' },
		{ label: formatMessage({ id: 'databoard.chart.gender.male' }), key: 'maleCount' },
	],
	[
		{ label: formatMessage({ id: 'databoard.age.range.1' }), key: 'ageRangeOne' },
		{ label: formatMessage({ id: 'databoard.age.range.4' }), key: 'ageRangeTwo' },
		{ label: formatMessage({ id: 'databoard.age.range.5' }), key: 'ageRangeThree' },
		{ label: formatMessage({ id: 'databoard.age.range.6' }), key: 'ageRangeFour' },
		{ label: formatMessage({ id: 'databoard.age.range.7' }), key: 'ageRangeFive' },
		{ label: formatMessage({ id: 'databoard.age.range.8' }), key: 'ageRangeSix' },
	],
];
const { Option } = Select;
const { MonthPicker, WeekPicker } = DatePicker;
const DATE_FORMAT = 'YYYY-MM-DD';

@Form.create()
@connect(
	state => ({
		headPassenger: state.headAnglePassenger,
		loading: state.loading,
		hasCustomerData: state.topview.hasCustomerData,
		// hasOrderData: state.topview.hasOrderData,
	}),
	dispatch => ({
		getHeadPassengerByRegular: payload =>
			dispatch({ type: 'headAnglePassenger/getHeadPassengerByRegular', payload }),
		getHeadPassengerByGender: payload =>
			dispatch({ type: 'headAnglePassenger/getHeadPassengerByGender', payload }),
		getHeadShopListByRegular: payload =>
			dispatch({ type: 'headAnglePassenger/getHeadShopListByRegular', payload }),
		getHeadShopListByGender: payload =>
			dispatch({ type: 'headAnglePassenger/getHeadShopListByGender', payload }),
		getHeadShopListByAge: payload =>
			dispatch({ type: 'headAnglePassenger/getHeadShopListByAge', payload }),
		getHeadPassengerSurvey: payload =>
			dispatch({ type: 'headAnglePassenger/getHeadPassengerSurvey', payload }),
		goToPath: (pathId, urlParams = {}, anchorId) =>
			dispatch({
				type: 'menu/goToPath',
				payload: {
					pathId,
					urlParams,
					anchorId,
				},
			}),
		getPermessionPassengerFlow: () => dispatch({ type: 'topview/getPermessionPassengerFlow' }),
		// getCompanySaasInfo: () => dispatch({ type: 'topview/getCompanySaasInfo' }),
	})
)
class TopPassengerDataBoard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dateType: 1,
			startTime: 0,
			chosenCard: 0,
			currentOptions: GROUP_BY[0],
			dataSource: [],
		};
		this.columns = [
			{
				title: formatMessage({ id: 'databoard.top.rank' }),
				dataIndex: 'sortIndex',
				key: 'sortIndex',
				render: key => <span>{key}</span>,
			},
			{
				title: formatMessage({ id: 'databoard.top.shop' }),
				dataIndex: 'shopName',
				key: 'shopName',
			},
			{
				title: 'compareItem',
				dataIndex: 'compareItem',
			},
			{
				title: formatMessage({ id: 'databoard.top.operation' }),
				key: 'operation',
				render: (operation, item) => (
					<a
						onClick={() => {
							this.toggleShop(item);
						}}
					>
						{formatMessage({ id: 'databoard.top.passenger.shop.showDetail' })}
					</a>
				),
			},
		];

		this.shopListOptions = JSON.parse(localStorage.getItem('__shop_list__'));
	}

	async componentDidMount() {
		const startTime = moment()
			.subtract(1, 'day')
			.format(DATE_FORMAT);
		const { getPermessionPassengerFlow } = this.props;
		await getPermessionPassengerFlow();
		// await getCompanySaasInfo();
		this.initGetData(startTime, 1);
	}

	toggleShop = shopInfo => {
		const { shopId } = shopInfo;
		const { shopListOptions } = this;
		const hasAdmin = shopListOptions.find(shop => shop.shopId === shopId);
		// const { goToPath } = this.props;
		if (hasAdmin) {
			Modal.confirm({
				title: formatMessage({ id: 'databoard.top.toggleShop.confirm' }),
				okText: formatMessage({ id: 'list.action.view' }),
				cancelText: formatMessage({ id: 'btn.cancel' }),
				maskClosable: false,
				onOk: () => {
					CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, shopId);
					window.location.reload();
				},
			});
		} else {
			Modal.info({
				title: formatMessage({ id: 'databoard.top.toggleShop.info' }),
				okText: formatMessage({ id: 'btn.confirm' }),
				maskClosable: false,
			});
		}

		// goToPath('dashboard', {}, 'href');
	};

	initGetData = async (startTime, type = 1) => {
		const {
			getHeadPassengerByRegular,
			getHeadPassengerByGender,
			// getHeadShopListByRegular,
			getHeadPassengerSurvey,
		} = this.props;
		getHeadPassengerByGender({ startTime, type });
		getHeadPassengerByRegular({ startTime, type });
		getHeadPassengerSurvey({ startTime, type });
		this.setState(
			{ startTime, dateType: type, chosenCard: 0, currentOptions: GROUP_BY[0] },
			() => {
				this.handleChosenCardChange(0, true);
			}
		);
	};

	handleRadioChange = e => {
		this.setState({
			dateType: e.target.value,
		});

		// const startTime = moment()
		// 	.subtract(1, 'day')
		// 	.format(DATE_FORMAT);
		const STARTTIME = {
			1: moment()
				.subtract(1, 'days')
				.format('YYYY-MM-DD'),
			2: moment()
				.subtract(0, 'weeks')
				.format('YYYY-MM-DD'),
			3: moment()
				.subtract(0, 'months')
				.format('YYYY-MM-DD'),
		};
		console.log('STARTTIME', STARTTIME);

		this.initGetData(STARTTIME[e.target.value], e.target.value);
	};

	handleDateChange = (date, _, type) => {
		console.log(moment(date).format(DATE_FORMAT));
		let startTime = '';
		switch (type) {
			case 1:
				startTime = moment(date).format(DATE_FORMAT);
				break;
			case 2:
				startTime = moment(date)
					.startOf('week')
					.format(DATE_FORMAT);
				break;
			case 3:
				startTime = moment(date)
					.startOf('month')
					.format(DATE_FORMAT);
				break;
			default:
				break;
		}

		this.initGetData(startTime, type);
	};

	handleChosenCardChange = async (index, isInit) => {
		console.log('i', index);
		const {
			form: { setFieldsValue },
			getHeadShopListByGender,
			getHeadShopListByRegular,
			getHeadShopListByAge,
		} = this.props;
		const { chosenCard, startTime, dateType } = this.state;

		if (index !== chosenCard || isInit) {
			this.setState({
				chosenCard: index,
				currentOptions: GROUP_BY[index],
			});
			setFieldsValue({
				shopId: -1,
				guest: GROUP_BY[index][0].label,
			});

			switch (index) {
				case 0:
					await getHeadShopListByRegular({ startTime, type: dateType });
					this.handleTableDataSource();
					break;
				case 1:
					await getHeadShopListByGender({ startTime, type: dateType });
					this.handleTableDataSource();
					break;
				case 2:
					await getHeadShopListByAge({ startTime, type: dateType });
					this.handleTableDataSource();
					break;
				default:
					break;
			}
		}
	};

	handlePieDataSource = index => {
		const {
			headPassenger: { byFrequencyArray, byGenderArray, byAgeArray },
		} = this.props;
		const valueArray = [byFrequencyArray, byGenderArray, byAgeArray];
		const dataArray = valueArray[index].map((item, itemIndex) => ({
			name: GROUP_BY[index][itemIndex].label,
			value: item,
		}));

		return dataArray;
	};

	handleTableDataSource = () => {
		const {
			form: { getFieldsValue },
			headPassenger: { shopList },
		} = this.props;
		const { currentOptions } = this.state;

		let keyword = '';

		console.log('ss', getFieldsValue());
		const { shopId, guest } = getFieldsValue();
		let resultArray = shopList.map(item => Object.assign({}, item));

		currentOptions.forEach(item => {
			if (item.label === guest) {
				keyword = item.key;
			}
		});

		if (shopId !== -1 && shopId !== undefined)
			resultArray = resultArray.filter(item => item.shopId === shopId);

		resultArray.sort((a, b) => b[keyword] - a[keyword]);

		resultArray.forEach((item, index) => {
			item.sortIndex = index + 1;
		});

		console.log(resultArray, 'result');
		this.columns[2] = {
			title: `${guest}人数`,
			dataIndex: keyword,
		};
		this.setState({ dataSource: resultArray });
	};

	handleSearch = () => {
		this.handleTableDataSource();
	};

	handleReset = () => {
		const {
			form: { setFieldsValue },
		} = this.props;
		const { chosenCard } = this.state;

		setFieldsValue({
			shopId: -1,
			guest: GROUP_BY[chosenCard][0].label,
		});
		this.handleTableDataSource();
	};

	disabledDate = current => current && current > moment().endOf('day');

	render() {
		// todo pie外面的卡片可以切出来作为组件
		const {
			headPassenger: {
				byFrequencyArray,
				earlyByFrequencyArray,
				// byGenderArray,
				// shopList,
				passengerCount,
				earlyPassengerCount,
				// passHeadCount,
				// earlyPassHeadCount,
				mainGuestList,
			},
			form: { getFieldDecorator },
			loading,
			hasCustomerData,
		} = this.props;
		const { dateType, chosenCard, currentOptions, dataSource } = this.state;
		const todayTotalCount = passengerCount;
		const earlyTotalCount = earlyPassengerCount;
		const todayEnterPercent = passengerCount / todayTotalCount;
		const earlyEnterPercent = earlyPassengerCount / earlyTotalCount;
		const newGuest = byFrequencyArray[1];
		const earlyNewGuest = earlyByFrequencyArray[1];
		const regularGuest = byFrequencyArray[0];
		const earlyRegularGuest = earlyByFrequencyArray[0];

		return (
			<div className={styles.main}>
				<div className={styles['passengerAnalyze-title']}>
					<div>
						<Radio.Group
							buttonStyle="solid"
							value={dateType}
							onChange={this.handleRadioChange}
						>
							<Radio.Button value={1}>
								{formatMessage({ id: 'dashboard.search.yesterday' })}
							</Radio.Button>
							<Radio.Button value={2}>
								{formatMessage({ id: 'dashboard.search.week' })}
							</Radio.Button>
							<Radio.Button value={3}>
								{formatMessage({ id: 'dashboard.search.month' })}
							</Radio.Button>
						</Radio.Group>
						{dateType === 1 && (
							<DatePicker
								allowClear={false}
								disabledDate={this.disabledDate}
								onChange={(date, dateString) => {
									this.handleDateChange(date, dateString, 1);
								}}
							/>
						)}
						{dateType === 2 && (
							<WeekPicker
								allowClear={false}
								disabledDate={this.disabledDate}
								onChange={(date, dateString) => {
									this.handleDateChange(date, dateString, 2);
								}}
							/>
						)}
						{dateType === 3 && (
							<MonthPicker
								allowClear={false}
								disabledDate={this.disabledDate}
								onChange={(date, dateString) => {
									this.handleDateChange(date, dateString, 3);
								}}
							/>
						)}
					</div>
				</div>
				{!hasCustomerData && !loading.effects['topview/getPermessionPassengerFlow'] && (
					<div>
						<PageEmpty
							description={formatMessage({
								id: 'databoard.top.data.empty.history',
							})}
						/>
					</div>
				)}
				{hasCustomerData && (
					<>
						<Row gutter={24} justify="space-between" className={styles['overview-bar']}>
							<Col span={6}>
								<TopDataCard
									data={{
										label: 'totalPassengerCount',
										unit: '',
										count: todayTotalCount,
										earlyCount: earlyTotalCount,
										compareRate: true,
										toolTipText: 'toolTipText',
									}}
									timeType={dateType}
									dataType={2}
								/>
							</Col>
							<Col span={6}>
								<TopDataCard
									data={{
										label: 'enteringRate',
										unit: 'percent',
										count: todayEnterPercent,
										earlyCount: earlyEnterPercent,
										compareRate: true,
										chainRate: true,
										toolTipText: 'toolTipText',
									}}
									timeType={dateType}
									dataType={2}
								/>
							</Col>
							<Col span={6}>
								<TopDataCard
									data={{
										label: 'strangeCount',
										unit: '',
										count: newGuest,
										earlyCount: earlyNewGuest,
										compareRate: true,
										toolTipText: 'toolTipText',
									}}
									timeType={dateType}
									dataType={2}
								/>
							</Col>
							<Col span={6}>
								<TopDataCard
									data={{
										label: 'regularCount',
										unit: '',
										count: regularGuest,
										earlyCount: earlyRegularGuest,
										compareRate: true,
										toolTipText: 'toolTipText',
									}}
									timeType={dateType}
									dataType={2}
								/>
							</Col>
						</Row>
						<Card
							title={formatMessage({ id: 'databoard.passenger.distri.title' })}
							className={styles['chart-bar']}
						>
							<div className={styles.guest}>
								{GUEST_OPTIONS.TITLE.map((item, index) => (
									<div
										className={styles['pie-card']}
										key={index}
										style={
											chosenCard === index
												? { border: '1px solid  rgba(255,129,51,1)' }
												: {}
										}
										onClick={() => {
											this.handleChosenCardChange(index);
										}}
									>
										{/* <Spin spinning={loading.effects['headAnglePassenger/getHeadPassengerByRegular'] || loading.effects['headAnglePassenger/getHeadPassengerByGender'] }> */}
										<Pie
											data={this.handlePieDataSource(index)}
											chartName={`pie${index}`}
											colorArray={GUEST_OPTIONS.COLOR_ARRAY[index]}
										/>
										{/* </Spin> */}
									</div>
								))}
							</div>
							<div className={styles['search-bar']}>
								<Form layout="inline">
									<Row gutter={FORM_FORMAT.gutter}>
										<Col {...SEARCH_FORM_COL.ONE_THIRD}>
											<Form.Item label="门店">
												{getFieldDecorator('shopId', {
													initialValue: -1,
												})(
													<Select>
														<Option value={-1} key={-1}>
															{formatMessage({
																id:
																	'databoard.top.passenger.shop.toal',
															})}
														</Option>
														{this.shopListOptions.map(item => (
															<Option
																value={item.shopId}
																key={item.shopId}
															>
																{item.shopName}
															</Option>
														))}
													</Select>
												)}
											</Form.Item>
										</Col>
										<Col {...SEARCH_FORM_COL.ONE_THIRD}>
											<Form.Item
												label={formatMessage({
													id: 'databoard.top.passenger.title.customer',
												})}
											>
												{getFieldDecorator('guest', {
													initialValue: formatMessage({
														id: 'databoard.data.regular',
													}),
												})(
													<Select>
														{currentOptions.map((item, index) => (
															<Option value={item.label} key={index}>
																{item.label}
															</Option>
														))}
													</Select>
												)}
											</Form.Item>
										</Col>
										<Col {...SEARCH_FORM_COL.ONE_THIRD}>
											<Form.Item className={styles['query-item']}>
												<Button type="primary" onClick={this.handleSearch}>
													{formatMessage({ id: 'btn.query' })}
												</Button>
												<Button
													className={styles['btn-margin-left']}
													onClick={this.handleReset}
												>
													{formatMessage({ id: 'btn.reset' })}
												</Button>
											</Form.Item>
										</Col>
									</Row>
								</Form>
								<Button icon="download" type="primary">
									EXCEL
								</Button>
							</div>
							<Spin
								spinning={
									loading.effects[
										'headAnglePassenger/getHeadShopListByRegular'
									] ||
									(loading.effects[
										'headAnglePassenger/getHeadShopListByGender'
									] ||
										false) ||
									(loading.effects['headAnglePassenger/getHeadShopListByAge'] ||
										false)
								}
							>
								<Table
									dataSource={dataSource}
									columns={this.columns}
									pagination={{
										pageSize: 5,
										hideOnSinglePage: true,
									}}
								/>
							</Spin>
						</Card>
						<Card
							title={formatMessage({
								id: 'databoard.top.passenger.title.customer.major',
							})}
							className={styles['footer-cards']}
						>
							<div className={styles['footer-cards-list']}>
								{
									mainGuestList.length !== 0 ?
										mainGuestList.map((item, index) => {
											const totalPercent = Math.round(
												(item.uniqCount / todayTotalCount) * 100
											);
											const frequentPercent = Math.round(
												(item.regularUniqCount / todayTotalCount) * 100
											);
											return (
												<MainCustomerCard
													key={index}
													scene="total"
													gender={item.gender}
													num={item.uniqCount}
													totalPercent={totalPercent}
													frequentPercent={frequentPercent}
													age={item.ageRangeCode}
												/>
											);
										})
										:
										<MainCustomerCard
											scene="totalDefault"
										/>
								}
							</div>
						</Card>
					</>
				)}
			</div>
		);
	}
}

export default TopPassengerDataBoard;
