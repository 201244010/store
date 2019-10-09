import React, { Component, Fragment } from 'react';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import ButtonIcon from './ButtonIcon';
import ZoomIcon from './ZoomIcon';
import { getLocationParam } from '@/utils/utils';
import { ERROR_OK } from '@/constants/errorCode';
import * as styles from './index.less';

export default class BoardHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			templateName: '',
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

	render() {
		const {
			state: { editing, templateName },
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
										<span className={styles['edit-content']}>{templateInfo.name}</span>
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
					{/* <ButtonIcon name="view" /> */}
					{/* <ButtonIcon name="history" /> */}
				</div>
			</Fragment>
		);
	}
}
