import React from 'react';
import { Card, Table, Form, Row, Col, Select, Button, DatePicker, Spin, Radio } from 'antd';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import PageEmpty from '@/components/BigIcon/PageEmpty';
import * as CookieUtil from '@/utils/cookies';
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
			isSelected: false,
			pageNum: 1
		};
		this.columns = [
			{
				title: formatMessage({ id: 'databoard.top.rank' }),
				dataIndex: 'sortIndex',
				key: 'sortIndex',
				width: 150,
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
				width: 150,
			},
			{
				title: formatMessage({ id: 'databoard.top.operation' }),
				key: 'operation',
				width: 150,
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
				.subtract(1, 'days')
				.startOf('week')
				.format('YYYY-MM-DD'),
			3: moment()
				.subtract(1, 'days')
				.startOf('month')
				.format('YYYY-MM-DD'),
		};

		this.setState({ isSelected: false });
		this.initGetData(STARTTIME[e.target.value], e.target.value);
	};

	handleDateChange = (date, _, type) => {
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

		this.setState({ isSelected: true });
		this.initGetData(startTime, type);
	};

	handleChosenCardChange = async (index, isInit) => {
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
				pageNum: 1
			});
			setFieldsValue({
				shopId: [],
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
		
		const { shopId, guest } = getFieldsValue();
		let resultArray = shopList.map(item => Object.assign({}, item));

		currentOptions.forEach(item => {
			if (item.label === guest) {
				keyword = item.key;
			}
		});

		if (shopId.length !== 0 && shopId !== undefined)
			resultArray = resultArray.filter(item => shopId.indexOf(item.shopId) > -1);

		resultArray.sort((a, b) => b[keyword] - a[keyword]);

		resultArray.forEach((item, index) => {
			item.sortIndex = index + 1;
		});

		this.columns[2] = {
			title: `${guest}${formatMessage({id: 'databoard.data.personCount'})}`,
			dataIndex: keyword,
			width: 150,
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
			shopId: [],
			guest: GROUP_BY[chosenCard][0].label,
		});
		this.setState({ pageNum: 1 });
		this.handleTableDataSource();
	};
	
	tooltipFormText = (index) => {
		const { dateType, isSelected } = this.state;
		let text = '';
		let dateText = '';
		
		switch (dateType) {
			case 1: dateText = formatMessage({ id: 'databoard.tooltip.lastDay' });break;
			case 2: dateText = formatMessage({ id: 'databoard.tooltip.lastWeek' });break;
			case 3: dateText = formatMessage({ id: 'databoard.tooltip.lastMonth' });break;
			default: break;
		}
		
		if(isSelected) {
			dateText = formatMessage({ id: 'databoard.tooltip.inRange'});
		};
		
		switch (index) {
			case 1:
				text = dateText + formatMessage({ id: 'databoard.tooltip.totalGuest' });
				break;
			case 2:
				text = dateText + formatMessage({ id: 'databoard.tooltip.getInShopRate' });
				break;
			case 3:
				text = dateText + formatMessage({ id: 'databoard.tooltip.newGuest' });
				break;
			case 4:
				text = dateText + formatMessage({ id: 'databoard.tooltip.regularGuest' });
				break;
			default: break;
		}
		
		return text;
	};
	
	handlePageChange = (current) => {
		this.setState({ pageNum: current });
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
				passHeadCount,
				earlyPassHeadCount,
				mainGuestList,
				uniqCountTotal,
			},
			form: { getFieldDecorator },
			loading,
			hasCustomerData,
		} = this.props;
		const { dateType, chosenCard, currentOptions, dataSource, pageNum } = this.state;
		const todayTotalCount = passengerCount + passHeadCount;
		const earlyTotalCount = earlyPassengerCount + earlyPassHeadCount;
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
								{formatMessage({ id: 'databoard.search.yesterday' })}
							</Radio.Button>
							<Radio.Button value={2}>
								{formatMessage({ id: 'databoard.search.week' })}
							</Radio.Button>
							<Radio.Button value={3}>
								{formatMessage({ id: 'databoard.search.month' })}
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
										toolTipText: this.tooltipFormText(1),
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
										toolTipText: this.tooltipFormText(2),
										chainRate: true,
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
										toolTipText: this.tooltipFormText(3),
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
										toolTipText: this.tooltipFormText(4),
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
										key={index}
										className={styles['chart-bar-card']}
										onClick={() => {
											this.handleChosenCardChange(index);
										}}
									>
										<div
											style={chosenCard === index ? { color: 'rgba(255, 129, 51, 1)'} : {}}
											className={styles['pie-title']}
										>
											{item}
										</div>
										<div
											className={styles['pie-card']}
											style={
												chosenCard === index
													? { border: '1px solid  rgba(255,129,51,1)' }
													: {}
											}
										>
											{/* <Spin spinning={loading.effects['headAnglePassenger/getHeadPassengerByRegular'] || loading.effects['headAnglePassenger/getHeadPassengerByGender'] }> */}
											<Pie
												data={this.handlePieDataSource(index)}
												chartName={`pie${index}`}
												colorArray={GUEST_OPTIONS.COLOR_ARRAY[index]}
											/>
											{/* </Spin> */}
										</div>
									</div>
								))}
							</div>
							<div className={styles['search-bar']}>
								<Form layout="inline">
									<Row gutter={FORM_FORMAT.gutter}>
										<Col {...SEARCH_FORM_COL.ONE_THIRD}>
											<Form.Item label={formatMessage({ id: 'databoard.top.shop' })}>
												{getFieldDecorator('shopId', {
													initialValue: [],
												})(
													<Select mode="multiple">
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

								{/* <Button icon="download" type="primary"> */}
								{/* EXCEL */}
								{/* </Button> */}

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
										current: pageNum,
										onChange: this.handlePageChange
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
												(item.uniqCount / uniqCountTotal) * 100
											);
											const frequentPercent = Math.round(
												(item.regularUniqCount / item.uniqCount) * 100
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
