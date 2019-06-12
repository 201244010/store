import React, { Component } from 'react';
import CardBar from './CardBar';
import ContentChart from './ContentChart';
import FooterChart from './FooterChart';

import styles from './DashBoard.less';

class DashBoardContent extends Component {
	render() {
		return (
			<div className={styles['display-content']}>
				<CardBar />
				<ContentChart />
				<FooterChart />
			</div>
		);
	}
}

export default DashBoardContent;