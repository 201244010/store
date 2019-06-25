import React from 'react';
import { Card, Row, Col, Form, Input, Checkbox, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { customValidate } from '@/utils/customValidate';
import { MAX_LENGTH } from '@/constants/form';

const noneBottom = { marginBottom: 0 };

const weightPriceType = [
	{ key: 'count', value: 1 },
	{ key: 'kg', value: 2 },
	{ key: '100g', value: 3 },
	{ key: '500g', value: 4 },
];

const wrapDateType = [{ key: 'date', value: 1 }, { key: 'days', value: 2 }];
const allDateType = [
	{ key: 'date', value: 1 },
	{ key: 'days', value: 2 },
	{ key: 'time', value: 3 },
];

// TODO 称重商品信息部分，提交的字段需要与后端对应
const ProductCUWeight = props => {
	const {
		form: { getFieldDecorator },
	} = props;
	return (
		<Card
			title={formatMessage({ id: 'basicData.weightProduct.detail.title' })}
			bordered={false}
		>
			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.PLU' })}>
						{getFieldDecorator('plu_code', {
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.weightProduct.PLU.isEmpty',
									}),
								},
								{
									validator: (rule, value, callback) => {
										customValidate({ field: 'pluCode', rule, value, callback });
									},
								},
							],
						})(<Input maxLength={MAX_LENGTH[20]} />)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label=" " colon={false}>
						<Row>
							<Col span={8}>
								<Form.Item style={noneBottom}>
									{getFieldDecorator('allowDiscount')(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.discount.admit',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item style={noneBottom}>
									{getFieldDecorator('allowChangePrice')(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.priceChange.admit',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item style={noneBottom}>
									{getFieldDecorator('printCode')(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.print.code',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
						</Row>
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item
						label={formatMessage({ id: 'basicData.weightProduct.printLabel.number' })}
					>
						{getFieldDecorator('print_label', {
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) => {
										if (value && !/^\d{0,2}$/.test(value)) {
											callback(
												formatMessage({
													id:
														'basicData.weightProduct.printLabel.formatError',
												})
											);
										} else {
											callback();
										}
									},
								},
							],
						})(<Input maxLength={MAX_LENGTH[2]} />)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label={formatMessage({ id: 'basicData.weightProduct.barCode.number' })}
					>
						{getFieldDecorator('bar_code_weight', {
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) => {
										if (value && !/^\d{0,2}$/.test(value)) {
											callback(
												formatMessage({
													id:
														'basicData.weightProduct.barCode.formatError',
												})
											);
										} else {
											callback();
										}
									},
								},
							],
						})(<Input maxLength={MAX_LENGTH[2]} />)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item
						label={formatMessage({ id: 'basicData.weightProduct.weight.price' })}
					>
						{getFieldDecorator('weight_price_type', {
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.weightProduct.weight.price.isEmpty',
									}),
								},
							],
						})(
							<Select>
								{weightPriceType.map(type => (
									<Select.Option key={type.key} value={type.value}>
										{formatMessage({
											id: `basicData.weightProduct.weight.price.${type.key}`,
										})}
									</Select.Option>
								))}
							</Select>
						)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.weight' })}>
						{getFieldDecorator('product_weight', {
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'productWeight',
											rule,
											value,
											callback,
										}),
								},
							],
						})(<Input addonAfter="kg" maxLength={9} />)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.tare.number' })}>
						{getFieldDecorator('tare_number', {
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) => {
										if (value && !/^[1-9]{1}|[0-9]{2}$/.test(value)) {
											callback(
												formatMessage({
													id:
														'basicData.weightProduct.tare.number.formatError',
												})
											);
										} else {
											callback();
										}
									},
								},
							],
						})(<Input maxLength={2} />)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.tare' })}>
						{getFieldDecorator('tare', {
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'productWeight',
											rule,
											value,
											callback,
											extra: {
												messageId:
													'basicData.weightProduct.tare.formatError',
											},
										}),
								},
							],
						})(<Input addonAfter="kg" maxLength={9} />)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item
						label={formatMessage({ id: 'basicData.weightProduct.extraText.number' })}
					>
						{getFieldDecorator('extraText_number_1', {
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) => {
										if (value && !/^\d{0,2}$/.test(value)) {
											callback(
												formatMessage({
													id:
														'basicData.weightProduct.extraText.number.formatError',
												})
											);
										} else {
											callback();
										}
									},
								},
							],
						})(<Input maxLength={2} />)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.extraText' })}>
						{getFieldDecorator('extraText_content_1', {
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'productWeight',
											rule,
											value,
											callback,
											extra: {
												messageId:
													'basicData.weightProduct.tare.formatError',
											},
										}),
								},
							],
						})(
							<Input.TextArea maxLength={500} autosize={{ minRows: 4, maxRows: 4 }} />
						)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item label=" " colon={false}>
						<Row>
							<Col span={10}>
								<Form.Item>
									{getFieldDecorator('wrapDate_enadble', {
										valuePropName: 'checked',
										initialValue: true,
									})(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.wrapDate.enable',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
							<Col span={14}>
								<Form.Item
									label={formatMessage({
										id: 'basicData.weightProduct.wrapDate.type',
									})}
									labelCol={{ span: 10 }}
									wrapperCol={{ span: 14 }}
								>
									{getFieldDecorator('wrapDate_type', {
										initialValue: 1,
									})(
										<Select>
											{wrapDateType.map(type => (
												<Select.Option key={type.key} value={type.value}>
													{formatMessage({
														id: `basicData.weightProduct.date.type.${
															type.key
														}`,
													})}
												</Select.Option>
											))}
										</Select>
									)}
								</Form.Item>
							</Col>
						</Row>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label={formatMessage({ id: 'basicData.weightProduct.wrapDate.date' })}
					>
						{getFieldDecorator('wrapDate_date', {
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'dateNumber',
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
					<Form.Item label=" " colon={false}>
						<Row>
							<Col span={10}>
								<Form.Item>
									{getFieldDecorator('suggestDate_enadble', {
										valuePropName: 'checked',
										initialValue: true,
									})(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.suggestDate.enable',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
							<Col span={14}>
								<Form.Item
									label={formatMessage({
										id: 'basicData.weightProduct.suggestDate.type',
									})}
									labelCol={{ span: 10 }}
									wrapperCol={{ span: 14 }}
								>
									{getFieldDecorator('suggestDate_type', {
										initialValue: 1,
									})(
										<Select>
											{allDateType.map(type => (
												<Select.Option key={type.key} value={type.value}>
													{formatMessage({
														id: `basicData.weightProduct.date.type.${
															type.key
														}`,
													})}
												</Select.Option>
											))}
										</Select>
									)}
								</Form.Item>
							</Col>
						</Row>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label={formatMessage({ id: 'basicData.weightProduct.suggestDate.date' })}
					>
						{getFieldDecorator('suggestDate_date', {
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'dateNumber',
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
					<Form.Item label=" " colon={false}>
						<Row>
							<Col span={10}>
								<Form.Item>
									{getFieldDecorator('bestBeforeDate_enadble', {
										valuePropName: 'checked',
										initialValue: true,
									})(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.bestBeforeDate.enable',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
							<Col span={14}>
								<Form.Item
									label={formatMessage({
										id: 'basicData.weightProduct.bestBeforeDate.type',
									})}
									labelCol={{ span: 10 }}
									wrapperCol={{ span: 14 }}
								>
									{getFieldDecorator('bestBeforeDate_type', {
										initialValue: 1,
									})(
										<Select>
											{allDateType.map(type => (
												<Select.Option key={type.key} value={type.value}>
													{formatMessage({
														id: `basicData.weightProduct.date.type.${
															type.key
														}`,
													})}
												</Select.Option>
											))}
										</Select>
									)}
								</Form.Item>
							</Col>
						</Row>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label={formatMessage({ id: 'basicData.weightProduct.bestBeforeDate.date' })}
					>
						{getFieldDecorator('bestBeforeDate_date', {
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'dateNumber',
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
		</Card>
	);
};

export default ProductCUWeight;
