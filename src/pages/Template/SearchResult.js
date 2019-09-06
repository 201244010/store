import React, { Component } from 'react';
import { Table, Divider, Modal, Button, Form, Input, Select, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import { ERROR_OK } from '@/constants/errorCode';
import { unixSecondToDate } from '@/utils/utils';
import * as styles from './index.less';
import { FORM_FORMAT, FORM_ITEM_LAYOUT, FORM_LABEL_LEFT, SEARCH_FORM_COL } from '@/constants/form';

const { Option } = Select;

const TEMPLATE_STATES = {
	0: formatMessage({ id: 'esl.device.template.status.draft' }),
	1: formatMessage({ id: 'esl.device.template.status.apply' }),
};

const widthMap = {
	1: 348,
	2: 442,
	3: 510
};

const styleMap = {
	1: 'img-213',
	2: 'img-26',
	3: 'img-42'
};

const imgMap = {
	1: require('../../assets/studio/2.13.png'),
	2: require('../../assets/studio/2.6.png'),
	3: require('../../assets/studio/4.2.png'),
};

@Form.create()
class SearchResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newVisible: false,
			cloneVisible: false,
			previewVisible: false,
			curRecord: {},
		};
	}

	changeFormValues = (inputType, fieldName, e) => {
		const { changeSearchFormValue } = this.props;
		changeSearchFormValue({
			options: {
				[fieldName]: inputType === 'input' ? e.target.value : e,
			},
		});
	};

	onFormChange = async (type, value) => {
		const { changeSearchFormValue } = this.props;
		await changeSearchFormValue({
			options: {
				[type]: value,
			},
		});
		this.search();
	};

	onTableChange = pagination => {
		const { fetchTemplates } = this.props;

		fetchTemplates({
			options: {
				current: pagination.current,
				pageSize: pagination.pageSize,
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

	previewTemplate = (record) => {
		this.setState({
			previewVisible: true,
			curRecord: record,
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

	showClone = record => {
		this.setState({
			cloneVisible: true,
			curRecord: record,
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

	handleCancelClone = () => {
		this.setState({
			cloneVisible: false,
		});
	};

	handleCancelPreview = () => {
		this.setState({
			previewVisible: false,
		});
	};

	handleClone = () => {
		const {
			state: { curRecord },
			props: {
				form: { validateFields, resetFields },
				cloneTemplate,
			},
		} = this;
		validateFields(async (errors, values) => {
			if (!errors.name) {
				const response = await cloneTemplate({
					name: values.name,
					template_id: curRecord.id,
				});
				if (response && response.code === ERROR_OK) {
					this.setState(
						{
							cloneVisible: false,
						},
						() => {
							resetFields();
							window.open(
								`/studio?id=${response.data.template_id}&screen=${
									curRecord.screen_type
								}`
							);
						}
					);
				}
			}
		});
	};

	search = () => {
		const { fetchTemplates } = this.props;
		fetchTemplates();
	};

	validateTemplateName = (rule, value, callback) => {
		// eslint-disable-next-line no-control-regex
		const { length } = (value || '').replace(/[^\x00-\xff]/g, '01');
		if (length <= 40) {
			callback();
		} else {
			callback('长度超过限制(40个英文字母或20个汉字以内)');
		}
	};

	render() {
		const {
			props: {
				searchFormValues,
				screenTypes,
				colors,
				loading,
				data,
				pagination,
				form: { getFieldDecorator },
				fetchColors,
			},
			state: { newVisible, cloneVisible, previewVisible, curRecord },
		} = this;
		const columns = [
			{
				title: formatMessage({ id: 'esl.device.template.name' }),
				dataIndex: 'name',
			},
			{
				title: formatMessage({ id: 'esl.device.template.size' }),
				dataIndex: 'screen_type_name',
				render: text => <span>{formatMessage({ id: text })}</span>,
			},
			{
				title: formatMessage({ id: 'esl.device.template.color' }),
				dataIndex: 'colour_name',
				render: text => <span>{formatMessage({ id: text })}</span>,
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
						<a href="javascript: void (0);" onClick={() => this.previewTemplate(record)}>
							{formatMessage({ id: 'list.action.preview' })}
						</a>
						<Divider type="vertical" />
						<a href="javascript: void (0);" onClick={() => this.applyTemplate(record)}>
							{formatMessage({ id: 'list.action.apply' })}
						</a>
						<Divider type="vertical" />
						<a href="javascript: void (0);" onClick={() => this.showClone(record)}>
							{formatMessage({ id: 'list.action.clone' })}
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
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 18 },
			},
		};

		return (
			<div>
				<div className={styles['search-bar']}>
					<Form {...{ ...FORM_ITEM_LAYOUT, ...FORM_LABEL_LEFT }}>
						<Row gutter={FORM_FORMAT.gutter}>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item>
									<Input
										style={{ width: '100%' }}
										placeholder={formatMessage({
											id: 'esl.device.template.name.require',
										})}
										maxLength={60}
										value={searchFormValues.keyword}
										onChange={e => this.changeFormValues('input', 'keyword', e)}
									/>
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD} />
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item className={styles['query-item']}>
									<Button loading={loading} type="primary" onClick={this.search}>
										{formatMessage({ id: 'btn.query' })}
									</Button>
									<Button
										loading={loading}
										type="primary"
										icon="plus"
										onClick={this.showNew}
										className={styles['btn-margin-left']}
									>
										{formatMessage({ id: 'esl.device.template.new' })}
									</Button>
								</Form.Item>
							</Col>
						</Row>
						<div style={{ marginBottom: 20 }}>
							<span style={{ marginRight: 30 }}>
								{formatMessage({ id: 'esl.device.template.size' })}:
							</span>
							<Button
								type={searchFormValues.screen_type === -1 ? 'primary' : 'default'}
								style={{ marginRight: 30 }}
								onClick={() => {
									this.onFormChange('screen_type', -1);
								}}
							>
								{formatMessage({ id: 'select.all' })}
							</Button>
							{screenTypes.map(type => (
								<Button
									type={
										searchFormValues.screen_type === type.id
											? 'primary'
											: 'default'
									}
									style={{ marginRight: 30 }}
									key={type.id}
									onClick={() => {
										this.onFormChange('screen_type', type.id);
									}}
								>
									{formatMessage({ id: type.name })}
								</Button>
							))}
						</div>
						<div>
							<span style={{ marginRight: 30 }}>
								{formatMessage({ id: 'esl.device.template.color.support' })}:
							</span>
							<Button
								type={searchFormValues.colour === -1 ? 'primary' : 'default'}
								style={{ marginRight: 30 }}
								onClick={() => {
									this.onFormChange('colour', -1);
								}}
							>
								{formatMessage({ id: 'select.all' })}
							</Button>
							{colors.map(color => (
								<Button
									type={
										searchFormValues.colour === color.id ? 'primary' : 'default'
									}
									style={{ marginRight: 30 }}
									key={color.id}
									onClick={() => {
										this.onFormChange('colour', color.id);
									}}
								>
									{formatMessage({ id: color.name })}
								</Button>
							))}
						</div>
					</Form>
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
									{
										validator: this.validateTemplateName,
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
				<Modal
					title={formatMessage({ id: 'esl.device.template.clone' })}
					visible={cloneVisible}
					onOk={this.handleClone}
					onCancel={this.handleCancelClone}
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
									{
										validator: this.validateTemplateName,
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
							<Input value={curRecord.screen_type_name} disabled />
						</Form.Item>
						<Form.Item label={formatMessage({ id: 'esl.device.template.color' })}>
							<Input value={curRecord.colour_name} disabled />
						</Form.Item>
					</Form>
				</Modal>
				<Modal
					title={formatMessage({ id: 'list.action.preview' })}
					width={widthMap[curRecord.screen_type]}
					visible={previewVisible}
					onOk={this.handleCancelPreview}
					onCancel={this.handleCancelPreview}
				>
					<div className={styles['preview-img']}>
						<img className={`${styles['wrap-img}']} ${styles[styleMap[curRecord.screen_type]]}`} src={imgMap[curRecord.screen_type]} alt="" />
						<img className={`${styles['content-img']} ${styles[styleMap[curRecord.screen_type]]}`} src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" alt="" />
					</div>
				</Modal>
			</div>
		);
	}
}

export default SearchResult;
