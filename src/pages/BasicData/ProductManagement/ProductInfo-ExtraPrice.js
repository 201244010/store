import React from 'react';
import { Card } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { normalizeInfo } from '@/utils/utils';
import * as styles from '@/pages/BasicData/ProductManagement/ProductManagement.less';

const ProductInfoExtraPrice = props => {
	const {
		productInfo: {
			extraPriceInfo = [],
		} = {},
	} = props;

	const {
		customPrice1 = '',
		customPrice2 = '',
		customPrice3 = '',
		customPrice1Description = '',
		customPrice2Description = '',
		customPrice3Description = '',
		promoteStartDate = '',
		promoteEndDate = '',
		memberPromoteStartDate = '',
		memberPromoteEndDate = '',
		memberPoint = '',
		promoteReason = '',
		promoteFlag = '',
	} = normalizeInfo(extraPriceInfo[0] || {});

	const extraPriceInfoList = [
		{
			label: formatMessage({ id: 'basicData.product.extra.price.customPrice1' }),
			value: customPrice1,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.customPrice1Description' }),
			value: customPrice1Description,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.customPrice2' }),
			value: customPrice2,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.customPrice2Description' }),
			value: customPrice2Description,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.customPrice3' }),
			value: customPrice3,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.customPrice3Description' }),
			value: customPrice3Description,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.promoteStartDate' }),
			value: promoteStartDate ? moment.unix(promoteStartDate).format('YYYY-MM-DD HH:mm') : '',
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.promoteEndDate' }),
			value: promoteEndDate ? moment.unix(promoteEndDate).format('YYYY-MM-DD HH:mm') : '',
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.memberPromoteStartDate' }),
			value: memberPromoteStartDate ? moment.unix(memberPromoteStartDate).format('YYYY-MM-DD HH:mm') : '',
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.memberPromoteEndDate' }),
			value: memberPromoteEndDate ? moment.unix(memberPromoteEndDate).format('YYYY-MM-DD HH:mm') : '',
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.memberPoint' }),
			value: memberPoint,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.promoteReason' }),
			value: promoteReason,
		},
		{
			label: formatMessage({ id: 'basicData.product.extra.price.promoteFlag' }),
			value: promoteFlag,
		},
	];

	return (
		<Card title={formatMessage({ id: 'basicData.product.extra.price.title' })} bordered={false}>
			<div className={styles['card-column']}>
				{extraPriceInfoList.map((item, index) => (
					<div className={styles['card-item']} key={index}>
						<span className={styles['item-label']}>{item.label}：</span>
						<span className={styles['item-content']}>{item.value}</span>
					</div>
				))}
			</div>
		</Card>
	);
};

export default ProductInfoExtraPrice;
