import React, { useState } from 'react';
import {
	Card,
	Row,
	Col,
	Form,
	Input,
	Checkbox,
	Select,
	Button,
	DatePicker,
	TimePicker,
} from 'antd';
import { formatMessage } from 'umi/locale';
import { customValidate } from '@/utils/customValidate';
import { MAX_LENGTH, FORM_ITEM_LAYOUT_TWICE } from '@/constants/form';
import { getRandomString } from '@/utils/utils';

const noneBottom = { marginBottom: 0 };

const chargeUnitType = [
	{ key: 'count', value: 1 },
	{ key: 'kg', value: 2 },
	{ key: '100g', value: 3 },
	{ key: '500g', value: 4 },
];
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';
const packType = [{ key: 'date', value: 1 }, { key: 'days', value: 2 }];
const usebyType = [{ key: 'date', value: 1 }, { key: 'days', value: 2 }, { key: 'time', value: 3 }];
const limitType = [{ key: 'date', value: 1 }, { key: 'days', value: 2 }, { key: 'time', value: 3 }];

// TODO 等待返回值进行初始值的
const ProductCUWeight = props => {
	const {
		form: { getFieldDecorator, setFieldsValue },
	} = props;

	const [selectedPackType, setPackType] = useState(1);
	const [selectedUseByType, setUseByType] = useState(1);
	const [selectedLimitType, setLimitType] = useState(1);
	const [extraTextList, setExtraTextList] = useState([getRandomString()]);

	const dateTypeChange = (value, type) => {
		const dateTyper = {
			selectedPackType: { field: 'packDays', handler: setPackType },
			selectedUseByType: { field: 'usebyDays', handler: setUseByType },
			selectedLimitType: { field: 'limitDays', handler: setLimitType },
		};

		const { field, handler } = dateTyper[type] || {};

		handler(value);
		setFieldsValue({
			[field]: null,
		});
	};

	const addExtraList = () => {
		const randomKey = getRandomString();
		setExtraTextList([...extraTextList, randomKey]);
	};

	const removeExtraList = key => {
		setExtraTextList(extraTextList.filter(k => key !== k));
	};

	return (
		<Card
			title={formatMessage({ id: 'basicData.weightProduct.detail.title' })}
			bordered={false}
		>
			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.pluCode' })}>
						{getFieldDecorator('weighInfo.pluCode', {
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
									{getFieldDecorator('weighInfo.isDiscount')(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.isDiscount',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item style={noneBottom}>
									{getFieldDecorator('weighInfo.isAlterPrice')(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.isAlterPrice',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item style={noneBottom}>
									{getFieldDecorator('weighInfo.isPrintTraceCode')(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.isPrintTraceCode',
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
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.labelCode' })}>
						{getFieldDecorator('weighInfo.labelCode', {
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
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.barcodeCode' })}>
						{getFieldDecorator('weighInfo.barcodeCode', {
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
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.chargeUnit' })}>
						{getFieldDecorator('weighInfo.chargeUnit', {
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
								{chargeUnitType.map(type => (
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
					<Form.Item
						label={formatMessage({ id: 'basicData.weightProduct.productWeigh' })}
					>
						{getFieldDecorator('weighInfo.productWeigh', {
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
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.tareCode' })}>
						{getFieldDecorator('weighInfo.tareCode', {
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
						{getFieldDecorator('weighInfo.tare', {
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
					<Form.Item label=" " colon={false}>
						<Row>
							<Col span={10}>
								<Form.Item>
									{getFieldDecorator('weighInfo.packDist', {
										valuePropName: 'checked',
										initialValue: true,
									})(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.packDist',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
							<Col span={14}>
								<Form.Item
									label={formatMessage({
										id: 'basicData.weightProduct.packType',
									})}
									labelCol={{ span: 10 }}
									wrapperCol={{ span: 14 }}
								>
									{getFieldDecorator('weighInfo.packType', {
										initialValue: selectedPackType,
									})(
										<Select
											onChange={value =>
												dateTypeChange(value, 'selectedPackType')
											}
										>
											{packType.map(type => (
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
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.packDays' })}>
						{selectedPackType === 1
							? getFieldDecorator('weighInfo.packDays', {})(
								<DatePicker format={dateFormat} />
							  )
							: getFieldDecorator('weighInfo.packDays', {
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
									{getFieldDecorator('weighInfo.usebyDist', {
										valuePropName: 'checked',
										initialValue: true,
									})(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.usebyDist',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
							<Col span={14}>
								<Form.Item
									label={formatMessage({
										id: 'basicData.weightProduct.usebyType',
									})}
									labelCol={{ span: 10 }}
									wrapperCol={{ span: 14 }}
								>
									{getFieldDecorator('weighInfo.usebyType', {
										initialValue: selectedUseByType,
									})(
										<Select
											onChange={value =>
												dateTypeChange(value, 'selectedUseByType')
											}
										>
											{usebyType.map(type => (
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
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.usebyDays' })}>
						{selectedUseByType === 1 &&
							getFieldDecorator('weighInfo.usebyDays', {})(
								<DatePicker format={dateFormat} />
							)}

						{selectedUseByType === 2 &&
							getFieldDecorator('weighInfo.usebyDays', {
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

						{selectedUseByType === 3 &&
							getFieldDecorator('weighInfo.usebyDays', {})(
								<TimePicker format={timeFormat} />
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
									{getFieldDecorator('weighInfo.limitDist', {
										valuePropName: 'checked',
										initialValue: true,
									})(
										<Checkbox>
											{formatMessage({
												id: 'basicData.weightProduct.limitDist',
											})}
										</Checkbox>
									)}
								</Form.Item>
							</Col>
							<Col span={14}>
								<Form.Item
									label={formatMessage({
										id: 'basicData.weightProduct.limitType',
									})}
									labelCol={{ span: 10 }}
									wrapperCol={{ span: 14 }}
								>
									{getFieldDecorator('weighInfo.limitType', {
										initialValue: selectedLimitType,
									})(
										<Select
											onChange={value =>
												dateTypeChange(value, 'selectedLimitType')
											}
										>
											{limitType.map(type => (
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
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.limitDays' })}>
						{selectedLimitType === 1 &&
							getFieldDecorator('weighInfo.limitDays', {})(
								<DatePicker format={dateFormat} />
							)}

						{selectedLimitType === 2 &&
							getFieldDecorator('weighInfo.limitDays', {
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

						{selectedLimitType === 3 &&
							getFieldDecorator('weighInfo.limitDays', {})(
								<TimePicker format={timeFormat} />
							)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.weightProduct.exttextCode' })}>
						{getFieldDecorator('weighInfo.exttextCode', {
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
			</Row>

			{extraTextList.map((key, index) => (
				<Form.Item
					key={key}
					label={
						index === 0
							? formatMessage({ id: 'basicData.weightProduct.extraText' })
							: ' '
					}
					colon={index === 0}
					{...FORM_ITEM_LAYOUT_TWICE}
				>
					{getFieldDecorator(`weighInfo.exttextNo.${key}`, {})(
						<Input.TextArea
							maxLength={500}
							autosize={{ minRows: 2, maxRows: 4 }}
							style={{ width: '95%' }}
						/>
					)}
					{extraTextList.length > 1 && (
						<Button
							icon="delete"
							style={{ textAlign: 'center', marginLeft: '5px' }}
							onClick={() => removeExtraList(key)}
						/>
					)}
				</Form.Item>
			))}

			{extraTextList.length < 4 && (
				<Form.Item label=" " colon={false} {...FORM_ITEM_LAYOUT_TWICE}>
					<Button type="dashed" icon="plus" block onClick={addExtraList}>
						{formatMessage({ id: 'btn.create' })}
					</Button>
				</Form.Item>
			)}
		</Card>
	);
};

export default ProductCUWeight;
