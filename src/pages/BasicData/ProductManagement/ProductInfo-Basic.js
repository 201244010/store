import React from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { PRODUCT_TYPE } from '@/constants/mapping';
import styles from './ProductManagement.less';

const ProductInfoBasic = props => {
	const { productBasic = [], productBasicExtra = [] } = props;
	return (
		<Card title={formatMessage({ id: 'basicData.product.detail.title' })} bordered={false}>
			<div className={styles['card-column']}>
				{productBasic.map(product => (
					<div className={styles['card-item']} key={product.key}>
						<span className={styles['item-label']}>
							{formatMessage({ id: product.label })}：
						</span>
						<span className={styles['item-content']}>
							{['price', 'promotePrice', 'memberPrice'].includes(product.key) && (
								<span>
									{parseInt(product.value, 10) < 0
										? ''
										: parseFloat(product.value).toFixed(2)}
								</span>
							)}
							{!['expireTime', 'type', 'price', 'promotePrice', 'memberPrice'].includes(product.key) && product.value}
							{product.key === 'expireTime' &&
								(product.value < 0 ? (
									''
								) : (
									<span>
										{product.value}{' '}
										{formatMessage({ id: 'basicData.product.expire_time.day' })}
									</span>
								))}
							{product.key === 'type' && (
								<span>
									{formatMessage({
										id:
											PRODUCT_TYPE[`${product.value}`] ||
											'basicData.product.type.normal',
									})}
								</span>
							)}
						</span>
					</div>
				))}
			</div>
			<div className={styles['card-column']}>
				{productBasicExtra.map((extra, index) => (
					<div className={styles['card-item']} key={index}>
						<span className={styles['item-label']}>{extra.name}：</span>
						<span className={styles['item-content']}>{extra.context}</span>
					</div>
				))}
			</div>
		</Card>
	);
};

export default ProductInfoBasic;
