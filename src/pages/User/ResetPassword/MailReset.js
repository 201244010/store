import React, { Component } from 'react';
import { formatMessage, getLocale } from 'umi/locale';
import { Form, Input, Button, Alert } from 'antd';
import { connect } from 'dva';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';
import { Result } from 'ant-design-pro';
import * as RegExp from '@/constants/regexp';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';
import { MAIL_LIST } from '@/constants';
import styles from './ResetPassword.less';

const MailActive = ({ mail }) => {
	const mailTail = mail
		? mail
			.split('@')
			.slice(1)
			.toString()
		: '';
	const existedMail = Object.keys(MAIL_LIST).find(mailKey => mailKey === mailTail);

	return (
		<Result
			className={styles['result-wrapper']}
			type="success"
			description={
				<div className={styles['result-content']}>
					{formatMessage({ id: 'reset.mail.notice' })}
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
					<Button
						type="default"
						size="large"
						href="/user/login"
						style={{ marginLeft: existedMail.length > 0 ? '20px' : 0 }}
					>
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
	}),
	dispatch => ({
		getImageCode: () => dispatch({ type: 'sso/getImageCode' }),
		sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
		checkImgCode: payload => dispatch({ type: 'user/checkImgCode', payload }),
		sendRecoveryEmail: options =>
			dispatch({ type: 'user/sendRecoveryEmail', payload: { options } }),
	})
)
@Form.create()
class MailReset extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notice: '',
			resetSuccess: false,
		};
	}

	checkImgCode = async values => {
		const {
			checkImgCode,
			sso: { imgCode },
		} = this.props;
		const response = await checkImgCode({
			options: {
				...values,
				...imgCode,
			},
		});
		return response;
	};

	handleResponse = response => {
		const {
			form: { setFields, getFieldValue },
			getImageCode,
		} = this.props;
		if (response && response.code === ERROR_OK) {
			this.setState({
				resetSuccess: true,
			});
		} else if (Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)) {
			setFields({
				email: {
					value: getFieldValue('email'),
					errors: [new Error(formatMessage({ id: ALERT_NOTICE_MAP[response.code] }))],
				},
			});
			getImageCode();
		}
	};

	onSubmit = () => {
		const {
			form: { validateFields, setFields },
			getImageCode,
			sendRecoveryEmail,
		} = this.props;
		validateFields(async (err, values) => {
			if (!err) {
				const currentLan = getLocale() || 'zh-CN';
				const result = await this.checkImgCode(values);
				if (result && result.code === ERROR_OK) {
					const response = await sendRecoveryEmail({
						...values,
						country_code: currentLan === 'zh-CN' ? 1 : 2,
					});
					this.handleResponse(response);
				} else if (Object.keys(ALERT_NOTICE_MAP).includes(`${result.code}`)) {
					setFields({
						code: {
							value: null,
							errors: [
								new Error(formatMessage({ id: ALERT_NOTICE_MAP[result.code] })),
							],
						},
					});
					getImageCode();
				}
			}
		});
	};

	render() {
		const { notice, resetSuccess } = this.state;
		const {
			form: { getFieldDecorator, getFieldValue },
			sso: { imgCode },
			getImageCode,
		} = this.props;

		return (
			<>
				{resetSuccess ? (
					<MailActive mail={getFieldValue('email') || null} />
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
								{getFieldDecorator('email', {
									validateTrigger: 'onBlur',
									rules: [
										{
											required: true,
											message: formatMessage({ id: 'mail.validate.isEmpty' }),
										},
										{
											pattern: RegExp.mail,
											message: formatMessage({
												id: 'mail.validate.isFormatted',
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
							<Form.Item>
								{getFieldDecorator('code')(
									<ImgCaptcha
										{...{
											imgUrl: imgCode.url,
											inputProps: {
												size: 'large',
												placeholder: formatMessage({
													id: 'vcode.placeholder',
												}),
											},
											getImageCode,
											refreshCode: getImageCode,
										}}
									/>
								)}
							</Form.Item>
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
			</>
		);
	}
}

export default MailReset;
