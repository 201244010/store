import React from 'react';
import { Card, Col, DatePicker, Form, Input, InputNumber, Row } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { normalizeInfo } from '@/utils/utils';
import * as RegExp from '@/constants/regexp';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

const ExtraPrice = props => {
	const {
		form: { getFieldDecorator },
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
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.customPrice1' }),
				type: 'InputNumber',
				getFieldName: 'customPrice1',
				value: customPrice1,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.customPrice2' }),
				getFieldName: 'customPrice2',
				type: 'InputNumber',
				value: customPrice2,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.customPrice3' }),
				getFieldName: 'customPrice3',
				type: 'InputNumber',
				value: customPrice3,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.customPrice1Description' }),
				getFieldName: 'customPrice1Description',
				value: customPrice1Description,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.customPrice2Description' }),
				getFieldName: 'customPrice2Description',
				value: customPrice2Description,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.customPrice3Description' }),
				getFieldName: 'customPrice3Description',
				value: customPrice3Description,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.promoteDate' }),
				type: 'RangePicker',
				getFieldName: 'promoteDate',
				value: [promoteStartDate ? moment.unix(promoteStartDate) : '', promoteEndDate ? moment.unix(promoteEndDate) : ''],
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.memberPromoteDate' }),
				type: 'RangePicker',
				getFieldName: 'memberPromoteDate',
				value: [memberPromoteStartDate ? moment.unix(memberPromoteStartDate) : '', memberPromoteEndDate ? moment.unix(memberPromoteEndDate) : ''],
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.memberPoint' }),
				type: 'InputNumber',
				getFieldName: 'memberPoint',
				value: memberPoint,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.promoteReason' }),
				getFieldName: 'promoteReason',
				value: promoteReason,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.promoteFlag' }),
				type: 'InputNumber',
				getFieldName: 'promoteFlag',
				value: promoteFlag,
				required: false,
				message: '',
				validator: true,
				field: '',
			},
		],
	];
	return (
		<Card title={formatMessage({ id: 'basicData.product.extra.price.title' })} bordered={false}>
			{
				extraPriceInfoList.map((itemList,index) => (
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
								if (item.type === 'RangePicker') {
									return (
										<Col span={item.colSpan} key={item.label}>
											<Form.Item label={item.label}>
												{getFieldDecorator(item.getFieldName, {
													initialValue: item.value,
													validateTrigger: 'onBlur',
													rules: itemRules,
												})(<RangePicker showTime={{ format: 'HH:mm' }} style={{width: '100%'}} format="YYYY-MM-DD HH:mm" />)}
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

export default ExtraPrice;
