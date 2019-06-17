import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon } from 'antd';
import EditableLabel from './EditableLabel';

const formItemLayout = {
	wrapperCol: { span: 24 },
};

class EditableFormItem extends Component {
	constructor(props) {
		super(props);
		const { countStart, max } = props;
		this.count = countStart || 0;
		this.max = max || Infinity;
	}

	remove = (k, index) => {
		const {
			form: { getFieldValue, setFieldsValue },
			labelOption: { formKey = '' },
			onRemove,
		} = this.props;
		const keys = getFieldValue(`__${formKey}__`);
		if (keys.length === 0) {
			return;
		}
		this.count -= 1;
		setFieldsValue({
			[`__${formKey}__`]: keys.filter(key => key !== k),
		});

		if (onRemove) {
			onRemove(index);
		}
	};

	addCustomFormItem = () => {
		const {
			form: { getFieldValue, setFieldsValue },
			labelOption: { formKey = '' },
		} = this.props;

		if (this.count < this.max) {
			this.count += 1;
			const keys = getFieldValue(`__${formKey}__`);
			const nextId = +new Date();
			const nextKeys = keys.concat(nextId);

			setFieldsValue({
				[`__${formKey}__`]: nextKeys,
			});
		}
	};

	renderCustomizeFormItem = () => {
		const {
			form: { getFieldDecorator, getFieldValue },
			labelOption = {},
			labelOption: { labelPrefix = '', formKey = '', span = 12, labelDecorator = 'name' },
			itemOptions = {},
			itemOptions: { itemDecorator = 'context' },
			data = [],
			wrapperItem = <Input />,
		} = this.props;

		const countInitial = data.map(() => +new Date() * Math.random());
		getFieldDecorator(`__${formKey}__`, { initialValue: countInitial });
		const keys = getFieldValue(`__${formKey}__`);

		return keys.map((key, index) => {
			const labelName = `${labelPrefix}${index + 1}`;
			const { name, [itemDecorator]: value } = data[index] || {};
			const labelProps = {
				...labelOption,
				index,
				name: name || labelName,
			};
			return (
				<Col span={span} key={key}>
					<Row>
						<Col span={8}>
							<Form.Item {...formItemLayout}>
								{getFieldDecorator(`${formKey}.${index}.${labelDecorator}`, {
									initialValue: name || labelName,
								})(<EditableLabel {...{ labelProps }} />)}
							</Form.Item>
						</Col>
						<Col span={14}>
							<Form.Item {...formItemLayout}>
								{getFieldDecorator(`${formKey}.${index}.${itemDecorator}`, {
									initialValue: value || '',
									...itemOptions,
								})(wrapperItem)}
							</Form.Item>
						</Col>
						<Col span={2}>
							<Form.Item {...formItemLayout}>
								<Icon
									style={{ marginLeft: '20px' }}
									type="minus-circle-o"
									onClick={() => this.remove(key, index)}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Col>
			);
		});
	};

	render() {
		const {
			buttonProps = {},
			buttonProps: { span = 24, label = ' ', text = '' },
		} = this.props;
		return (
			<>
				<Row>
					{this.renderCustomizeFormItem()}
					<Col span={span}>
						<Form.Item label={label} colon={false}>
							<Button {...buttonProps} onClick={this.addCustomFormItem}>
								{text}
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</>
		);
	}
}

export default EditableFormItem;
