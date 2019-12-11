import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Radio, DatePicker, Icon, message } from 'antd';
import { getQueryDate } from '@/models/dashBoard';
import { DASHBOARD } from './constants';

import styles from './DashBoard.less';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

const Refresh = () => (
	<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
		<g id="Icon/Replay" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
			<rect id="Rectangle" x="0" y="0" width="24" height="24" />
			<path
				d="M19.2049833,10.0920145 C19.2049833,8.14629935 18.4560735,6.31828799 17.0937707,4.94427682 C15.7338455,3.56786353 13.9245743,2.81119654 11.998806,2.81119654 C10.0730378,2.81119654 8.2637666,3.56786353 6.90384135,4.94427682 C5.54153861,6.3206901 4.79262873,8.14870147 4.79262873,10.0920145 C4.79262873,12.0353275 5.54153861,13.8657409 6.90384135,15.2397521 C8.26614409,16.6161654 10.0754153,17.3728324 11.998806,17.3728324 C12.0059385,17.3728324 10.446304,15.2998051 10.446304,15.2998051 C10.1443625,14.9010536 10.2180648,14.3317517 10.6127284,14.0290849 C10.7767753,13.9017727 10.9669746,13.8417198 11.157174,13.8417198 C11.4258305,13.8417198 11.6944871,13.9642278 11.8704215,14.1972332 L14.6925041,17.918113 C14.9944456,18.3168645 14.9207433,18.8861664 14.5260797,19.1888332 L10.7862853,22.0857868 C10.3916217,22.3908557 9.82815613,22.3139879 9.52859217,21.9176386 C9.22665073,21.5188871 9.30035297,20.9495852 9.69501659,20.6469184 L11.5898775,19.1792247 C10.5200062,19.1311824 9.48104234,18.8957748 8.49676078,18.4730022 C7.42451203,18.0141977 6.4616279,17.3584197 5.63663828,16.5248849 C4.80927117,15.6889481 4.16021594,14.7160905 3.70849252,13.6351377 C3.23774917,12.5133488 3,11.3218986 3,10.0944166 C3,8.86693458 3.23774917,7.67548433 3.70849252,6.55369549 C4.16259344,5.47034053 4.81164867,4.49748298 5.63663828,3.66394823 C6.46400539,2.82801136 7.42688952,2.17223331 8.49676078,1.71583099 C9.6070494,1.24021174 10.7862853,1 12.0011835,1 C13.2160818,1 14.3953177,1.24021174 15.5056063,1.71583099 C16.5754775,2.16983119 17.5383617,2.82560925 18.3633513,3.65914399 C19.1907184,4.49508086 19.8397736,5.46793842 20.291497,6.54889126 C20.7622404,7.6706801 20.9999896,8.86213034 20.9999896,10.0896123 C21.0023671,10.5916549 20.5981935,11.0000149 20.1036752,11.0000149 C19.6067794,11.0000149 19.2049833,10.594057 19.2049833,10.0920145 Z"
				id="Replay"
				fill="#A1A7B3"
				transform="translate(12.000000, 11.636364) scale(1, -1) translate(-12.000000, -11.636364) "
			/>
		</g>
	</svg>
);

@connect(
	({ dashboard }) => ({
		searchValue: dashboard.searchValue,
		lastModifyTime: dashboard.lastModifyTime,
	}),
	dispatch => ({
		getShopIdFromStorage: () => dispatch({ type: 'global/getShopIdFromStorage' }),
		getShopListFromStorage: () => dispatch({ type: 'global/getShopListFromStorage' }),
		setSearchValue: payload => dispatch({ type: 'dashboard/setSearchValue', payload }),
		clearSearch: () => dispatch({ type: 'dashboard/clearSearch' }),
	})
)
class SearchBar extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			tempSelected: RANGE.TODAY,
			currentShopName: null,
		};
	}

	async componentDidMount() {
		const { getShopIdFromStorage, getShopListFromStorage } = this.props;
		const shopList = await getShopListFromStorage();
		const shopId = await getShopIdFromStorage();

		const currentShop = shopList.find(shop => shop.shopId === shopId) || {};
		this.setState({
			currentShopName: currentShop.shopName || null,
		});
	}

	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearSearch();
	}

	disabledDate = current => current && current > moment().endOf('day');

	handleRadioChange = e => {
		const { setSearchValue, onSearchChanged } = this.props;
		const {
			target: { value },
		} = e;

		this.setState({
			tempSelected: value,
		});

		const [startQueryTime, endQueryTime] = getQueryDate(value);

		setSearchValue({
			rangeType: value,
			timeRangeStart: null,
			timeRangeEnd: null,
			startQueryTime,
			endQueryTime,
		});
		onSearchChanged();
	};

	handleTimeRangeChange = dates => {
		const { setSearchValue, onSearchChanged } = this.props;
		const [startTime, endTime] = dates;

		if (
			moment(endTime)
				.subtract(60, 'days')
				.isAfter(startTime)
		) {
			message.error(formatMessage({ id: 'dashboard.search.range.overflow' }));
			return;
		}

		this.setState({
			tempSelected: RANGE.FREE,
		});

		setSearchValue({
			rangeType: RANGE.FREE,
			timeRangeStart: startTime,
			timeRangeEnd: endTime,
			startQueryTime: moment(startTime).unix(),
			endQueryTime: moment(endTime).unix(),
		});

		if (startTime && endTime) {
			onSearchChanged();
		}
	};

	render() {
		const { tempSelected, currentShopName } = this.state;
		const {
			searchValue: { timeRangeStart, timeRangeEnd } = {},
			lastModifyTime,
			doHandRefresh,
		} = this.props;

		return (
			<>
				<h2 className={styles['dashboard-title']}>{currentShopName}</h2>
				<div className={styles['search-bar']}>
					<div>
						<Radio.Group
							value={tempSelected}
							buttonStyle="solid"
							onChange={this.handleRadioChange}
						>
							<Radio.Button value={RANGE.TODAY}>
								{formatMessage({ id: 'dashboard.search.today' })}
							</Radio.Button>
							<Radio.Button value={RANGE.WEEK}>
								{formatMessage({ id: 'dashboard.search.week' })}
							</Radio.Button>
							<Radio.Button value={RANGE.MONTH}>
								{formatMessage({ id: 'dashboard.search.month' })}
							</Radio.Button>
						</Radio.Group>

						<DatePicker.RangePicker
							placeholder={[
								formatMessage({ id: 'dashboard.search.range.start' }),
								formatMessage({ id: 'dashboard.search.range.end' }),
							]}
							value={[timeRangeStart, timeRangeEnd]}
							style={{ marginLeft: '24px' }}
							disabledDate={this.disabledDate}
							onChange={this.handleTimeRangeChange}
						/>
					</div>

					<div className={styles['right-content']}>
						<span>
							{formatMessage({ id: 'dashboard.last.modify.date' })}: {lastModifyTime}
						</span>
						<div className={styles['icon-wrapper']} onClick={doHandRefresh}>
							<Icon component={Refresh} style={{ fontSize: '24px' }} />
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default SearchBar;
