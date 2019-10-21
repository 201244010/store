import React, { Component } from 'react';
import { Modal, Form, Upload, Button, Icon, Row, Col, Spin } from 'antd';
import JSZip from 'jszip';
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

const UploadModelWrongError = ({ uploadStatus }) => (
	<div className={styles['info-content']}>
		<h3>{formatMessage({ id: 'esl.device.upload.fail' })}</h3>
		<h3>{formatMessage({ id: 'esl.device.upload.version.model.wrong' })}</h3>
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
		const { data, onOk, uploadStatus, form: { validateFields } } = this.props;
		const { version, fileList } = this.state;
		if (this.model && this.model.indexOf(data.model) === -1) {
			uploadStatus('modelError');
		} else {
			validateFields((errors, values) => {
				if (!errors) {
					this.setState(
						{
							version,
							file: values.firmware.file,
							fileList: fileList.length > 1 ? [fileList] : [fileList.pop()],
						},
						() => onOk({
							version,
							firmware: {
								file: this.uploadFile
							}
						})
					);
				}
			});
		}
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
		const uploadProps = {
			accept: '.zip',
			beforeUpload: async (uploadFile, uploadFileList) => {
				this.setState({
					file: uploadFile,
					fileList: uploadFileList,
				});
				const zip = await JSZip.loadAsync(uploadFile);
				zip.forEach(async (relativePath, zipEntry) => {
					if (relativePath.indexOf('.txt') > -1) {
						const contentStr = await zipEntry.async('text');
						const contentArr = contentStr.split(/[\s\n]/);
						if (contentArr && contentArr.length) {
							contentArr.forEach(item => {
								if (item.indexOf('model') > -1) {
									this.model = item;
								}
								if (item.indexOf('version') > -1) {
									this.setState({
										version: item.split('=')[1]
									});
								}
							});
						}
					}
					const fileType = type === 'ESL' ? 'bin' : 'gz';
					if (relativePath.indexOf(fileType) > -1) {
						const contentBlob = await zipEntry.async('blob');
						try {
							this.uploadFile = new File([contentBlob], relativePath.split('/')[1], {type: fileType});
						} catch (e) {
							// this workaround edge
							if (typeof window.navigator.msSaveBlob !== 'undefined') {
								window.navigator.msSaveBlob(contentBlob, relativePath.split('/')[1]);
								this.uploadFile = contentBlob;
							}
						}
					} else {
					    throw new Error('上传文件类型错误', relativePath, fileType);
					}
				});
				return false;
			},
			onRemove: () => {
				this.setState(
					{
						version: null,
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
			modelError: UploadModelWrongError,
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
							<Form.Item label={formatMessage({ id: 'esl.device.upload.device.model' })}>
								<span>{data.model}</span>
							</Form.Item>
							<Form.Item label={formatMessage({ id: 'esl.device.upload.device.bin.choice' })}>
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
															id: 'esl.device.upload.device.bin.require',
														})
													);
												} else {
													callback();
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
							<Form.Item label={formatMessage({ id: 'esl.device.upload.device.version' })}>
								<Row gutter={5}>
									<Col span={24}>
										<span>{version || formatMessage({ id: 'esl.device.upload.device.version.text' })}</span>
									</Col>
								</Row>
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
