import React, { Component } from 'react';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { Radio, DatePicker, Icon, message } from 'antd';
import { DASHBOARD } from './constants';

import styles from './DashBoard.less';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

class SearchBar extends Component {
	disabledDate = current => current && current > moment().endOf('day');

	handleRadioChange = async e => {
		const { setSearchValue, fetchAllData } = this.props;
		const {
			target: { value },
		} = e;

		await setSearchValue({
			rangeType: value,
			timeRangeStart: null,
			timeRangeEnd: null,
		});
		fetchAllData({ needLoading: true });
	};

	handleTimeRangeChange = async dates => {
		const { setSearchValue, fetchAllData } = this.props;
		const [startTime, endTime] = dates;

		if (endTime.subtract(60, 'days').isAfter(startTime)) {
			message.error(formatMessage({ id: 'dashBoard.search.range.overflow' }));
			return;
		}

		await setSearchValue({
			rangeType: RANGE.FREE,
			timeRangeStart: startTime,
			timeRangeEnd: endTime,
		});
		fetchAllData({ needLoading: true });
	};

	render() {
		const {
			searchValue: { rangeType, timeRangeStart, timeRangeEnd },
			lastModifyTime,
			doHandRefresh,
		} = this.props;

		return (
			<div className={styles['search-bar']}>
				<div>
					<Radio.Group
						value={rangeType}
						buttonStyle="solid"
						onChange={this.handleRadioChange}
					>
						<Radio.Button value={RANGE.TODAY}>
							{formatMessage({ id: 'dashBoard.search.today' })}
						</Radio.Button>
						<Radio.Button value={RANGE.WEEK}>
							{formatMessage({ id: 'dashBoard.search.week' })}
						</Radio.Button>
						<Radio.Button value={RANGE.MONTH}>
							{formatMessage({ id: 'dashBoard.search.month' })}
						</Radio.Button>
					</Radio.Group>

					<DatePicker.RangePicker
						placeholder={[
							formatMessage({ id: 'dashBoard.search.range.start' }),
							formatMessage({ id: 'dashBoard.search.range.end' }),
						]}
						value={[timeRangeStart, timeRangeEnd]}
						style={{ marginLeft: '24px' }}
						disabledDate={this.disabledDate}
						onChange={this.handleTimeRangeChange}
					/>
				</div>

				<div className={styles['right-content']}>
					<span>
						{formatMessage({ id: 'dashBoard.last.modify.date' })}: {lastModifyTime}
					</span>
					<div className={styles['icon-wrapper']} onClick={doHandRefresh}>
						<Icon type="redo" style={{ fontSize: '24px' }} />
					</div>
				</div>
			</div>
		);
	}
}

export default SearchBar;
