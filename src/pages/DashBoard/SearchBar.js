import React, { Component } from 'react';

import styles from './DashBoard.less';

class SearchBar extends Component {
	componentDidMount() {
		console.log(1234);
	}

	render() {
		return <div className={styles['search-bar']}>SearchBar</div>;
	}
}

export default SearchBar;