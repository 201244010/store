import React from 'react';
import styles from './index.less';

class OneList extends React.PureComponent {
	render() {
		const { name, num } = this.props;
		return (
			<div className={styles.oneList}>
				<span className={styles['oneList-name']}>{name}</span>
				<span className={styles['oneList-num']}>{num}</span>
			</div>
		);
	}
};

export default OneList;
