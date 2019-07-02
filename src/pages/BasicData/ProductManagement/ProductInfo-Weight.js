import React from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './ProductManagement.less';

const ProductInfoWeight = ({ productWeight }) => {
	console.log(productWeight);

	const weighInfo = {};
	productWeight.forEach(item => (weighInfo[item.key] = { value: item.value, label: item.label }));

	// const {
	// 	pluCode,
	// 	isDiscount,
	// 	isAlterPrice,
	// 	isPrintTrace,
	// 	labelCode,
	// 	chargeUnit,
	// 	barcodeCode,
	// 	productWeigh,
	// 	tareCode,
	// 	tare,
	// 	exttextCode,
	// 	exttextNo1,
	// 	exttextNo2,
	// 	exttextNo3,
	// 	exttextNo4,
	// 	packDist,
	// 	packType,
	// 	packDays,
	// 	usebyDist,
	// 	usebyType,
	// 	usebyDays,
	// 	limitDist,
	// 	limitType,
	// 	limitDays,
	// } = weightInfo;

	return (
		<Card
			title={formatMessage({ id: 'basicData.weightProduct.detail.title' })}
			bordered={false}
		>
			<div className={styles['card-column']}>
				<div className={styles['card-item']}>
					<span className={styles['item-label']}>{formatMessage({ id: '' })}：</span>
					<span className={styles['item-content']}>{}</span>
				</div>
			</div>
		</Card>
	);
};

export default ProductInfoWeight;
