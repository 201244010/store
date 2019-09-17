import React from 'react';
import styles from './index.less';

class SaleList extends React.PureComponent {
	render() {
		const { rank, name, num } = this.props;
		return (
			<div className={styles['sale-oneList']}>
				<div className={styles['oneList-rank-name']}>
					<div className={styles['oneList-rank']}>{rank}</div>
					<div className={styles['oneList-name']}>{name}</div>
				</div>
				<div className={styles['oneList-num']}>{num}</div>
			</div>
		);
	}	
};
export default SaleList;
