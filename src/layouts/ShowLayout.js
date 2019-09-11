import React from 'react';
import ShowHeader from '@/pages/Show/ShowHeader';

import styles from './ShowLayout.less';

class ShowLayout extends React.Component {
	render() {
		return (
			<div
				className={styles['show-layout']}
			>
				<ShowHeader />
			</div>
		);
	}
}
export default ShowLayout;
