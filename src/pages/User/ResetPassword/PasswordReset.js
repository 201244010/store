import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Button } from 'antd';
import ResultInfo from '../../../components/ResultInfo';
import styles from './ResetPassword.less';
import { customValidate } from '../../../utils/customValidate';

@Form.create()
class PasswordReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetSuccess: false,
        };
    }

    onSubmit = () => {
        const {
            form: { validateFields },
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                // TODO 通过邮件重置密码的逻辑
                console.log(values);
            }
        });
    };

    render() {
        const { resetSuccess } = this.state;
        const {
            form: { getFieldDecorator, getFieldValue },
        } = this.props;

        return (
            <>
                {resetSuccess ? (
                    <ResultInfo
                        {...{
                            title: formatMessage({ id: 'reset.success' }),
                            description: formatMessage({ id: 'reset.countDown' }),
                            countInit: 3,
                        }}
                    />
                ) : (
                    <div className={styles['reset-wrapper']}>
                        <h4 className={styles['reset-title']}>
                            {formatMessage({ id: 'reset.title' })}
                        </h4>
                        <h4>{formatMessage({ id: 'reset.mail.account' })} xxxx@sunmi.com </h4>
                        <Form>
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
                                        type="password"
                                        size="large"
                                        placeholder={formatMessage({ id: 'confirm.placeholder' })}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" size="large" block onClick={this.onSubmit}>
                                    {formatMessage({ id: 'btn.confirm' })}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </>
        );
    }
}

export default PasswordReset;
