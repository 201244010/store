import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Button, Alert } from 'antd';
import { connect } from 'dva';
import { Result } from 'ant-design-pro';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';
import * as RegExp from '@/constants/regexp';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';
import styles from './ResetPassword.less';

const MailActive = () => (
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
				<Button type="primary" size="large">
					{formatMessage({ id: 'btn.mail.check' })}
				</Button>
				<Button type="default" size="large" href="/user/login">
					{formatMessage({ id: 'btn.back.index' })}
				</Button>
			</div>
		}
	/>
);

@connect(
	state => ({
		user: state.user,
		sso: state.sso,
	}),
	dispatch => ({
		getImageCode: () => dispatch({ type: 'sso/getImageCode' }),
		sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
		checkImgCode: payload => dispatch({ type: 'user/checkImgCode', payload }),
	}),
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
		if (response && response.code === ERROR_OK) {
			this.setState({
				resetSuccess: true,
			});
		}
	};

	onSubmit = () => {
		const {
			form: { validateFields },
		} = this.props;
		validateFields(async (err, values) => {
			if (!err) {
				const result = await this.checkImgCode(values);
				if (result && result.code === ERROR_OK) {
					// TODO 发送重置邮件的接口要等
					// const response = await resetPassword({ options: values });
					// this.handleResponse(response);
				}
			}
		});
	};

	render() {
		const { notice, resetSuccess } = this.state;
		const {
			form: { getFieldDecorator },
			sso: { imgCode },
			getImageCode,
		} = this.props;

		return (
			<>
				{resetSuccess ? (
					<MailActive />
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
									/>,
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
										}}
									/>,
								)}
							</Form.Item>
						</Form>
						<div className={styles['reset-footer']}>
							<Button
								className={
									`${styles['primary-btn']}
									${styles['reset-confirm-btn']}`
								}
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
