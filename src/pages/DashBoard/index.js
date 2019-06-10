import React from 'react';
import SearchBar from './SearchBar';

import styles from './DashBoard.less';

const DashBoard = () => (
	<div className={styles['dashboard-wrapper']}>
		<SearchBar />
	</div>
);

export default DashBoard;
