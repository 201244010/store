import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Alert, Icon, Input } from 'antd';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';
import { ALERT_NOTICE_MAP } from '@/constants/errorCode';
import { mail, cellphone, normalInput } from '@/constants/regexp';
import styles from '@/pages/User/Login/Login.less';

const AccountLogin = props => {
	const {
		form: { getFieldDecorator },
		getImageCode,
		imgCode,
		notice,
		errorTimes,
	} = props;

	return (
		<>
			{notice && (
				<Form.Item className={styles['formItem-margin-clear']}>
					<Alert
						message={formatMessage({ id: ALERT_NOTICE_MAP[notice] })}
						type="error"
						showIcon
					/>
				</Form.Item>
			)}
			{/* 解决密码自动填充的问题 */}
			<input type="password" style={{ display: 'none' }} />
			<Form.Item className={notice ? '' : `${styles['formItem-with-margin']}`}>
				{getFieldDecorator('username', {
					validateTrigger: 'onBlur',
					rules: [
						{
							validator: (_, value, callback) => {
								if (!value) {
									callback(
										formatMessage({
											id: 'account.validate.isEmpty',
										})
									);
								}

								if (cellphone.test(value) || mail.test(value)) {
									callback();
								}

								if (!normalInput.test(value)) {
									callback(formatMessage({ id: 'username.invalid.character' }));
								}

								callback();
							},
						},
					],
				})(
					<Input
						prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
						size="large"
						autoComplete="off"
						placeholder={formatMessage({
							id: 'account.account.placeholder',
						})}
					/>
				)}
			</Form.Item>
			<Form.Item>
				{getFieldDecorator('password', {
					validateTrigger: 'onBlur',
					rules: [
						{
							required: true,
							message: formatMessage({
								id: 'account.password.validate.isEmpty',
							}),
						},
					],
				})(
					<Input
						type="password"
						prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
						maxLength={30}
						size="large"
						autoComplete="new-password"
						placeholder={formatMessage({
							id: 'account.password.placeholder',
						})}
					/>
				)}
			</Form.Item>
			{errorTimes > 2 && (
				<Form.Item>
					{getFieldDecorator('vcode', {
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
						<ImgCaptcha
							{...{
								imgUrl: imgCode.url,
								inputProps: {
									size: 'large',
									placeholder: formatMessage({
										id: 'vcode.placeholder',
									}),
								},
								refreshCode: getImageCode,
								getImageCode,
							}}
						/>
					)}
				</Form.Item>
			)}
		</>
	);
};

export default AccountLogin;
