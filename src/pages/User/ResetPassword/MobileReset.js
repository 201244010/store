import React, { Component } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import Captcha from '@/components/Captcha';
import ImgCaptchaModal from '@/components/Captcha/ImgCaptchaModal';
import ResultInfo from '@/components/ResultInfo';
import { customValidate } from '@/utils/customValidate';
import { encryption } from '@/utils/utils';
import { ERROR_OK, SHOW_VCODE, VCODE_ERROR, ALERT_NOTICE_MAP } from '@/constants/errorCode';
import { env } from '@/config';
import styles from './ResetPassword.less';

@connect(
	state => ({
		user: state.user,
		sso: state.sso,
	}),
	dispatch => ({
		resetPassword: payload => dispatch({ type: 'user/resetPassword', payload }),
		sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
	})
)
@Form.create()
class MobileReset extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resetSuccess: false,
			notice: '',
			trigger: false,
			showImgCaptchaModal: false,
		};
	}

	closeImgCaptchaModal = () => {
		this.setState({ showImgCaptchaModal: false });
	};

	getCode = async (params = {}) => {
		const { imageStyle = {} } = params;
		const {
			form: { getFieldValue },
			sso: { needImgCaptcha, imgCaptcha },
			sendCode,
		} = this.props;

		const response = await sendCode({
			options: {
				username: getFieldValue('username'),
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
				notice: '',
				showImgCaptchaModal: false,
			});
		} else if (response && !response.data) {
			if (Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)) {
				this.setState({
					trigger: false,
					notice: response.code,
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
				username: getFieldValue('username'),
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

	onSubmit = () => {
		const {
			form: { validateFields },
			resetPassword,
		} = this.props;
		const fields = ['username', 'code', 'password', 'confirm'];

		validateFields(fields, async (err, values) => {
			if (!err) {
				const options = {
					...values,
					password: encryption(values.password),
				};

				const response = await resetPassword({ options });
				if (response && response.code === ERROR_OK) {
					this.setState({
						resetSuccess: true,
					});
				} else if (Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)) {
					this.setState({
						notice: response.code,
					});
				}
			}
		});
	};

	render() {
		const {
			form,
			form: { getFieldDecorator, getFieldValue },
			sso: { imgCaptcha },
		} = this.props;
		const { location } = window;
		const { resetSuccess, notice, trigger, showImgCaptchaModal } = this.state;

		return (
			<div className={styles['register-wrapper']}>
				{resetSuccess ? (
					<ResultInfo
						{...{
							status: 'success',
							title: formatMessage({ id: 'reset.success' }),
							description: formatMessage({ id: 'reset.countDown' }),
							countInit: 3,
							countDone: () => location.reload(),
							CustomIcon: () => (
								<div
									className={styles['success-icon']}
									style={{
										width: '80px',
										height: '80px',
										margin: '0 auto',
									}}
								/>
							),
						}}
					/>
				) : (
					<>
						<h1 className={styles['reset-title']}>
							{formatMessage({ id: 'reset.title' })}
						</h1>
						<Form className={styles['register-form']}>
							{notice && (
								<Form.Item className={styles['formItem-margin-clear']}>
									<Alert
										message={formatMessage({ id: ALERT_NOTICE_MAP[notice] })}
										type="error"
										showIcon
									/>
								</Form.Item>
							)}
							<Form.Item
								className={notice ? '' : `${styles['formItem-with-margin']}`}
							>
								{getFieldDecorator('username', {
									validateTrigger: 'onBlur',
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'mobile.validate.isEmpty',
											}),
										},
										{
											pattern: /^1\d{10}$/,
											message: formatMessage({
												id: 'mobile.validate.isFormatted',
											}),
										},
									],
								})(
									<Input
										size="large"
										maxLength={11}
										autoComplete="off"
										placeholder={formatMessage({ id: 'mobile.placeholder' })}
									/>
								)}
							</Form.Item>
							{env !== 'local' && (
								<>
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
													validateTarget: getFieldValue('username') || '',
													inputProps: {
														size: 'large',
														placeholder: formatMessage({
															id: 'mobile.code.placeholder',
														}),
													},
													buttonProps: {
														size: 'large',
														block: true,
													},
													buttonText: {
														initText: formatMessage({
															id: 'btn.get.code',
														}),
														countText: formatMessage({
															id: 'countDown.unit',
														}),
													},
													onClick: this.getCode,
												}}
											/>
										)}
									</Form.Item>
								</>
							)}

							<Form.Item>
								{getFieldDecorator('password', {
									validateTrigger: 'onBlur',
									rules: [
										{
											validator: (rule, value, callback) =>
												customValidate({
													field: 'password',
													rule,
													value,
													callback,
												}),
										},
									],
								})(
									<Input
										maxLength={30}
										type="password"
										size="large"
										placeholder={formatMessage({ id: 'password.placeholder' })}
									/>
								)}
							</Form.Item>
							<Form.Item>
								{getFieldDecorator('confirm', {
									validateTrigger: 'onBlur',
									rules: [
										{
											validator: (rule, value, callback) =>
												customValidate({
													field: 'confirm',
													rule,
													value,
													callback,
													extra: {
														getFieldValue,
													},
												}),
										},
									],
								})(
									<Input
										maxLength={30}
										type="password"
										size="large"
										placeholder={formatMessage({ id: 'confirm.placeholder' })}
									/>
								)}
							</Form.Item>
							<Form.Item />
						</Form>
						<div className={styles['reset-footer']}>
							<Button
								className={`${styles['primary-btn']}
									${styles['reset-confirm-btn']}`}
								type="primary"
								size="large"
								block
								onClick={this.onSubmit}
							>
								{formatMessage({ id: 'btn.confirm' })}
							</Button>
						</div>
					</>
				)}
			</div>
		);
	}
}

export default MobileReset;
