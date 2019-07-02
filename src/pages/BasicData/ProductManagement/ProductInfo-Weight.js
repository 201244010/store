import React from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './ProductManagement.less';
import { chargeUnitMap, dateMap } from './constants';

const MESSAGE_PREFIX = {
	CHARGE_UNIT: 'basicData.weightProduct.weight.price',
	DATE: 'basicData.weightProduct.date.type',
};

const ProductInfoWeight = ({ productWeight = {} }) => {
	const weighInfo = {};
	productWeight.forEach(item => (weighInfo[item.key] = { value: item.value, label: item.label }));

	const {
		pluCode,
		isDiscount,
		isAlterPrice,
		isPrintTraceCode,
		labelCode,
		chargeUnit,
		barcodeCode,
		productWeigh,
		tareCode,
		tare,
		exttextCode,
		exttextNo1,
		exttextNo2,
		exttextNo3,
		exttextNo4,
		packDist,
		packType,
		packDays,
		usebyDist,
		usebyType,
		usebyDays,
		limitDist,
		limitType,
		limitDays,
	} = weighInfo;

	return (
		<Card
			title={formatMessage({ id: 'basicData.weightProduct.detail.title' })}
			bordered={false}
		>
			<div className={styles['card-column']}>
				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: pluCode.label })}：
					</span>
					<span className={styles['item-content']}>{pluCode.value}</span>
				</div>

				<div className={`${styles['card-item']}`}>
					<span className={styles['item-label']}>
						{formatMessage({ id: isDiscount.label })}：
					</span>
					<span className={styles['item-content']}>
						{isDiscount.value === '0'
							? formatMessage({ id: 'text.no' })
							: formatMessage({ id: 'text.yes' })}
					</span>

					<span className={styles['item-label']}>
						{formatMessage({ id: isAlterPrice.label })}：
					</span>
					<span className={styles['item-content']}>
						{isAlterPrice.value === '0'
							? formatMessage({ id: 'text.no' })
							: formatMessage({ id: 'text.yes' })}
					</span>

					<span className={styles['item-label']}>
						{formatMessage({ id: isPrintTraceCode.label })}：
					</span>
					<span className={styles['item-content']}>
						{isPrintTraceCode.value === '0'
							? formatMessage({ id: 'text.no' })
							: formatMessage({ id: 'text.yes' })}
					</span>
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: labelCode.label })}：
					</span>
					<span className={styles['item-content']}>{labelCode.value}</span>
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: barcodeCode.label })}：
					</span>
					<span className={styles['item-content']}>{barcodeCode.value}</span>
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: chargeUnit.label })}：
					</span>
					{chargeUnit.value && (
						<span className={styles['item-content']}>
							{formatMessage({
								id: `${MESSAGE_PREFIX.CHARGE_UNIT}.${
									chargeUnitMap[chargeUnit.value]
								}`,
							})}
						</span>
					)}
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: productWeigh.label })}：
					</span>
					<span className={styles['item-content']}>
						{parseFloat(productWeigh.value).toFixed(3)}
					</span>
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: tareCode.label })}：
					</span>
					<span className={styles['item-content']}>{tareCode.value}</span>
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: tare.label })}：
					</span>
					<span className={styles['item-content']}>
						{parseFloat(tare.value).toFixed(3)}
					</span>
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: packDist.label })}：
					</span>
					<span className={styles['item-content']}>
						{packDist.value === '0'
							? formatMessage({ id: 'text.no' })
							: formatMessage({ id: 'text.yes' })}
					</span>

					<span className={styles['item-label']}>
						{formatMessage({ id: packType.label })}：
					</span>
					{packType.value && (
						<span className={styles['item-content']}>
							{formatMessage({
								id: `${MESSAGE_PREFIX.DATE}.${dateMap[packType.value]}`,
							})}
						</span>
					)}
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: packDays.label })}：
					</span>
					<span className={styles['item-content']}>
						{packDays.value}
						{packType.value === '2' && packDays.value
							? formatMessage({ id: 'basicData.product.expire_time.day' })
							: ''}
					</span>
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: usebyDist.label })}：
					</span>
					<span className={styles['item-content']}>
						{usebyDist.value === '0'
							? formatMessage({ id: 'text.no' })
							: formatMessage({ id: 'text.yes' })}
					</span>

					<span className={styles['item-label']}>
						{formatMessage({ id: usebyType.label })}：
					</span>
					{usebyType.value && (
						<span className={styles['item-content']}>
							{formatMessage({
								id: `${MESSAGE_PREFIX.DATE}.${dateMap[usebyType.value]}`,
							})}
						</span>
					)}
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: usebyDays.label })}：
					</span>
					<span className={styles['item-content']}>
						{usebyDays.value}
						{usebyType.value === '2' && usebyDays.value
							? formatMessage({ id: 'basicData.product.expire_time.day' })
							: ''}
					</span>
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: limitDist.label })}：
					</span>
					<span className={styles['item-content']}>
						{limitDist.value === '0'
							? formatMessage({ id: 'text.no' })
							: formatMessage({ id: 'text.yes' })}
					</span>

					<span className={styles['item-label']}>
						{formatMessage({ id: limitType.label })}：
					</span>
					{limitType.value && (
						<span className={styles['item-content']}>
							{formatMessage({
								id: `${MESSAGE_PREFIX.DATE}.${dateMap[limitType.value]}`,
							})}
						</span>
					)}
				</div>

				<div className={styles['card-item']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: limitDays.label })}：
					</span>
					<span className={styles['item-content']}>
						{limitDays.value}
						{limitType.value === '2' && limitDays.value
							? formatMessage({ id: 'basicData.product.expire_time.day' })
							: ''}
					</span>
				</div>

				<div className={styles['card-whole']}>
					<span className={styles['item-label']}>
						{formatMessage({ id: exttextCode.label })}：
					</span>
					<span className={styles['item-content']}>{exttextCode.value}</span>
				</div>

				{exttextNo1.value && (
					<div className={styles['card-whole']}>
						<span className={styles['item-label']}>
							{formatMessage({ id: 'basicData.weightProduct.extraText' })}：
						</span>
						<span className={styles['item-content']}>{exttextNo1.value}</span>
					</div>
				)}

				{exttextNo2.value && (
					<div className={styles['card-whole']}>
						<span className={styles['item-label']}>
							{formatMessage({ id: 'basicData.weightProduct.extraText' })}：
						</span>
						<span className={styles['item-content']}>{exttextNo2.value}</span>
					</div>
				)}

				{exttextNo3.value && (
					<div className={styles['card-whole']}>
						<span className={styles['item-label']}>
							{formatMessage({ id: 'basicData.weightProduct.extraText' })}：
						</span>
						<span className={styles['item-content']}>{exttextNo3.value}</span>
					</div>
				)}

				{exttextNo4.value && (
					<div className={styles['card-whole']}>
						<span className={styles['item-label']}>
							{formatMessage({ id: 'basicData.weightProduct.extraText' })}：
						</span>
						<span className={styles['item-content']}>{exttextNo4.value}</span>
					</div>
				)}
			</div>
		</Card>
	);
};

export default ProductInfoWeight;
