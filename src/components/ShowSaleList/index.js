import React from 'react';
import { formatMessage } from 'umi/locale';

import styles from './index.less';

export default class ShowSaleList extends React.Component {
	render() {
		const { skuRankList = [] } = this.props;
		return (
			<div className={styles['sale-lists']}>
				<div className={styles['lists-title']}>
					{formatMessage({ id: 'dashBoard.sku.rate' })}
				</div>
				{skuRankList.map((item, index) => (
					<SaleList
						key={index + 1}
						rank={index + 1}
						name={item.name}
						num={item.quantity}
					/>
				))}
			</div>
		);
	}
}

const SaleList = props => {
	const { rank, name, num } = props;
	return (
		<div className={styles['sale-oneList']}>
			<div className={styles['oneList-rank-name']}>
				<div className={styles['oneList-rank']}>{rank}</div>
				<div className={styles['oneList-name']}>{name}</div>
			</div>
			<div className={styles['oneList-num']}>{num}</div>
		</div>
	);
};
