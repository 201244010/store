import React, { PureComponent } from 'react';
import { Radio } from 'antd';
import { formatMessage } from 'umi/locale';

// import moment from 'moment';
import styles from './index.less';

const RANGE = {
	TODAY: 'day',
	WEEK: 'week',
	MONTH: 'month',
	FREE: 'free',
	YESTERDAY: 'yesterday'
};

class SearchBar extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			tempSelected: RANGE.YESTERDAY,
		};
	}

	handleRadioChange = (e) => {
		const {
			target: { value },
		} = e;
		const { onSearchChanged } = this.props;
		this.setState({
			tempSelected: value
		});
		onSearchChanged(value);
	}

	render() {
		const { tempSelected } = this.state;
		// const lastModifyTime = moment().format('YYYY-MM-DD hh:mm:ss');
		// const { handleRefresh } = this.props;
		return (
			<>
				{/* <h2 className={styles['dashboard-title']}>{1}</h2> */}
				<div className={styles['search-bar']}>
					<div>
						<Radio.Group
							value={tempSelected}
							buttonStyle="solid"
							onChange={this.handleRadioChange}
						>
							<Radio.Button value={RANGE.YESTERDAY}>
								{formatMessage({ id: 'databoard.search.yesterday' })}
							</Radio.Button>
							<Radio.Button value={RANGE.WEEK}>
								{formatMessage({ id: 'databoard.search.week' })}
							</Radio.Button>
							<Radio.Button value={RANGE.MONTH}>
								{formatMessage({ id: 'databoard.search.month' })}
							</Radio.Button>
						</Radio.Group>

					</div>
				</div>
			</>
		);
	}
}
export default SearchBar;