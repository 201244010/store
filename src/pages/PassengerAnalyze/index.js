import React, { PureComponent } from 'react';
import { connect } from 'dva';
import SearchBar from './SearchBar';
import PassengerData from './PassengerData';
import PassengerChart from './PassengerChart';
import PassengerInfo from './PassengerInfo';

import styles from './passengerAnalyze.less';

@connect(
	null,
	dispatch => ({
		clearSearch: () => dispatch({ type: 'clearSearch' }),
		refreshPage: () => dispatch({ type: 'passengerAnalyze/refreshPage' }),
	})
)
class PassengerAnalyze extends PureComponent {
	componentDidMount() {
		// TODO 云端接口好之后恢复
		const { refreshPage } = this.props;
		refreshPage();
	}

	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearSearch();
	}

	refreshPage = () => {
		const { refreshPage } = this.props;
		refreshPage();
	};

	render() {
		return (
			<div className={styles['passengerAnalyze-wrapper']}>
				<SearchBar onSearchChange={this.refreshPage} />

				<div className={styles['display-content']}>
					<PassengerData />
					<PassengerChart />
					<PassengerInfo />
				</div>
			</div>
		);
	}
}

export default PassengerAnalyze;
