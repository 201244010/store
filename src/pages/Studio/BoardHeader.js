import React, { Component, Fragment } from 'react';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import ButtonIcon from './ButtonIcon';
import ZoomIcon from './ZoomIcon';
import { getLocationParam } from '@/utils/utils';
import { preStep, nextStep } from '@/utils/studio';
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

	preStep = async () => {
		const { props: { changeOneStep } } = this;
		const result = await preStep(getLocationParam('id'));
		if (result) {
			changeOneStep(JSON.parse(result));
		}
	};

	nextStep = async () => {
		const { props: { changeOneStep } } = this;
		const result = await nextStep(getLocationParam('id'));
		if (result) {
			changeOneStep(JSON.parse(result));
		}
	};

	render() {
		const {
			state: { editing, templateName },
			props: { templateInfo = {}, zoomScale, saveAsDraft, zoomOutOrIn },
		} = this;

		return (
			<Fragment>
				<div className={styles['left-actions']}>
					<ButtonIcon name="save" onClick={saveAsDraft} />
					{/* <ButtonIcon name="check" /> */}
					<span />
					<ButtonIcon name="preStep" onClick={this.preStep} />
					<ButtonIcon name="nextStep" onClick={this.nextStep} />
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
									<span className={styles['edit-content']}>{formatMessage({id: templateInfo.name })}</span> :
									null
							}
							<img
								className={styles['edit-img']}
								src={require('@/assets/studio/edit.svg')}
								onClick={this.toChangeName}
							/>
						</Fragment>
					)}
				</div>
				<div className={styles['right-actions']}>
					<ZoomIcon zoomScale={zoomScale} zoomOutOrIn={zoomOutOrIn} />
					{/* <ButtonIcon name="wrapper" /> */}
					{/* <ButtonIcon name="view" /> */}
					{/* <ButtonIcon name="history" /> */}
				</div>
			</Fragment>
		);
	}
}
