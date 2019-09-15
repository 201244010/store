import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import SaleList from './saleList';

import styles from './index.less';

@connect(
	state => ({
		showInfo: state.showInfo,
	}),
)
class ShowSaleList extends React.Component {
	render() {
		const { time } = this.props;
		const {
			showInfo: {
				[time]: {
					skuRankList = [],
				} = {},
			},
		} = this.props;

		return (
			<div className={styles['sale-lists']}>
				<div className={styles['lists-title']}>
					{formatMessage({ id: 'dashboard.sku.rate' })}
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
export default ShowSaleList;
