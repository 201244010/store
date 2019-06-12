import React, { Component } from 'react';
import { connect } from 'dva';
import SearchBar from './SearchBar';
import DashBoardContent from './DashBoardContent';

import styles from './DashBoard.less';

@connect(() => null, () => null)
class DashBoard extends Component {
	render() {
		return (
			<div className={styles['dashboard-wrapper']}>
				<SearchBar />
				<DashBoardContent />
			</div>
		);
	}
}

export default DashBoard;
