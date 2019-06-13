import React, { Component } from 'react';
import { connect } from 'dva';
import SearchBar from './SearchBar';
import DashBoardContent from './DashBoardContent';

import styles from './DashBoard.less';

@connect(
	state => ({
		dashBoard: state.dashBoard,
	}),
	dispatch => ({
		setSearchValue: payload => dispatch({ type: 'dashBoard/setSearchValue', payload }),
	})
)
class DashBoard extends Component {
	render() {
		const {
			dashBoard: { searchValue, lastModifyTime },
			setSearchValue,
		} = this.props;

		return (
			<div className={styles['dashboard-wrapper']}>
				<SearchBar {...{ searchValue, lastModifyTime, setSearchValue }} />
				<DashBoardContent />
			</div>
		);
	}
}

export default DashBoard;
