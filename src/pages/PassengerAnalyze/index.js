import React, { PureComponent } from 'react';
import { connect } from 'dva';
import SearchBar from './SearchBar';
import PassengerData from './PassengerData';
import PassengerChart from './PassengerChart';
import PassengerInfo from './PassengerInfo';

import styles from './passengerAnalyze.less';

@connect(
	null,
	dispatch => ({ clearSearch: () => dispatch({ type: 'clearSearch' }) })
)
class PassengerAnalyze extends PureComponent {
	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearSearch();
	}

	render() {
		return (
			<div className={styles['passengerAnalyze-wrapper']}>
				<SearchBar />
				<PassengerData />
				<PassengerChart />
				<PassengerInfo />
			</div>
		);
	}
}

export default PassengerAnalyze;
