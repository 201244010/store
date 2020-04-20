import React from 'react';
import { Card } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { normalizeInfo } from '@/utils/utils';
import * as styles from '@/pages/BasicData/ProductManagement/ProductManagement.less';

const ProductInfoExtraInfo = props => {
	const {
		productInfo: {
			extraInfo = [],
		} = {},
	} = props;

	const {
		packSize = '',
		stock = '',
		safetyStock = '',
		dailyMeanSales = '',
		todaySalesQty = '',
		cumulatedSalesQty = '',
		onOrderQty = '',
		shelfQty = '',
		shelfCode = '',
		shelfTier = '',
		shelfColumn = '',
		displayLocation = '',
		supplierCode = '',
		supplierName = '',
		manufacturer = '',
		manufacturerAddress = '',
		expiryDate = '',
		expireTime = '',
		shelfLife = '',
		ingredientTable = '',
		freshItemCode = '',
		supervisedBy = '',
		supervisionHotline = '',
		pricingStaff = '',
		categoryLevel1Code = '',
		categoryLevel2Code = '',
		categoryLevel3Code = '',
		categoryLevel4Code = '',
		categoryLevel5Code = '',
		categoryLevel1Name = '',
		categoryLevel2Name = '',
		categoryLevel3Name = '',
		categoryLevel4Name = '',
		categoryLevel5Name = '',
	} = normalizeInfo(extraInfo[0] || {});

	const extraInfoList = [
		{
			label: formatMessage({ id: 'basicData.product.extra.info.packSize' }),
			value: packSize,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.stock' }),
			value: stock,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.safetyStock' }),
			value: safetyStock,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.dailyMeanSales' }),
			value: dailyMeanSales,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.todaySalesQty' }),
			value: todaySalesQty,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.cumulatedSalesQty' }),
			value: cumulatedSalesQty,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.onOrderQty' }),
			value: onOrderQty,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.shelfQty' }),
			value: shelfQty,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.shelfCode' }),
			value: shelfCode,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.shelfTier' }),
			value: shelfTier,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.shelfColumn' }),
			value: shelfColumn,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.displayLocation' }),
			value: displayLocation,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.supplierCode' }),
			value: supplierCode,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.supplierName' }),
			value: supplierName,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.manufacturer' }),
			value: manufacturer,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.manufacturerAddress' }),
			value: manufacturerAddress,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.expiryDate' }),
			value: expiryDate ? moment.unix(expiryDate).format('YYYY-MM-DD') : '',
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.expireTime' }),
			value: expireTime,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.shelfLife' }),
			value: shelfLife,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.ingredientTable' }),
			value: ingredientTable,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.freshItemCode' }),
			value: freshItemCode,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.supervisedBy' }),
			value: supervisedBy,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.supervisionHotline' }),
			value: supervisionHotline,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.pricingStaff' }),
			value: pricingStaff,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel1Code' }),
			value: categoryLevel1Code,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel1Name' }),
			value: categoryLevel1Name,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel2Code' }),
			value: categoryLevel2Code,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel2Name' }),
			value: categoryLevel2Name,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel3Code' }),
			value: categoryLevel3Code,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel3Name' }),
			value: categoryLevel3Name,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel4Code' }),
			value: categoryLevel4Code,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel4Name' }),
			value: categoryLevel4Name,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel5Code' }),
			value: categoryLevel5Code,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel5Name' }),
			value: categoryLevel5Name,
		},
	];

	return (
		<Card title={formatMessage({ id: 'basicData.product.extra.info.title' })} bordered={false}>
			<div className={styles['card-column']}>
				{extraInfoList.map((item, index) => (
					<div className={styles['card-item']} key={index}>
						<span className={styles['item-label']}>{item.label}：</span>
						<span className={styles['item-content']}>{item.value}</span>
					</div>
				))}
			</div>
		</Card>
	);
};

export default ProductInfoExtraInfo;
