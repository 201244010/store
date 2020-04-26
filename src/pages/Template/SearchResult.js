import React, { Component } from 'react';
import { Table, Divider, Modal, Button, Form, Input, Select, Row, Col, Upload, message, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import formatedMessage from '@/constants/templateNames';
import { ERROR_OK } from '@/constants/errorCode';
import { PREVIEW_MAP } from '@/constants/studio';
import { unixSecondToDate } from '@/utils/utils';
import { FORM_FORMAT, FORM_ITEM_LAYOUT, FORM_LABEL_LEFT, SEARCH_FORM_COL } from '@/constants/form';
import PreviewList from './PreviewList';
import * as styles from './index.less';

const { Option } = Select;

const TEMPLATE_STATES = {
	0: formatMessage({ id: 'esl.device.template.status.draft' }),
	1: formatMessage({ id: 'esl.device.template.status.apply' }),
};
const COLOR_NAME = {
	BWR: formatMessage({ id: 'esl-template-colour-BWR' }),
	BW: formatMessage({ id: 'esl-template-colour-BW' }),
};
const SCREEN_NAME = {
	'1.54': formatMessage({ id: 'esl-screen-1.54' }),
	'2.13': formatMessage({ id: 'esl-screen-2.13' }),
	'2.6': formatMessage({ id: 'esl-screen-2.6' }),
	'4.2': formatMessage({ id: 'esl-screen-4.2' }),
	'7.5': formatMessage({ id: 'esl-screen-7.5' }),
};

@Form.create()
class SearchResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newVisible: false,
			cloneVisible: false,
			previewVisible: false,
			uploadLoading: false,
			uploadVisible: false,
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

	previewTemplate = async (record) => {
		const {previewTemplate} = this.props;

		const response = await previewTemplate({
			template_id: record.id
		});
		this.setState({
			previewVisible: true,
			curRecord: {
				...record,
				address: response.data.preview_addr
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
							window.open(`/studio?id=${response.data.template_id}&screen=${values.screen_type}`);
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

	handleCancelUpload = () => {
		this.setState({
			uploadVisible: false,
			uploadLoading: false
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
							window.open(`/studio?id=${response.data.template_id}&screen=${curRecord.screen_type}`);
						}
					);
				}
			}
		});
	};

	handleUpload = () => {
		const {
			props: {form: { validateFields, resetFields }, uploadTemplate},
			state: {curRecord: {templateInfo}}
		} = this;
		validateFields(['name'], async (errors, values) => {
			if (!errors) {
				const response = await uploadTemplate({
					name: values.name,
					template_model_name: templateInfo.type,
					template_colour: templateInfo.type.indexOf('BWR') > -1 ? 7 : 3,
					template: JSON.stringify(templateInfo),
				});
				if (response.code === ERROR_OK) {
					this.setState({
						uploadVisible: false,
						uploadLoading: false
					});
					resetFields();
				}
			}
		});
	};

	search = () => {
		const { fetchTemplates } = this.props;
		fetchTemplates({
			options: {
				current: 1
			}
		});
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

	uploadJsonFileChange = (info) => {
		this.setState({
			uploadVisible: true,
			curRecord: {
				fileName: info.file.name
			}
		});
		const reader = new FileReader();
		reader.readAsText(info.file, 'UTF-8');
		reader.onload = (e) => {
			const {curRecord} = this.state;
			const fileString = e.target.result;
			const templateInfo = JSON.parse(fileString);
			if (!templateInfo || !templateInfo.type) {
				message.warning(formatMessage({id: 'esl.device.template.action.upload.file.error'}));
				return;
			}

			const typeArr = templateInfo.type.split('-');
			this.setState({
				curRecord: {
					...curRecord,
					screen_type_name: SCREEN_NAME[typeArr[1]],
					colour_name: COLOR_NAME[typeArr[0]],
					templateInfo
				}
			});
		};
	};

	toggleViewType = async () => {
		const {viewType, changeViewType, fetchTemplates} = this.props;

		changeViewType({
			viewType: viewType === 'table' ? 'picture' : 'table'
		});

		fetchTemplates({
			options: {
				current: 1,
			},
		});
	};

	render() {
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
		const {
			props: {
				searchFormValues,
				screenTypes,
				colors,
				loading,
				data,
				pagination,
				form: { getFieldDecorator },
				viewType,
				fetchColors,
			},
			state: { newVisible, cloneVisible, uploadVisible, uploadLoading, previewVisible, curRecord },
		} = this;
		const columns = [
			{
				title: formatMessage({ id: 'esl.device.template.name' }),
				dataIndex: 'name',
				render: text => <span>{formatedMessage(text)}</span>,
			},
			{
				title: formatMessage({ id: 'esl.device.template.size' }),
				dataIndex: 'screen_type_name',
				render: text => <span>{formatedMessage(text)}</span>,
			},
			{
				title: formatMessage({ id: 'esl.device.template.color' }),
				dataIndex: 'colour_name',
				render: text => <span>{formatedMessage(text)}</span>,
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
						<a href="javascript: void (0);" onClick={() => this.previewTemplate(record)}>
							{formatMessage({ id: 'list.action.preview' })}
						</a>
						<Divider type="vertical" />
						<a href="javascript: void (0);" onClick={() => this.editDetail(record)}>
							{formatMessage({ id: 'list.action.edit' })}
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

		console.log('test debugger', PREVIEW_MAP.SCREEN_ID_STYLE);
		console.log('test debugger', curRecord.screen_type);
		console.log('test debugger', PREVIEW_MAP.SCREEN_ID_STYLE[curRecord.screen_type]);
		console.log('test debugger', styles);
		console.log('test debugger', styles[PREVIEW_MAP.SCREEN_ID_STYLE[curRecord.screen_type]]);

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
									<Button loading={loading} type="primary" onClick={() => this.search()}>
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
									<Upload
										{...{
											name: 'file',
											showUploadList: false,
											beforeUpload: (file) => {
												this.setState({
													uploadLoading: true
												});
												const isJson = file.type === 'application/json';
												if (!isJson) {
													this.setState({
														uploadLoading: false
													});
													message.error(formatMessage({id: 'esl.device.template.upload.file.type.error'}));
												}
												return false;
											},
											onChange: this.uploadJsonFileChange
										}}
									>
										<Button type="default" icon="upload" loading={uploadLoading} className={styles['btn-margin-left']}>
											{formatMessage({ id: 'esl.device.template.upload' })}
										</Button>
									</Upload>
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
							<div style={{float: 'right', cursor: 'pointer'}} onClick={this.toggleViewType}>
								<Icon type="appstore" style={{ fontSize: '20px' }} />
							</div>
						</div>
					</Form>
				</div>
				<div style={{ marginTop: '20px' }}>
					{
						viewType === 'table' ?
							<Table
								rowKey="id"
								loading={loading}
								columns={columns}
								dataSource={data}
								pagination={{
									...pagination,
									showTotal: total =>
										`${formatMessage({ id: 'esl.device.template.all' })}${total}${formatMessage({
											id: 'esl.device.template.total',
										})}`,
								}}
								onChange={this.onTableChange}
							/> :
							<PreviewList
								data={data}
								loading={loading}
								pagination={pagination}
								onEdit={this.editDetail}
								onApply={this.applyTemplate}
								onClone={this.showClone}
								onDelete={this.deleteTemplate}
								onChange={this.onTableChange}
								onPreview={this.previewTemplate}
							/>
					}
				</div>
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
											{formatMessage({id: type.name})}
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
											{formatMessage({id: type.name})}
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
							<Input value={formatedMessage(curRecord.screen_type_name)} disabled />
						</Form.Item>
						<Form.Item label={formatMessage({ id: 'esl.device.template.color' })}>
							<Input value={formatedMessage(curRecord.colour_name)} disabled />
						</Form.Item>
					</Form>
				</Modal>
				<Modal
					title={formatMessage({ id: 'esl.device.template.upload' })}
					visible={uploadVisible}
					onOk={this.handleUpload}
					onCancel={this.handleCancelUpload}
				>
					<Form {...formItemLayout} style={{ padding: 24 }}>
						<Form.Item label={formatMessage({ id: 'esl.device.template.upload.file' })}>
							<Input value={curRecord.fileName} disabled />
						</Form.Item>
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
							<Input value={formatedMessage(curRecord.screen_type_name)} disabled />
						</Form.Item>
						<Form.Item label={formatMessage({ id: 'esl.device.template.color' })}>
							<Input value={formatedMessage(curRecord.colour_name)} disabled />
						</Form.Item>
					</Form>
				</Modal>
				<Modal
					title={formatedMessage(curRecord.name)}
					width={PREVIEW_MAP.SCREEN_ID_WIDTH[curRecord.screen_type]}
					visible={previewVisible}
					onOk={this.handleCancelPreview}
					onCancel={this.handleCancelPreview}
					footer={[
						<Button type="primary" onClick={this.handleCancelPreview}>
							{formatMessage({ id: 'btn.confirm' })}
						</Button>
					]}
				>
					<div className={styles['preview-img']}>
						<img className={`${styles['wrap-img']} ${styles[PREVIEW_MAP.SCREEN_ID_STYLE[curRecord.screen_type]]}`} src={PREVIEW_MAP.SCREEN_ID_IMAGE[curRecord.screen_type]} alt="" />
						<img className={`${styles['content-img']} ${styles[PREVIEW_MAP.SCREEN_ID_STYLE[curRecord.screen_type]]}`} src={curRecord.address} alt="" />
					</div>
				</Modal>
			</div>
		);
	}
}

export default SearchResult;
