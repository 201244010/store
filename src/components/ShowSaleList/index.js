import React from 'react';

import styles from './index.less';

export default class ShowSaleList extends React.Component {
	render() {
		const { skuRankList = [] } = this.props;
		return (
			<div className={styles.saleLists}>
				<div className={styles.saleListsTitle}>商品销量排行</div>
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
	const {rank, name, num} = props;
	return (
		<div className={styles.saleList}>
			<div className={styles.saleListRankName}>
				<div className={styles.saleListRank}>{rank}</div>
				<div className={styles.saleListName}>{name}</div>
			</div>
			<div className={styles.saleListNum}>{num}</div>
		</div>
	);
};
