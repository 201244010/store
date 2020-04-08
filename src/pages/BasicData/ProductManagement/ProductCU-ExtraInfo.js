import React from 'react';
import { Card, Row, Col, Form, Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { normalizeInfo } from '@/utils/utils';
import * as RegExp from '@/constants/regexp';

const dateFormat = 'YYYY-MM-DD';

const ExtraInfo = props => {
	const {
		form: { getFieldDecorator },
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
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.packSize' }),
				type: 'InputNumber',
				min: 1,
				precision: 0,
				getFieldName: 'packSize',
				value: packSize,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.stock' }),
				type: 'InputNumber',
				getFieldName: 'stock',
				value: stock,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.safetyStock' }),
				type: 'InputNumber',
				getFieldName: 'safetyStock',
				value: safetyStock,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.dailyMeanSales' }),
				type: 'InputNumber',
				getFieldName: 'dailyMeanSales',
				value: dailyMeanSales,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.todaySalesQty' }),
				type: 'InputNumber',
				getFieldName: 'todaySalesQty',
				value: todaySalesQty,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.cumulatedSalesQty' }),
				type: 'InputNumber',
				getFieldName: 'cumulatedSalesQty',
				value: cumulatedSalesQty,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.onOrderQty' }),
				type: 'InputNumber',
				getFieldName: 'onOrderQty',
				value: onOrderQty,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.shelfQty' }),
				type: 'InputNumber',
				getFieldName: 'shelfQty',
				value: shelfQty,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.shelfCode' }),
				getFieldName: 'shelfCode',
				value: shelfCode,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.shelfTier' }),
				getFieldName: 'shelfTier',
				value: shelfTier,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.shelfColumn' }),
				getFieldName: 'shelfColumn',
				value: shelfColumn,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.displayLocation' }),
				getFieldName: 'displayLocation',
				value: displayLocation,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.supplierCode' }),
				getFieldName: 'supplierCode',
				value: supplierCode,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.supplierName' }),
				getFieldName: 'supplierName',
				value: supplierName,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.manufacturer' }),
				getFieldName: 'manufacturer',
				value: manufacturer,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.manufacturerAddress' }),
				getFieldName: 'manufacturerAddress',
				value: manufacturerAddress,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.expiryDate' }),
				type: 'DatePicker',
				getFieldName: 'expiryDate',
				value: expiryDate ? moment.unix(expiryDate) : '',
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.shelfLife' }),
				type: 'InputNumber',
				precision: 0,
				getFieldName: 'shelfLife',
				value: shelfLife,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.ingredientTable' }),
				getFieldName: 'ingredientTable',
				value: ingredientTable,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.freshItemCode' }),
				getFieldName: 'freshItemCode',
				value: freshItemCode,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.supervisedBy' }),
				getFieldName: 'supervisedBy',
				value: supervisedBy,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.supervisionHotline' }),
				getFieldName: 'supervisionHotline',
				value: supervisionHotline,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.pricingStaff' }),
				getFieldName: 'pricingStaff',
				value: pricingStaff,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel1Code' }),
				getFieldName: 'categoryLevel1Code',
				value: categoryLevel1Code,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel2Code' }),
				getFieldName: 'categoryLevel2Code',
				value: categoryLevel2Code,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel3Code' }),
				getFieldName: 'categoryLevel3Code',
				value: categoryLevel3Code,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel4Code' }),
				getFieldName: 'categoryLevel4Code',
				value: categoryLevel4Code,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel5Code' }),
				getFieldName: 'categoryLevel5Code',
				value: categoryLevel5Code,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel1Name' }),
				getFieldName: 'categoryLevel1Name',
				value: categoryLevel1Name,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel2Name' }),
				getFieldName: 'categoryLevel2Name',
				value: categoryLevel2Name,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel3Name' }),
				getFieldName: 'categoryLevel3Name',
				value: categoryLevel3Name,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel4Name' }),
				getFieldName: 'categoryLevel4Name',
				value: categoryLevel4Name,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.info.categoryLevel5Name' }),
				getFieldName: 'categoryLevel5Name',
				value: categoryLevel5Name,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
	];
	return (
		<Card title={formatMessage({ id: 'basicData.product.extra.info.title' })} bordered={false}>
			{
				extraInfoList.map((itemList, index) => (
					<Row key={index}>
						{
							itemList.map(item => {
								const itemRules = [];
								if(item.required) {
									itemRules.push({ required: true, message: item.message,});
								}
								if(item.validator) {
									itemRules.push({
										validator: (rule, value, callback) => {
											if (!value) {
												callback();
											} else if (!RegExp.productInfo.test(value)) {
												const message = `basicData.product.error.${item.getFieldName}`;
												callback(formatMessage({ id: message }));
											} else {
												callback();
											}
										},
									});
								}
								if (item.type === 'InputNumber') {
									const numProps = {};
									if (item.hasOwnProperty('max')) {
										numProps.min = item.max;
									} else {
										numProps.max = 99999999;
									}
									if (item.hasOwnProperty('precision')) {
										numProps.precision = item.precision;
									}
									return (
										<Col span={item.colSpan} key={item.label}>
											<Form.Item label={item.label}>
												{getFieldDecorator(item.getFieldName, {
													initialValue: item.value,
													validateTrigger: 'onBlur',
													rules: itemRules,
												})(
													<InputNumber
														{...numProps}
														style={{width: '100%'}}
													/>)}
											</Form.Item>
										</Col>
									);
								}
								if (item.type === 'DatePicker') {
									return (
										<Col span={item.colSpan} key={item.label}>
											<Form.Item label={item.label}>
												{getFieldDecorator(item.getFieldName, {
													initialValue: item.value,
													validateTrigger: 'onBlur',
													rules: itemRules,
												})(<DatePicker style={{width: '100%'}} format={dateFormat} />)}
											</Form.Item>
										</Col>
									);
								}
								return (
									<Col span={item.colSpan} key={item.label}>
										<Form.Item label={item.label}>
											{getFieldDecorator(item.getFieldName, {
												initialValue: item.value,
												validateTrigger: 'onBlur',
												rules: itemRules,
											})(<Input />)}
										</Form.Item>
									</Col>
								);
							})
						}
					</Row>
				))
			}
		</Card>
	);
};

export default ExtraInfo;
