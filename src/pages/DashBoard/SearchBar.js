import React, { Component } from 'react';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { Radio, DatePicker, Icon } from 'antd';

import styles from './DashBoard.less';

class SearchBar extends Component {
	refreshData = () => {
		// TODO 重新获取数据的逻辑
		console.log('todo refresh');
	};

	render() {
		const { lastModifyDate = moment().format('YYYY-MM-DD HH:MM:SS') } = this.props;

		return (
			<div className={styles['search-bar']}>
				<div>
					<Radio.Group defaultValue={0} buttonStyle="solid">
						<Radio.Button value={0}>{formatMessage({ id: 'dashBoard.search.today' })}</Radio.Button>
						<Radio.Button value={1}>{formatMessage({ id: 'dashBoard.search.week' })}</Radio.Button>
						<Radio.Button value={2}>{formatMessage({ id: 'dashBoard.search.month' })}</Radio.Button>
					</Radio.Group>
					<DatePicker.RangePicker
						placeholder={[formatMessage({ id: 'dashBoard.search.range.start' }), formatMessage({ id: 'dashBoard.search.range.end' })]}
						style={{ marginLeft: '24px' }}
					/>
				</div>

				<div className={styles['right-content']}>
					<span>{formatMessage({ id: 'dashBoard.last.modify.date' })}: {lastModifyDate}</span>
					<div className={styles['icon-wrapper']} onClick={this.refreshData}>
						<Icon type="redo" style={{ fontSize: '24px' }} />
					</div>
				</div>
			</div>);
	}
}

export default SearchBar;