import React from 'react';
import { Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { normalizeInfo } from '@/utils/utils';
import * as RegExp from '@/constants/regexp';

const ExtraCustom = props => {
	const {
		form: { getFieldDecorator },
		productInfo: {
			extraCustomInfo = {},
		} = {},
	} = props;
	const {
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
	} = normalizeInfo(extraCustomInfo);

	const extraCustomInfoList = [
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text1' }),
				getFieldName: 'customText1',
				value: customText1,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text2' }),
				getFieldName: 'customText2',
				value: customText2,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text3' }),
				getFieldName: 'customText3',
				value: customText3,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text4' }),
				getFieldName: 'customText4',
				value: customText4,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text5' }),
				getFieldName: 'customText5',
				value: customText5,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text6' }),
				getFieldName: 'customText6',
				value: customText6,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text7' }),
				getFieldName: 'customText7',
				value: customText7,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text8' }),
				getFieldName: 'customText8',
				value: customText8,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text9' }),
				getFieldName: 'customText9',
				value: customText9,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text10' }),
				getFieldName: 'customText10',
				value: customText10,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text11' }),
				getFieldName: 'customText11',
				value: customText11,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text12' }),
				getFieldName: 'customText12',
				value: customText12,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text13' }),
				getFieldName: 'customText13',
				value: customText13,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text14' }),
				getFieldName: 'customText14',
				value: customText14,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text15' }),
				getFieldName: 'customText15',
				value: customText15,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text16' }),
				getFieldName: 'customText16',
				value: customText16,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text17' }),
				getFieldName: 'customText17',
				value: customText17,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text18' }),
				getFieldName: 'customText18',
				value: customText18,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text19' }),
				getFieldName: 'customText19',
				value: customText19,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.text20' }),
				getFieldName: 'customText20',
				value: customText20,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.integer1' }),
				type: 'InputNumber',
				precision: 0,
				getFieldName: 'customInt1',
				value: customInt1,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.integer2' }),
				type: 'InputNumber',
				precision: 0,
				getFieldName: 'customInt2',
				value: customInt2,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.integer3' }),
				type: 'InputNumber',
				precision: 0,
				getFieldName: 'customInt3',
				value: customInt3,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.integer4' }),
				type: 'InputNumber',
				precision: 0,
				getFieldName: 'customInt4',
				value: customInt4,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.integer5' }),
				type: 'InputNumber',
				precision: 0,
				getFieldName: 'customInt5',
				value: customInt5,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.decimal1' }),
				type: 'InputNumber',
				getFieldName: 'customDec1',
				value: customDec1,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.decimal2' }),
				type: 'InputNumber',
				getFieldName: 'customDec2',
				value: customDec2,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.decimal3' }),
				getFieldName: 'customDec3',
				value: customDec3,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.decimal4' }),
				type: 'InputNumber',
				getFieldName: 'customDec4',
				value: customDec4,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.decimal5' }),
				type: 'InputNumber',
				getFieldName: 'customDec5',
				value: customDec5,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.custom.others' }),
				getFieldName: 'others',
				value: others,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
	];
	return (
		<Card title={formatMessage({ id: 'basicData.product.extra.custom.title' })} bordered={false}>
			{
				extraCustomInfoList.map((itemList,index) => (
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
									if (item.min) {
										numProps.min = item.min;
									}
									if (item.max) {
										numProps.max = item.max;
									} else {
										numProps.max = 99999999;
									}
									if (item.precision || item.precision === 0) {
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

export default ExtraCustom;
