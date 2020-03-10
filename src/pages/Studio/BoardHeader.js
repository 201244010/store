import React, { Component, Fragment } from 'react';
import {Modal, message, Button} from 'antd';
import { formatMessage } from 'umi/locale';
import formatedMessage from '@/constants/templateNames';
import { getLocationParam } from '@/utils/utils';
import { ERROR_OK } from '@/constants/errorCode';
import { PREVIEW_MAP } from '@/constants/studio';
import ButtonIcon from './ButtonIcon';
import ZoomIcon from './ZoomIcon';
import * as styles from './index.less';

export default class BoardHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			templateName: '',
			previewVisible: false,
			imageUrl: ''
		};
	}

	componentDidMount() {
		document.addEventListener('click', this.handleConfirm);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleConfirm);
	}

	handleConfirm = e => {
		const { editing } = this.state;
		if (editing) {
			if (e.target.tagName.toUpperCase() !== 'INPUT') {
				this.handleConfirmChangeName();
			}
		}
	};

	toChangeName = e => {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		const { templateInfo } = this.props;

		this.setState({
			editing: true,
			templateName: templateInfo.name,
		});
	};

	handleChangeName = e => {
		e.persist();
		const newName = e.target.value;
		let len = 0;
		for (let i=0; i < newName.length; i++) {
			if (newName.charCodeAt(i) > 127 || newName.charCodeAt(i) === 94) {
				len += 2;
			} else {
				len++;
			}
		}
		if (len > 40) {
			message.warning(formatMessage({id: 'alert.template.name.too.long' }));
			return;
		}
		this.setState({
			templateName: newName,
		});
	};

	handleConfirmChangeName = async () => {
		const {
			props: { templateInfo, renameTemplate, fetchTemplateDetail },
			state: { templateName },
		} = this;
		if (!templateName) {
			message.warning(formatMessage({ id: 'alert.template.name.not.empty' }));
			return;
		}
		if (templateInfo.name !== templateName) {
			const response = await renameTemplate({
				template_id: getLocationParam('id'),
				name: templateName,
			});
			if (response && response.code === ERROR_OK) {
				fetchTemplateDetail({
					template_id: getLocationParam('id'),
				});
				this.setState({
					editing: false,
					templateName: '',
				});
			}
		} else {
			this.setState({
				editing: false,
				templateName: '',
			});
		}
	};

	closeModal = () => {
		this.setState({
			previewVisible: false,
		});
	};

	realTimePreview = async () => {
		const { templateInfo, componentsDetail, zoomScale, realTimePreview } = this.props;

		const newDetails = {};
		Object.keys(componentsDetail).forEach(key => {
			const detail = componentsDetail[key];
			if (detail.name) {
				newDetails[key] = {
					...detail,
					zoomScale,
				};
			}
		});

		const response = await realTimePreview({
			template_id: templateInfo.id,
			draft: newDetails,
		});

		this.setState({
			previewVisible: true,
			imageUrl: response.data.preview_addr
		});
	};

	render() {
		const {
			state: { editing, templateName, previewVisible, imageUrl },
			props: { templateInfo = {}, zoomScale, saveAsDraft, downloadAsDraft, zoomOutOrIn, preStep, nextStep },
		} = this;
		const studioType = getLocationParam('type');

		return (
			<Fragment>
				<div className={styles['left-actions']}>
					{
						studioType !== 'alone' ?
							<>
								<ButtonIcon name="save" onClick={saveAsDraft} />
								{/* <ButtonIcon name="check" /> */}
								<span />
							</> :
							<>
								<span />
								<span />
							</>
					}
					<ButtonIcon name="preStep" onClick={preStep} />
					<ButtonIcon name="nextStep" onClick={nextStep} />
				</div>
				<div className={styles['title-edit']}>
					{editing ? (
						<input
							type="text"
							className={styles['edit-input']}
							value={templateName}
							onChange={e => this.handleChangeName(e)}
						/>
					) : (
						<Fragment>
							{
								templateInfo.name ?
									<>
										<span className={styles['edit-content']}>{formatedMessage(templateInfo.name)}</span>
										<img
											className={styles['edit-img']}
											src={require('@/assets/studio/edit.svg')}
											onClick={this.toChangeName}
										/>
									</> :
									null
							}
						</Fragment>
					)}
				</div>
				<div className={styles['right-actions']}>
					<ZoomIcon zoomScale={zoomScale} zoomOutOrIn={zoomOutOrIn} />
					{/* <ButtonIcon name="wrapper" /> */}
					<ButtonIcon name="download" onClick={downloadAsDraft} />
					<ButtonIcon name="view" onClick={this.realTimePreview} />
					{/* <ButtonIcon name="history" /> */}
				</div>
				<Modal
					title={
						<div className={styles['preview-img-title']}>
							{formatedMessage(templateInfo.name)}
						</div>
					}
					width={PREVIEW_MAP.TYPE_NAME_WIDTH[templateInfo.screen_type_name]}
					visible={previewVisible}
					onCancel={() => this.closeModal()}
					onOk={() => this.closeModal()}
					footer={[
						<Button key="submit" type="primary" onClick={() => this.closeModal()}>
							{formatMessage({ id: 'btn.confirm' })}
						</Button>
					]}
				>
					<div className={styles['preview-img']}>
						<img className={`${styles['wrap-img']} ${styles[PREVIEW_MAP.TYPE_NAME_STYLE[templateInfo.screen_type_name]]}`} src={PREVIEW_MAP.TYPE_NAME_IMAGE[templateInfo.screen_type_name]} alt="" />
						<img className={`${styles['content-img']} ${styles[PREVIEW_MAP.TYPE_NAME_STYLE[templateInfo.screen_type_name]]}`} src={imageUrl} alt="" />
					</div>
				</Modal>
			</Fragment>
		);
	}
}
