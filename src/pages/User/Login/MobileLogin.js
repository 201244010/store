import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Alert, Icon, Input, message } from 'antd';
import { ALERT_NOTICE_MAP, ERROR_OK, SHOW_VCODE, VCODE_ERROR } from '@/constants/errorCode';
import Captcha from '@/components/Captcha';
import { cellphone } from '@/constants/regexp';
import ImgCaptchaModal from '@/components/Captcha/ImgCaptchaModal';
import styles from '@/pages/User/Login/Login.less';

class MobileLogin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showImgCaptchaModal: false,
			trigger: false,
		};
	}

	getCode = async (params = {}) => {
		const { imageStyle = {} } = params;
		const {
			form: { getFieldValue },
			sendCode,
			imgCaptcha,
			needImgCaptcha,
		} = this.props;

		const response = await sendCode({
			options: {
				username: getFieldValue('phone'),
				type: '2',
				imgCode: getFieldValue('vcode2') || '',
				key: needImgCaptcha ? imgCaptcha.key : '',
				width: 76,
				height: 30,
				fontSize: 16,
				...imageStyle,
			},
		});

		if (response && response.code === ERROR_OK) {
			message.success(formatMessage({ id: 'send.mobile.code.success' }));
			this.setState({
				trigger: true,
				showImgCaptchaModal: false,
			});
		} else if (response && !response.data) {
			if (Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)) {
				this.setState({
					trigger: false,
				});
			}
		} else if (response && [SHOW_VCODE, VCODE_ERROR].includes(response.code)) {
			this.setState({ showImgCaptchaModal: true });
		}

		return response;
	};

	refreshCode = async (params = {}) => {
		const { imageStyle = {} } = params;
		const {
			form: { getFieldValue },
			sendCode,
		} = this.props;

		const response = await sendCode({
			options: {
				username: getFieldValue('phone'),
				type: '2',
				imgCode: '',
				key: '',
				width: 76,
				height: 30,
				fontSize: 16,
				...imageStyle,
			},
		});

		return response;
	};

	closeImgCaptchaModal = () => {
		this.setState({ showImgCaptchaModal: false });
	};

	render() {
		const { trigger, showImgCaptchaModal } = this.state;
		const {
			form,
			form: { getFieldDecorator, getFieldValue },
			imgCaptcha,
			notice,
		} = this.props;

		return (
			<>
				{notice && (
					<Form.Item>
						<Alert
							message={formatMessage({
								id: ALERT_NOTICE_MAP[notice],
							})}
							type="error"
							showIcon
						/>
					</Form.Item>
				)}
				<Form.Item className={notice ? '' : `${styles['formItem-with-margin']}`}>
					{getFieldDecorator('phone', {
						validateTrigger: 'onBlur',
						rules: [
							{
								validator: (_, value, callback) => {
									if (!value) {
										callback(
											formatMessage({
												id: 'mobile.validate.isEmpty',
											})
										);
									}

									if (cellphone.test(value)) {
										callback();
									} else {
										callback(
											formatMessage({ id: 'username.invalid.character' })
										);
									}
								},
							},
						],
					})(
						<Input
							prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
							maxLength={11}
							size="large"
							autoComplete="off"
							placeholder={formatMessage({
								id: 'mobile.placeholder',
							})}
						/>
					)}
				</Form.Item>

				<ImgCaptchaModal
					{...{
						form,
						visible: showImgCaptchaModal,
						getCode: this.getCode,
						refreshCode: this.refreshCode,
						imgCaptcha,
						onCancel: this.closeImgCaptchaModal,
					}}
				/>

				<Form.Item>
					{getFieldDecorator('code', {
						validateTrigger: 'onBlur',
						rules: [
							{
								required: true,
								message: formatMessage({
									id: 'code.validate.isEmpty',
								}),
							},
						],
					})(
						<Captcha
							{...{
								trigger,
								validateTarget: getFieldValue('phone') || '',
								inputProps: {
									maxLength: 4,
									size: 'large',
									placeholder: formatMessage({
										id: 'mobile.code.placeholder',
									}),
								},
								buttonText: {
									initText: formatMessage({ id: 'btn.get.code' }),
									countText: formatMessage({
										id: 'countDown.unit.second',
									}),
								},
								onClick: this.getCode,
							}}
						/>
					)}
				</Form.Item>
			</>
		);
	}
}

export default MobileLogin;
