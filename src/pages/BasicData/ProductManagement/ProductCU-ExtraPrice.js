import React from 'react';
import { Card, Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { customValidate } from '@/utils/customValidate';

const ExtraPrice = props => {
	const {
		form: { getFieldDecorator },
		productInfo: {
			extraPriceInfo: {
				customPrice1 = '',
				customPrice2 = '',
				customPrice3 = '',
				customPrice1Description = '',
				customPrice2Description = '',
				customPrice3Description = '',
				promoteStartDate = '',
				promoteStartTime = '',
				promoteEndDate = '',
				promoteEndTime = '',
				memberPromoteStartDate = '',
				memberPromoteStartTime = '',
				memberPromoteEndDate = '',
				memberPromoteEndTime = '',
				memberPoint = '',
				promoteReason = '',
				promoteFlag = '',
			} = {},
		} = {},
	} = props;

	// const productInfo = props.productInfo || {};
	// const extraPriceInfo = productInfo.extraPriceInfo || [];
	// const {
	// 	form: { getFieldDecorator },
	// } = props;

	// const {
	// 	customPrice1 = '',
	// 	customPrice2 = '',
	// 	customPrice3 = '',
	// 	customPrice1Description = '',
	// 	customPrice2Description = '',
	// 	customPrice3Description = '',
	// 	promoteStartDate = '',
	// 	promoteStartTime = '',
	// 	promoteEndDate = '',
	// 	promoteEndTime = '',
	// 	memberPromoteStartDate = '',
	// 	memberPromoteStartTime = '',
	// 	memberPromoteEndDate = '',
	// 	memberPromoteEndTime = '',
	// 	memberPoint = '',
	// 	promoteReason = '',
	// 	promoteFlag = '',
	// } = extraPriceInfo[0];

	const extraPriceInfoList = [
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.customPrice1' }),
				getFieldName: 'customPrice1',
				value: customPrice1,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.customPrice2' }),
				getFieldName: 'customPrice2',
				value: customPrice2,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.customPrice3' }),
				getFieldName: 'customPrice3',
				value: customPrice3,
				required: false,
				message: '',
				validator: false,
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
				label: formatMessage({ id: 'basicData.product.extra.price.promoteStartDate' }),
				getFieldName: 'promoteStartDate',
				value: promoteStartDate,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.promoteStartTime' }),
				getFieldName: 'promoteStartTime',
				value: promoteStartTime,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.promoteEndDate' }),
				getFieldName: 'promoteEndDate',
				value: promoteEndDate,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.promoteEndTime' }),
				getFieldName: 'promoteEndTime',
				value: promoteEndTime,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.memberPromoteStartDate' }),
				getFieldName: 'memberPromoteStartDate',
				value: memberPromoteStartDate,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.memberPromoteStartTime' }),
				getFieldName: 'memberPromoteStartTime',
				value: memberPromoteStartTime,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
		],
		[
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.memberPromoteEndDate' }),
				getFieldName: 'memberPromoteEndDate',
				value: memberPromoteEndDate,
				required: false,
				message: '',
				validator: false,
				field: '',
			},
			{
				colSpan: 12,
				label: formatMessage({ id: 'basicData.product.extra.price.memberPromoteEndTime' }),
				getFieldName: 'memberPromoteEndTime',
				value: memberPromoteEndTime,
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
				getFieldName: 'memberPoint',
				value: memberPoint,
				required: false,
				message: '',
				validator: false,
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
				getFieldName: 'promoteFlag',
				value: promoteFlag,
				required: false,
				message: '',
				validator: false,
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
										validator: (rule, value, callback) =>
											customValidate({
												field: item.field,
												rule,
												value,
												callback,
											}),
									});
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
