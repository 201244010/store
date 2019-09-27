import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card } from 'antd';
import DataEmpty from '@/components/BigIcon/DataEmpty';
import SearchBar from './SearchBar';
import PassengerData from './PassengerData';
import PassengerChart from './PassengerChart';
import PassengerInfo from './PassengerInfo';

import styles from './passengerAnalyze.less';

@connect(
	({ passengerAnalyze }) => ({
		hasData: passengerAnalyze.hasData,
	}),
	dispatch => ({
		clearSearch: () => dispatch({ type: 'passengerAnalyze/clearSearch' }),
		refreshPage: () => dispatch({ type: 'passengerAnalyze/refreshPage' }),
	})
)
class PassengerAnalyze extends PureComponent {
	componentDidMount() {
		// TODO 云端接口好之后恢复
		this.refreshPage();
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
		const { hasData } = this.props;

		return (
			<div className={styles['passengerAnalyze-wrapper']}>
				<SearchBar onSearchChange={this.refreshPage} />

				<div className={styles['display-content']}>
					{hasData ? (
						<>
							<PassengerData />
							<PassengerChart />
							<PassengerInfo />
						</>
					) : (
						<Card bordered={false}>
							<DataEmpty
								dataEmpty={formatMessage({ id: 'passengerAnalyze.analyzing' })}
							/>
						</Card>
					)}
				</div>
			</div>
		);
	}
}

export default PassengerAnalyze;
