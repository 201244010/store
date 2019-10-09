import React, {Component} from 'react';
import {Card, Button, Input, Select, Modal, Form, message, Upload} from 'antd';
import {connect} from 'dva';
import {formatMessage} from 'umi/locale';
import styles from './index.less';

const { Option } = Select;

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

const COLOR_NAME = {
	BWR: formatMessage({ id: 'esl-template-colour-BWR' }),
	BW: formatMessage({ id: 'esl-template-colour-BW' }),
};
const COLOR_TYPE = {
	'BW': 3,
	'BWR': 7
};
const SCREEN_NAME = {
	'2.13': formatMessage({ id: 'esl-screen-2.13' }),
	'2.6': formatMessage({ id: 'esl-screen-2.13' }),
	'4.2': formatMessage({ id: 'esl-screen-4.2' }),
};
const SCREEN_TYPE = {
	'2.13': 1,
	'2.6': 2,
	'4.2': 3,
};

function createRandomId() {
	return `${Math.random().toString().substr(2, 5)}`;
}

@connect(
	state => ({
		template: state.template,
	}),
	dispatch => ({
		fetchScreenTypes: payload => dispatch({ type: 'template/fetchScreenTypes', payload }),
		fetchColors: payload => dispatch({ type: 'template/fetchColors', payload }),
	})
)
@Form.create()
class Guide extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newVisible: false,
			uploadVisible: false,
			uploadLoading: false,
			curRecord: {}
		};
	}

	componentDidMount() {
		const { fetchScreenTypes, fetchColors } = this.props;

		fetchScreenTypes();
		fetchColors({ screen_type: -1 });
	}

	handleOkNew = () => {
		const {
			props: {
				form: { validateFields, resetFields }
			},
		} = this;
		validateFields(async (errors, values) => {
			if (!errors) {
				this.setState(
					{
						newVisible: false,
					},
					() => {
						resetFields();
						const templateId = createRandomId();
						localStorage.setItem(templateId, JSON.stringify({
							id: templateId,
							screen_type_name: values.screen_type,
							colour_name: values.colour,
							model_name: '',
							studio_info: JSON.stringify({})
						}));
						window.open(`/studio?type=alone&id=${templateId}&screen=${values.screen_type}&color=${values.colour}`);
					}
				);
			}
		});
	};

	showModal = (type) => {
		this.setState({
			[`${type}Visible`]: true,
		});
	};

	hideModal = (type) => {
		const {
			props: {
				form: { resetFields }
			},
		} = this;
		this.setState({
			[`${type}Visible`]: false,
			uploadLoading: false,
			curRecord: {}
		});
		resetFields();
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
			const studioInfo = JSON.parse(fileString);
			if (!studioInfo || !studioInfo.type) {
				message.warning(formatMessage({id: 'esl.device.template.action.upload.file.error'}));
				return;
			}

			const typeArr = studioInfo.type.split('-');
			this.setState({
				curRecord: {
					...curRecord,
					screen_type: typeArr[1],
					colour: typeArr[0],
					studioInfo
				}
			});
		};
	};

	handleUpload = () => {
		const {
			props: {form: {resetFields}},
			state: {curRecord}
		} = this;
		const templateId = createRandomId();
		localStorage.setItem(templateId, JSON.stringify({
			id: templateId,
			screen_type_name: curRecord.screen_type,
			colour_name: curRecord.colour,
			model_name: '',
			studio_info: JSON.stringify(curRecord.studioInfo)
		}));
		window.open(`/studio?type=alone&id=${templateId}&screen=${SCREEN_TYPE[curRecord.screen_type]}&color=${COLOR_TYPE[curRecord.colour]}`);

		this.setState({
			uploadVisible: false,
			uploadLoading: false
		});
		resetFields();
	};

	render() {
		const {
			props: {
				template: {screenTypes, colors},
				form: { getFieldDecorator },
				fetchColors,
			},
			state: {newVisible, uploadVisible, uploadLoading, curRecord}
		} = this;

		return (
			<div className={styles['guide-wrap']}>
				<h1 className={styles.title}>商米价签模板Studio</h1>
				<Card>
					<Button
						className={styles.mb24}
						type="primary"
						icon="plus"
						size="large"
						block
						onClick={() => this.showModal('new')}
					>
						{formatMessage({ id: 'esl.device.template.new' })}
					</Button>
					<Upload
						{...{
							className: styles.upload,
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
						<Button
							type="primary"
							icon="upload"
							size="large"
							block
							loading={uploadLoading}
						>
							{formatMessage({ id: 'esl.device.template.upload' })}
						</Button>
					</Upload>
				</Card>
				<Modal
					title={formatMessage({ id: 'esl.device.template.new' })}
					visible={newVisible}
					onOk={this.handleOkNew}
					onCancel={() => this.hideModal('new')}
				>
					<Form {...formItemLayout} style={{ padding: 24 }}>
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
									{(screenTypes || []).map(type => (
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
									{(colors || []).map(type => (
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
					title={formatMessage({ id: 'esl.device.template.upload' })}
					visible={uploadVisible}
					onOk={this.handleUpload}
					onCancel={() => this.hideModal('upload')}
				>
					<Form {...formItemLayout} style={{ padding: 24 }}>
						<Form.Item label={formatMessage({ id: 'esl.device.template.upload.file' })}>
							<Input value={curRecord.fileName} disabled />
						</Form.Item>
						<Form.Item label={formatMessage({ id: 'esl.device.template.size' })}>
							<Input value={SCREEN_NAME[curRecord.screen_type]} disabled />
						</Form.Item>
						<Form.Item label={formatMessage({ id: 'esl.device.template.color' })}>
							<Input value={COLOR_NAME[curRecord.colour]} disabled />
						</Form.Item>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default Guide;

