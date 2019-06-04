import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Button, Icon, Row, Col, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import { FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import styles from './DeviceUpgrade.less';

const UploadingInfo = () => (
	<div className={styles['info-content']}>
		<h3>{formatMessage({ id: 'esl.device.upload.uploading' })}</h3>
		<div className={styles['spin-wrapper']}>
			<Spin />
		</div>
	</div>
);

const UploadCommonError = ({ onCancel }) => (
	<div className={styles['info-content']}>
		<h3>
			{formatMessage({ id: 'esl.device.upload.fail' })}
			{formatMessage({ id: 'esl.device.upload.retry' })}
		</h3>
		<div>
			<Button type="primary" onClick={onCancel}>
				{formatMessage({ id: 'btn.know' })}
			</Button>
		</div>
	</div>
);

const UploadVersionLowerError = ({ uploadStatus }) => (
	<div className={styles['info-content']}>
		<h3>{formatMessage({ id: 'esl.device.upload.fail' })}</h3>
		<h3>{formatMessage({ id: 'esl.device.upload.version.low' })}</h3>
		<div>
			<Button type="primary" onClick={() => uploadStatus('init')}>
				{formatMessage({ id: 'btn.know' })}
			</Button>
		</div>
	</div>
);

const UploadVersionExistError = ({ uploadStatus }) => (
	<div className={styles['info-content']}>
		<h3>{formatMessage({ id: 'esl.device.upload.fail' })}</h3>
		<h3>{formatMessage({ id: 'esl.device.upload.version.exist' })}</h3>
		<div>
			<Button type="primary" onClick={() => uploadStatus('init')}>
				{formatMessage({ id: 'btn.know' })}
			</Button>
		</div>
	</div>
);

const UploadSuccess = ({ onCancel }) => (
	<div className={styles['info-content']}>
		<h3>{formatMessage({ id: 'esl.device.upload.success' })}</h3>
		<div className="info-btn">
			<Button type="primary" onClick={onCancel}>
				{formatMessage({ id: 'btn.know' })}
			</Button>
		</div>
	</div>
);

@Form.create()
class FirmwareUploadModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			version: null,
			file: {},
			fileList: [],
		};
	}

	confirmUpload = () => {
		const { onOk, form } = this.props;
		const { fileList } = this.state;
		form.validateFields((errors, values) => {
			if (!errors) {
				this.setState(
					{
						version: values.version,
						file: values.firmware.file,
						fileList: fileList.length > 1 ? [fileList] : [fileList.pop()],
					},
					() => onOk(values)
				);
			}
		});
	};

	onCancel = () => {
		const { onCancel } = this.props;
		this.setState(
			{
				version: null,
				file: {},
				fileList: [],
			},
			() => onCancel()
		);
	};

	render() {
		const {
			form: { getFieldDecorator, setFieldsValue },
			type,
			status,
			data,
			visible,
			uploadStatus,
		} = this.props;
		const { version, file, fileList } = this.state;

		const modalInit = {
			title: formatMessage({ id: 'list.action.upload.firmware' }),
			closable: true,
		};

		const modalUpload = {
			title: null,
			closable: false,
			footer: null,
		};

		const modalProps = status === 'init' ? modalInit : modalUpload;
		const acceptFileType = type === 'ESL' ? '.bin' : '.gz';
		const uploadProps = {
			accept: acceptFileType,
			beforeUpload: (uploadFile, uploadFileList) => {
				this.setState({
					file: uploadFile,
					fileList: uploadFileList,
				});
				return false;
			},
			onRemove: () => {
				this.setState(
					{
						file: {},
						fileList: [],
					},
					() => setFieldsValue({ firmware: { file: {}, fileList: [] } })
				);
			},
			fileList,
		};

		const statusComponent = {
			uploading: UploadingInfo,
			commonError: UploadCommonError,
			versionLower: UploadVersionLowerError,
			versionExist: UploadVersionExistError,
			success: UploadSuccess,
		};

		const RenderComponent = statusComponent[status];

		return (
			<Modal
				{...modalProps}
				maskClosable={false}
				visible={visible}
				onOk={this.confirmUpload}
				onCancel={this.onCancel}
				destroyOnClose
			>
				<div className={styles['custom-modal-wrapper']}>
					{status === 'init' ? (
						<Form {...{ ...FORM_ITEM_LAYOUT_COMMON }}>
							<Form.Item
								label={formatMessage({ id: 'esl.device.upload.device.model' })}
							>
								<span>{data.model}</span>
							</Form.Item>
							<Form.Item
								label={formatMessage({ id: 'esl.device.upload.device.version' })}
							>
								<Row gutter={5}>
									<Col span={8}>
										{getFieldDecorator('version', {
											initialValue: version,
											rules: [
												{
													required: true,
													message: formatMessage({
														id:
															'esl.device.upload.device.version.require',
													}),
												},
												{
													pattern: /^(0{1}|[1-9][0-9]{0,2})\.(0{1}|[1-9][0-9]{0,2})\.(0{1}|[1-9][0-9]{0,2})$/,
													message: formatMessage({
														id:
															'esl.device.upload.device.version.formatError',
													}),
												},
											],
										})(
											<Input
												placeholder={formatMessage({
													id: 'esl.device.upload.device.version.input',
												})}
												maxLength={11}
											/>
										)}
									</Col>
									<Col span={12}>
										<span className={styles['form-description']}>
											{formatMessage({
												id: 'esl.device.upload.device.version.notice',
											})}
										</span>
									</Col>
								</Row>
							</Form.Item>
							<Form.Item
								label={formatMessage({ id: 'esl.device.upload.device.bin.choice' })}
							>
								{getFieldDecorator('firmware', {
									initialValue: { file, fileList },
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'esl.device.upload.device.bin.require',
											}),
										},
										{
											validator: (rule, value, callback) => {
												if (Object.keys(value.file).length === 0) {
													callback(
														formatMessage({
															id:
																'esl.device.upload.device.bin.require',
														})
													);
												} else {
													const { name } = value.file;
													const fileType =
														`.${name.split('.').pop()}` || '';
													const typeList = acceptFileType.split(',');
													if (typeList.includes(fileType)) {
														callback();
													} else {
														callback(
															formatMessage({
																id:
																	'esl.device.upload.device.bin.error',
															})
														);
													}
												}
											},
										},
									],
								})(
									<Upload {...uploadProps}>
										<Button>
											<Icon type="upload" />
											{formatMessage({
												id: 'esl.device.upload.device.bin.notice',
											})}
										</Button>
									</Upload>
								)}
							</Form.Item>
						</Form>
					) : (
						<RenderComponent
							{...{
								onCancel: this.onCancel,
								uploadStatus,
							}}
						/>
					)}
				</div>
			</Modal>
		);
	}
}

export default FirmwareUploadModal;
