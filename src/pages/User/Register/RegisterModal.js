import React, { Component } from 'react';
import { Form, Input, Button, Alert, Modal, message } from 'antd';
import { Result } from 'ant-design-pro';
import { formatMessage, getLocale } from 'umi/locale';
import { connect } from 'dva';
import ResultInfo from '@/components/ResultInfo';
import Captcha from '@/components/Captcha';
import ImgCaptchaModal from '@/components/Captcha/ImgCaptchaModal';
import { customValidate } from '@/utils/customValidate';
import { encryption } from '@/utils/utils';
import * as RegExp from '@/constants/regexp';
import { ERROR_OK, ALERT_NOTICE_MAP, SHOW_VCODE, VCODE_ERROR } from '@/constants/errorCode';
import { MAIL_LIST } from '@/constants';
import { env } from '@/config';
import styles from './Register.less';

const MailRegisterSuccess = ({ props }) => {
	const { mail } = props;
	const mailTail =
		mail
			.split('@')
			.slice(1)
			.toString() || '';
	const existedMail = Object.keys(MAIL_LIST).find(mailKey => mailKey === mailTail);

	return (
		<Result
			className={styles['result-wrapper']}
			type="success"
			title={
				<div className={styles['result-title']}>
					{formatMessage({ id: 'register.account' })}
					{mail}
					{formatMessage({ id: 'register.mail.success' })}
				</div>
			}
			description={
				<div className={styles['result-content']}>
					{formatMessage({ id: 'register.mail.notice' })}
				</div>
			}
			actions={
				<div className={styles['result-action-wrapper']}>
					{existedMail && existedMail.length > 0 && (
						<Button
							type="primary"
							size="large"
							href={MAIL_LIST[mailTail]}
							target="_blank"
						>
							{formatMessage({ id: 'btn.mail.check' })}
						</Button>
					)}
					<Button type="default" size="large" href="/user/login">
						{formatMessage({ id: 'btn.back.index' })}
					</Button>
				</div>
			}
		/>
	);
};

@connect(
	state => ({
		user: state.user,
		sso: state.sso,
		loading: state.loading,
	}),
	dispatch => ({
		register: payload => dispatch({ type: 'user/register', payload }),
		sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
	})
)
@Form.create()
class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notice: '',
			registerSuccess: false,
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
			sendCode,
			sso: { needImgCaptcha, imgCaptcha },
		} = this.props;

		const response = await sendCode({
			options: {
				username: getFieldValue('username'),
				type: '1',
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
				type: '1',
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

	handleResponse = response => {
		if (response && response.code === ERROR_OK) {
			this.setState({
				registerSuccess: true,
			});
		} else if (response && Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)) {
			this.setState({
				notice: response.code,
				registerSuccess: false,
			});
		}
	};

	onSubmit = () => {
		const {
			form: { validateFields },
			register,
		} = this.props;
		const fields = ['username', 'code', 'password', 'confirm'];
		const currentLanguage = getLocale();
		validateFields(fields, async (err, values) => {
			if (!err) {
				const options = {
					...values,
					password: encryption(values.password),
					countryCode: currentLanguage === 'zh-CN' ? 1 : 2,
				};

				const response = await register({ options });
				this.handleResponse(response);
			}
		});
	};

	onCancelHandler = () => {
		const { onCancel } = this.props;
		this.setState({
			registerSuccess: false,
		});
		onCancel();
	}

	render() {
		const {
			form,
			form: { getFieldDecorator, getFieldValue },
			sso: { imgCaptcha },
			visible,
			loading,
			// onCancel,
		} = this.props;
		const { location } = window;
		const { notice, registerSuccess, trigger, showImgCaptchaModal } = this.state;
		const currentLanguage = getLocale();

		return (
			<Modal
				visible={visible}
				width={400}
				closable={false}
				maskClosable={false}
				title={null}
				footer={null}
				onCancel={this.onCancelHandler}
				wrapClassName={styles['register-modal-wrapper']}
				destroyOnClose
			>
				<div className={styles['custom-modal-wrapper']}>
					<div className={styles['custom-modal-header']}>
						<div className={styles['close-icon']} onClick={this.onCancelHandler} />
					</div>
					<div className={styles['custom-modal-content']}>
						{registerSuccess ? (
							<>
								{currentLanguage === 'zh-CN' ? (
									<ResultInfo
										{...{
											title: formatMessage({ id: 'register.success' }),
											description: formatMessage({
												id: 'register.countDown',
											}),
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
									<MailRegisterSuccess
										props={{ mail: getFieldValue('username') }}
									/>
								)}
							</>
						) : (
							<>
								<h1 className={styles['register-title']}>
									{formatMessage({ id: 'register.title' })}
								</h1>
								<Form className={styles['register-form']}>
									{notice && (
										<Form.Item className={styles['formItem-margin-clear']}>
											<Alert
												message={formatMessage({
													id: ALERT_NOTICE_MAP[notice],
												})}
												type="error"
												showIcon
											/>
										</Form.Item>
									)}
									{currentLanguage === 'zh-CN' ? (
										<>
											<Form.Item
												className={
													notice
														? ''
														: `${styles['formItem-with-margin']}`
												}
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
															pattern: RegExp.phone,
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
														placeholder={formatMessage({
															id: 'mobile.placeholder',
														})}
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
																	validateTarget:
																		getFieldValue('username') ||
																		'',
																	inputProps: {
																		maxLength: 4,
																		size: 'large',
																		placeholder: formatMessage({
																			id:
																				'mobile.code.placeholder',
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
										</>
									) : (
										<Form.Item
											className={
												notice ? '' : `${styles['formItem-with-margin']}`
											}
										>
											{getFieldDecorator('username', {
												validateTrigger: 'onBlur',
												rules: [
													{
														validator: (rule, value, callback) =>
															customValidate({
																field: 'mail',
																rule,
																value,
																callback,
															}),
													},
												],
											})(
												<Input
													size="large"
													placeholder={formatMessage({
														id: 'mail.placeholder',
													})}
												/>
											)}
										</Form.Item>
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
												placeholder={formatMessage({
													id: 'password.placeholder',
												})}
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
												placeholder={formatMessage({
													id: 'confirm.placeholder',
												})}
											/>
										)}
									</Form.Item>
								</Form>
								<div className={styles['register-footer']}>
									<Button
										className={`${styles['primary-btn']}
											${styles['footer-btn']}`}
										type="primary"
										size="large"
										block
										loading={loading.effects['user/register']}
										onClick={this.onSubmit}
									>
										{formatMessage({ id: 'btn.register' })}
									</Button>
									<div className={styles['footer-link']}>
										<a
											className={styles['footer-link']}
											href="javascript:void(0);"
											onClick={this.onCancelHandler}
										>
											{formatMessage({ id: 'link.to.login' })}
										</a>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</Modal>
		);
	}
}

export default Register;
