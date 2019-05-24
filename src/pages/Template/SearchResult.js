import React, { Component } from 'react';
import { Table, Divider, Modal, Button, Form, Input, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { ERROR_OK } from '@/constants/errorCode';
import { unixSecondToDate } from '@/utils/utils';
import * as styles from './index.less';

const { Option } = Select;

const TEMPLATE_STATES = {
	0: formatMessage({ id: 'esl.device.template.status.draft' }),
	1: formatMessage({ id: 'esl.device.template.status.apply' }),
};

@Form.create()
class SearchResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newVisible: false,
		};
	}

	onTableChange = pagination => {
		const { fetchTemplates } = this.props;

		fetchTemplates({
			options: {
				current: pagination.current,
				pageSize: pagination.pageSize,
				screen_type: -1,
				colour: -1,
			},
		});
	};

	editDetail = record => {
		window.open(`/studio?id=${record.id}&screen=${record.screen_type}`);
	};

	deleteTemplate = record => {
		const { deleteTemplate } = this.props;

		Modal.confirm({
			title: formatMessage({ id: 'esl.device.template.delete.confirm.title' }),
			content: formatMessage({ id: 'esl.device.template.delete.confirm.content' }),
			okText: formatMessage({ id: 'esl.device.template.delete.confirm.ok.text' }),
			okType: 'danger',
			cancelText: formatMessage({ id: 'esl.device.template.delete.confirm.cancel.text' }),
			onOk() {
				deleteTemplate({
					template_id_list: [record.id],
				});
			},
		});
	};

	applyTemplate = record => {
		const { applyTemplate } = this.props;

		applyTemplate({
			template_id: record.id,
		});
	};

	showNew = () => {
		this.setState({
			newVisible: true,
		});
	};

	handleOkNew = () => {
		const {
			props: {
				form: { validateFields, resetFields },
				createTemplate,
			},
		} = this;
		validateFields(async (errors, values) => {
			if (!errors) {
				const response = await createTemplate(values);
				if (response && response.code === ERROR_OK) {
					this.setState(
						{
							newVisible: false,
						},
						() => {
							resetFields();
							window.open(
								`/studio?id=${response.data.template_id}&screen=${
									values.screen_type
								}`
							);
						}
					);
				}
			}
		});
	};

	handleCancelNew = () => {
		this.setState({
			newVisible: false,
		});
	};

	render() {
		const {
			props: {
				screenTypes,
				colors,
				loading,
				data,
				pagination,
				form: { getFieldDecorator },
				fetchColors,
			},
			state: { newVisible },
		} = this;
		const columns = [
			{
				title: formatMessage({ id: 'esl.device.template.name' }),
				dataIndex: 'name',
			},
			{
				title: formatMessage({ id: 'esl.device.template.size' }),
				dataIndex: 'screen_type_name',
			},
			{
				title: formatMessage({ id: 'esl.device.template.color' }),
				dataIndex: 'colour_name',
			},
			{
				title: formatMessage({ id: 'esl.device.template.esl.num' }),
				dataIndex: 'esl_num',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.status' }),
				dataIndex: 'status',
				render: text => <span>{TEMPLATE_STATES[text]}</span>,
			},
			{
				title: formatMessage({ id: 'esl.device.template.last.modify.time' }),
				dataIndex: 'modify_time',
				render: text => <span>{unixSecondToDate(text)}</span>,
			},
			{
				title: formatMessage({ id: 'list.action.title' }),
				key: 'action',
				render: (_, record) => (
					<span>
						<a href="javascript: void (0);" onClick={() => this.editDetail(record)}>
							{formatMessage({ id: 'list.action.edit' })}
						</a>
						<Divider type="vertical" />
						<a href="javascript: void (0);" onClick={() => this.applyTemplate(record)}>
							{formatMessage({ id: 'list.action.apply' })}
						</a>
						<Divider type="vertical" />
						{record.is_default === 1 || record.esl_num > 1 ? (
							<a href="javascript: void (0);" className={styles.disabled}>
								{formatMessage({ id: 'list.action.delete' })}
							</a>
						) : (
							<a
								href="javascript: void (0);"
								onClick={() => this.deleteTemplate(record)}
							>
								{formatMessage({ id: 'list.action.delete' })}
							</a>
						)}
					</span>
				),
			},
		];
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 20 },
			},
		};

		return (
			<div>
				<div style={{ marginBottom: 20 }}>
					<Button loading={loading} type="primary" icon="plus" onClick={this.showNew}>
						{formatMessage({ id: 'esl.device.template.new' })}
					</Button>
				</div>
				<Table
					rowKey="id"
					loading={loading}
					columns={columns}
					dataSource={data}
					pagination={{
						...pagination,
						showTotal: total =>
							`${formatMessage({ id: 'esl.device.esl.all' })}${total}${formatMessage({
								id: 'esl.device.esl.total',
							})}`,
					}}
					onChange={this.onTableChange}
				/>
				<Modal
					title={formatMessage({ id: 'esl.device.template.new' })}
					visible={newVisible}
					onOk={this.handleOkNew}
					onCancel={this.handleCancelNew}
				>
					<Form {...formItemLayout} style={{ padding: 24 }}>
						<Form.Item label={formatMessage({ id: 'esl.device.template.name' })}>
							{getFieldDecorator('name', {
								rules: [
									{
										required: true,
										message: formatMessage({
											id: 'esl.device.template.name.require',
										}),
									},
								],
							})(
								<Input
									placeholder={formatMessage({
										id: 'esl.device.template.name.require',
									})}
								/>
							)}
						</Form.Item>
						<Form.Item label={formatMessage({ id: 'esl.device.template.size' })}>
							{getFieldDecorator('screen_type', {
								rules: [
									{
										required: true,
										message: formatMessage({
											id: 'esl.device.template.size.require',
										}),
									},
								],
							})(
								<Select
									placeholder={formatMessage({
										id: 'esl.device.template.size.require',
									})}
									onChange={type => {
										fetchColors({ screen_type: type });
									}}
								>
									{screenTypes.map(type => (
										<Option key={type.id} value={type.id}>
											{type.name}
										</Option>
									))}
								</Select>
							)}
						</Form.Item>
						<Form.Item label={formatMessage({ id: 'esl.device.template.color' })}>
							{getFieldDecorator('colour', {
								rules: [
									{
										required: true,
										message: formatMessage({
											id: 'esl.device.template.color.require',
										}),
									},
								],
							})(
								<Select
									placeholder={formatMessage({
										id: 'esl.device.template.color.require',
									})}
								>
									{colors.map(type => (
										<Option key={type.id} value={type.id}>
											{type.name}
										</Option>
									))}
								</Select>
							)}
						</Form.Item>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default SearchResult;
