import React from 'react';
import { Card, Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { customValidate } from '@/utils/customValidate';
// import EditableFormItem from '@/components/EditableFormItem';

const ProductCUPrice = props => {
	const {
		// form = {},
		form: { getFieldDecorator },
		productInfo: { price = -1, promotePrice = -1, memberPrice = -1 },
		// productPriceExtra,
		// remove,
	} = props;

	return (
		<Card title={formatMessage({ id: 'basicData.product.price.title' })} bordered={false}>
			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.price' })}>
						{getFieldDecorator('price', {
							initialValue:
								parseInt(price, 10) < 0 ? null : parseFloat(price).toFixed(2),
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({ id: 'product.price.isEmpty' }),
								},
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'price',
											rule,
											value,
											callback,
										}),
								},
							],
						})(<Input />)}
					</Form.Item>
				</Col>

				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.promotePrice' })}>
						{getFieldDecorator('promotePrice', {
							initialValue:
								parseInt(promotePrice, 10) < 0
									? null
									: parseFloat(promotePrice).toFixed(2),
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'promote_price',
											rule,
											value,
											callback,
										}),
								},
							],
						})(<Input />)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.memberPrice' })}>
						{getFieldDecorator('memberPrice', {
							initialValue:
								parseInt(memberPrice, 10) < 0
									? null
									: parseFloat(memberPrice).toFixed(2),
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'member_price',
											rule,
											value,
											callback,
										}),
								},
							],
						})(<Input />)}
					</Form.Item>
				</Col>
			</Row>

			{/* <EditableFormItem */}
			{/* {...{ */}
			{/* form, */}
			{/* max: 7, */}
			{/* wrapperItem: <Input type="number" />, */}
			{/* countStart: productPriceExtra.length || 0, */}
			{/* data: productPriceExtra, */}
			{/* onRemove: index => remove(index, 'price'), */}
			{/* itemOptions: { */}
			{/* itemDecorator: 'price', */}
			{/* validateTrigger: 'onBlur', */}
			{/* rules: [ */}
			{/* { */}
			{/* required: true, */}
			{/* message: formatMessage({ */}
			{/* id: 'basicData.product.extraPrice.isEmpty', */}
			{/* }), */}
			{/* }, */}
			{/* ], */}
			{/* }, */}
			{/* labelOption: { */}
			{/* labelPrefix: formatMessage({ id: 'basicData.product.price.customize' }), */}
			{/* formKey: 'extra_price_info', */}
			{/* editable: false, */}
			{/* }, */}
			{/* buttonProps: { */}
			{/* span: 12, */}
			{/* icon: 'plus', */}
			{/* type: 'dashed', */}
			{/* block: true, */}
			{/* text: formatMessage({ id: 'basicData.product.price.add' }), */}
			{/* }, */}
			{/* }} */}
			{/* /> */}
		</Card>
	);
};

export default ProductCUPrice;
