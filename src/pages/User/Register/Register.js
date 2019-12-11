import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Alert, Modal, message } from 'antd';
import { Result } from 'ant-design-pro';
import { connect } from 'dva';
import { formatMessage, getLocale } from 'umi/locale';
import Link from 'umi/link';
import ResultInfo from '@/components/ResultInfo';
import Captcha from '@/components/Captcha';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';
import { customValidate } from '@/utils/customValidate';
import { encryption } from '@/utils/utils';
import { ERROR_OK, ALERT_NOTICE_MAP, SHOW_VCODE, VCODE_ERROR } from '@/constants/errorCode';
import { MAIL_LIST } from '@/constants';
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
					{existedMail.length > 0 && (
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
			vcodeIsError: false,
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
				imgCode: getFieldValue('vcode') || '',
				key: needImgCaptcha ? imgCaptcha.key : '',
				width: 112,
				height: 40,
				fontSize: 18,
				...imageStyle,
			},
		});

		if (response && response.code === ERROR_OK) {
			message.success(formatMessage({ id: 'send.mobile.code.success' }));
			this.setState({
				trigger: true,
				notice: '',
				vcodeIsError: false,
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

	checkVcode = async () => {
		const {
			form: { setFieldsValue, validateFields },
		} = this.props;
		const response = await this.getCode();
		if (response && [SHOW_VCODE, VCODE_ERROR].includes(response.code)) {
			setFieldsValue({ vcode: '' });
			this.setState(
				{
					vcodeIsError: true,
				},
				() => validateFields(['vcode'], { force: true })
			);
		}
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
		validateFields(fields, async (err, values) => {
			if (!err) {
				const options = {
					...values,
					password: encryption(values.password),
				};

				const response = await register({ options });
				this.handleResponse(response);
			}
		});
	};

	render() {
		const {
			form: { getFieldDecorator, getFieldValue },
			sso: { imgCaptcha },
			loading
		} = this.props;
		const { notice, registerSuccess, trigger, vcodeIsError, showImgCaptchaModal } = this.state;
		const currentLanguage = getLocale();
		return (
			<div className={styles['register-wrapper']}>
				{registerSuccess ? (
					<>
						{currentLanguage === 'zh-CN' ? (
							<ResultInfo
								{...{
									title: formatMessage({ id: 'register.success' }),
									description: formatMessage({ id: 'register.countDown' }),
									countInit: 3,
								}}
							/>
						) : (
							<MailRegisterSuccess props={{ mail: getFieldValue('username') }} />
						)}
					</>
				) : (
					<>
						<h3>{formatMessage({ id: 'register.title' })}</h3>
						<Form className={styles['register-form']}>
							{notice && (
								<Form.Item>
									<Alert
										message={formatMessage({ id: ALERT_NOTICE_MAP[notice] })}
										type="error"
										showIcon
									/>
								</Form.Item>
							)}
							{currentLanguage === 'zh-CN' ? (
								<>
									<Form.Item>
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
												addonBefore="+86"
												size="large"
												maxLength={11}
												placeholder={formatMessage({
													id: 'mobile.placeholder',
												})}
											/>
										)}
									</Form.Item>

									<Modal
										title={formatMessage({ id: 'safety.validate' })}
										visible={showImgCaptchaModal}
										maskClosable={false}
										onOk={this.checkVcode}
										onCancel={this.closeImgCaptchaModal}
									>
										<div>
											<p>{formatMessage({ id: 'vcode.input.notice' })}</p>
											<Form.Item>
												{getFieldDecorator('vcode', {
													validateTrigger: 'onBlur',
													rules: [
														{
															validator: (rule, value, callback) => {
																if (vcodeIsError) {
																	callback(
																		formatMessage({
																			id: 'vcode.input.error',
																		})
																	);
																} else if (
																	!vcodeIsError &&
																	!value
																) {
																	callback(
																		formatMessage({
																			id:
																				'code.validate.isEmpty',
																		})
																	);
																} else {
																	callback();
																}
															},
														},
													],
												})(
													<ImgCaptcha
														{...{
															imgUrl: imgCaptcha.url,
															inputProps: {
																maxLength: 4,
																size: 'large',
																placeholder: formatMessage({
																	id: 'vcode.placeholder',
																}),
															},
															initial: false,
															onFocus: () =>
																this.setState({
																	vcodeIsError: false,
																}),
														}}
													/>
												)}
											</Form.Item>
										</div>
									</Modal>

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
													inputProps: {
														maxLength: 4,
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
							) : (
								<Form.Item>
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
											placeholder={formatMessage({ id: 'mail.placeholder' })}
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
						</Form>
						<Row type="flex" justify="space-between" align="middle">
							<Col span={10}>
								<Button
									type="primary"
									loading={loading.effects['user/register']}
									size="large"
									block
									onClick={this.onSubmit}
								>
									{formatMessage({ id: 'btn.register' })}
								</Button>
							</Col>
							<Col span={8}>
								<Link to="/user/login">
									{formatMessage({ id: 'link.to.login' })}
								</Link>
							</Col>
						</Row>
					</>
				)}
			</div>
		);
	}
}

export default Register;
