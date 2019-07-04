import React from 'react';
import { Card, Col, Form, Input, Row, Select } from 'antd';
import { customValidate } from '@/utils/customValidate';
import { formatMessage } from 'umi/locale';
import { MAX_LENGTH } from '@/constants/form';
// import EditableFormItem from '@/components/EditableFormItem';

// const productTypes = [{ key: 'normal', value: 0 }, { key: 'weight', value: 1 }];
const productTypes = [{ key: 'normal', value: 0 }];
const productUnits = [
	{ key: 'box', value: 0, tempValue: formatMessage({ id: 'basicData.product.unit.box' }) },
	{ key: 'pack', value: 1, tempValue: formatMessage({ id: 'basicData.product.unit.pack' }) },
	{ key: 'bottle', value: 2, tempValue: formatMessage({ id: 'basicData.product.unit.bottle' }) },
	{ key: 'can', value: 3, tempValue: formatMessage({ id: 'basicData.product.unit.can' }) },
	{ key: 'piece', value: 4, tempValue: formatMessage({ id: 'basicData.product.unit.piece' }) },
	{ key: 'case', value: 5, tempValue: formatMessage({ id: 'basicData.product.unit.case' }) },
	{ key: 'axe', value: 6, tempValue: formatMessage({ id: 'basicData.product.unit.axe' }) },
	{ key: 'kg', value: 7, tempValue: formatMessage({ id: 'basicData.product.unit.kg' }) },
	{ key: 'g', value: 8, tempValue: formatMessage({ id: 'basicData.product.unit.g' }) },
	{ key: 'each', value: 9, tempValue: formatMessage({ id: 'basicData.product.unit.each' }) },
	{ key: 'single', value: 10, tempValue: formatMessage({ id: 'basicData.product.unit.single' }) },
	{ key: 'bag', value: 11, tempValue: formatMessage({ id: 'basicData.product.unit.bag' }) },
	{ key: 'list', value: 12, tempValue: formatMessage({ id: 'basicData.product.unit.list' }) },
	{ key: 'role', value: 13, tempValue: formatMessage({ id: 'basicData.product.unit.role' }) },
	{ key: 'pair', value: 14, tempValue: formatMessage({ id: 'basicData.product.unit.pair' }) },
	{ key: 'l', value: 15, tempValue: formatMessage({ id: 'basicData.product.unit.l' }) },
	{ key: 'ml', value: 16, tempValue: formatMessage({ id: 'basicData.product.unit.ml' }) },
	{ key: 'handle', value: 17, tempValue: formatMessage({ id: 'basicData.product.unit.handle' }) },
	{ key: 'group', value: 18, tempValue: formatMessage({ id: 'basicData.product.unit.group' }) },
	{ key: 'branch', value: 19, tempValue: formatMessage({ id: 'basicData.product.unit.branch' }) },
];

const ProductCUBasic = props => {
	const {
		form: { getFieldDecorator },
		// form,
		productInfo: {
			seqNum = '',
			barCode = '',
			name = '',
			alias = '',
			type = 0,
			unit = formatMessage({ id: 'basicData.product.unit.box' }),
			spec = '',
			area = '',
			level = '',
			brand = '',
			expireTime = '',
			qrCode = '',
		},
		onSelectChange,
		// productBasicExtra,
		// remove,
	} = props;
	return (
		<Card title={formatMessage({ id: 'basicData.product.detail.title' })} bordered={false}>
			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.seqNum' })}>
						{getFieldDecorator('seqNum', {
							initialValue: seqNum,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({ id: 'product.seq_num.isEmpty' }),
								},
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'seq_num',
											rule,
											value,
											callback,
										}),
								},
							],
						})(<Input maxLength={MAX_LENGTH['20']} />)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.barCode' })}>
						{getFieldDecorator('barCode', {
							initialValue: barCode,
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'bar_code',
											rule,
											value,
											callback,
										}),
								},
							],
						})(<Input maxLength={MAX_LENGTH['20']} />)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.name' })}>
						{getFieldDecorator('name', {
							initialValue: name,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({ id: 'product.name.isEmpty' }),
								},
							],
						})(<Input maxLength={MAX_LENGTH['100']} />)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.alias' })}>
						{getFieldDecorator('alias', {
							initialValue: alias,
						})(<Input maxLength={MAX_LENGTH['100']} />)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.type' })}>
						{getFieldDecorator('type', {
							initialValue: type,
						})(
							<Select onChange={onSelectChange}>
								{productTypes.map(item => (
									<Select.Option key={item.key} value={item.value}>
										{formatMessage({
											id: `basicData.product.type.${item.key}`,
										})}
									</Select.Option>
								))}
							</Select>
						)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.unit' })}>
						{getFieldDecorator('unit', {
							initialValue: unit,
						})(
							<Select>
								{productUnits.map(unitItem => (
									<Select.Option key={unitItem.key} value={unitItem.tempValue}>
										{formatMessage({
											id: `basicData.product.unit.${unitItem.key}`,
										})}
									</Select.Option>
								))}
							</Select>
						)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.spec' })}>
						{getFieldDecorator('spec', {
							initialValue: spec,
						})(<Input maxLength={MAX_LENGTH['20']} />)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.area' })}>
						{getFieldDecorator('area', {
							initialValue: area,
						})(<Input maxLength={MAX_LENGTH['20']} />)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.level' })}>
						{getFieldDecorator('level', {
							initialValue: level,
						})(<Input maxLength={MAX_LENGTH['20']} />)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.brand' })}>
						{getFieldDecorator('brand', {
							initialValue: brand,
						})(<Input maxLength={MAX_LENGTH['20']} />)}
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.expireTime' })}>
						{getFieldDecorator('expireTime', {
							initialValue: expireTime > 0 ? expireTime : '',
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) =>
										customValidate({
											field: 'expire_time',
											rule,
											value,
											callback,
										}),
								},
							],
						})(
							<Input
								suffix={formatMessage({
									id: 'basicData.product.expire_time.day',
								})}
								maxLength={MAX_LENGTH['4']}
							/>
						)}
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={formatMessage({ id: 'basicData.product.qrCode' })}>
						{getFieldDecorator('qrCode', {
							initialValue: qrCode,
						})(<Input maxLength={MAX_LENGTH['200']} />)}
					</Form.Item>
				</Col>
			</Row>

			{/* <EditableFormItem */}
			{/* {...{ */}
			{/* form, */}
			{/* max: 30, */}
			{/* countStart: productBasicExtra.length || 0, */}
			{/* data: productBasicExtra, */}
			{/* onRemove: index => remove(index, 'info'), */}
			{/* wrapperItem: <Input maxLength={MAX_LENGTH['100']} />, */}
			{/* itemOptions: { */}
			{/* validateTrigger: 'onBlur', */}
			{/* rules: [ */}
			{/* { */}
			{/* required: true, */}
			{/* message: formatMessage({ */}
			{/* id: 'basicData.product.extraInfo.isEmpty', */}
			{/* }), */}
			{/* }, */}
			{/* ], */}
			{/* }, */}
			{/* labelOption: { */}
			{/* labelPrefix: formatMessage({ id: 'basicData.product.customize' }), */}
			{/* formKey: 'extra_info', */}
			{/* editable: false, */}
			{/* }, */}
			{/* buttonProps: { */}
			{/* span: 12, */}
			{/* icon: 'plus', */}
			{/* type: 'dashed', */}
			{/* block: true, */}
			{/* text: formatMessage({ id: 'basicData.product.label.add' }), */}
			{/* }, */}
			{/* }} */}
			{/* /> */}
		</Card>
	);
};

export default ProductCUBasic;
