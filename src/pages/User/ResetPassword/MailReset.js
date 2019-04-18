import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Button, Alert } from 'antd';
import { connect } from 'dva';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';
import { Result } from 'ant-design-pro';
import * as RegExp from '@/constants/regexp';
import styles from '../Register/Register.less';
import { ERROR_OK } from '@/constants/errorCode';

// TODO 根据 error code 显示不同的错误信息，等待 error code
const ALERT_NOTICE_MAP = {
    '208': 'alert.vcode.error',
    '001': 'alert.mail.not.registered',
};

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
                    <Form>
                        {notice && (
                            <Form.Item>
                                <Alert
                                    message={formatMessage({ id: ALERT_NOTICE_MAP[notice] })}
                                    type="error"
                                    showIcon
                                />
                            </Form.Item>
                        )}
                        <Form.Item>
                            {getFieldDecorator('username', {
                                validateTrigger: 'onBlur',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({ id: 'mail.validate.isEmpty' }),
                                    },
                                    {
                                        pattern: RegExp.mail,
                                        message: formatMessage({ id: 'mail.validate.isFormatted' }),
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
                                        },
                                        getImageCode,
                                    }}
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" size="large" block onClick={this.onSubmit}>
                                {formatMessage({ id: 'btn.confirm' })}
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </>
        );
    }
}

export default MailReset;
