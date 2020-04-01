import React from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import * as styles from '@/pages/BasicData/ProductManagement/ProductManagement.less';

const ProductInfoExtraCustom = props => {
	const {
		productInfo: {
			extraCustomInfo: {
				customText1 = '',
				customText2 = '',
				customText3 = '',
				customText4 = '',
				customText5 = '',
				customText6 = '',
				customText7 = '',
				customText8 = '',
				customText9 = '',
				customText10 = '',
				customText11 = '',
				customText12 = '',
				customText13 = '',
				customText14 = '',
				customText15 = '',
				customText16 = '',
				customText17 = '',
				customText18 = '',
				customText19 = '',
				customText20 = '',
				customInt1 = '',
				customInt2 = '',
				customInt3 = '',
				customInt4 = '',
				customInt5 = '',
				customDec1 = '',
				customDec2 = '',
				customDec3 = '',
				customDec4 = '',
				customDec5 = '',
				others = '',
			} = {},
		} = {},
	} = props;

	const extraCustomInfoList = [
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text1' }),
			value: customText1,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text2' }),
			value: customText2,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text3' }),
			value: customText3,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text4' }),
			value: customText4,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text5' }),
			value: customText5,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text6' }),
			value: customText6,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text7' }),
			value: customText7,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text8' }),
			value: customText8,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text9' }),
			value: customText9,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text10' }),
			value: customText10,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text11' }),
			value: customText11,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text12' }),
			value: customText12,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text13' }),
			value: customText13,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text14' }),
			value: customText14,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text15' }),
			value: customText15,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text16' }),
			value: customText16,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text17' }),
			value: customText17,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text18' }),
			value: customText18,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text19' }),
			value: customText19,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.text20' }),
			value: customText20,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.integer1' }),
			value: customInt1,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.integer2' }),
			value: customInt2,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.integer3' }),
			value: customInt3,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.integer4' }),
			value: customInt4,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.integer5' }),
			value: customInt5,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.decimal1' }),
			value: customDec1,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.decimal2' }),
			value: customDec2,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.decimal3' }),
			value: customDec3,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.decimal4' }),
			value: customDec4,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.decimal5' }),
			value: customDec5,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.custom.others' }),
			value: others,
		},
	];

	return (
		<Card title={formatMessage({ id: 'basicData.product.extra.custom.title' })} bordered={false}>
			<div className={styles['card-column']}>
				{extraCustomInfoList.map((item, index) => (
					<div className={styles['card-item']} key={index}>
						<span className={styles['item-label']}>{item.label}：</span>
						<span className={styles['item-content']}>{item.value}</span>
					</div>
				))}
			</div>
		</Card>
	);
};

export default ProductInfoExtraCustom;
