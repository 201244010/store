import React, { PureComponent } from 'react';
import { Card } from 'antd';
import SearchBar from './SearchBar';
import PassengerData from './PassengerData';
import PassengerChart from './PassengerChart';
import PassengerInfo from './PassengerInfo';

class PassengerAnalyze extends PureComponent {
	render() {
		return (
			<Card bordered={false}>
				<SearchBar />
				<PassengerData />
				<PassengerChart />
				<PassengerInfo />
			</Card>
		);
	}
}

export default PassengerAnalyze;
