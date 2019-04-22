import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Modal } from 'antd';
import { customValidate } from '@/utils/customValidate';
import { FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import { encryption } from '@/utils/utils';
import { ERROR_OK } from '@/constants/errorCode';

@Form.create()
class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetPasswordSuccess: true,
        };
    }

    onOk = () => {
        const {
            form: { validateFields },
            onOk,
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                const options = {
                    ...values,
                    old_password: encryption(values.old_password),
                    new_password: encryption(values.new_password),
                };
                const response = await onOk(options);
                if (response && response.code !== ERROR_OK) {
                    this.setState(
                        {
                            resetPasswordSuccess: false,
                        },
                        () => validateFields(['old_password'], { force: true })
                    );
                } else {
                    this.setState({
                        resetPasswordSuccess: true,
                    });
                }
            }
        });
    };

    onCancel = () => {
        const { onCancel } = this.props;
        onCancel();
    };

    inputFocus = () => {
        this.setState({
            resetPasswordSuccess: true,
        });
    };

    render() {
        const { resetPasswordSuccess } = this.state;
        const {
            form: { getFieldDecorator, getFieldValue },
            visible,
        } = this.props;

        return (
            <Modal
                title={formatMessage({ id: 'change.password.title' })}
                visible={visible}
                maskClosable={false}
                destroyOnClose
                onOk={this.onOk}
                onCancel={this.onCancel}
            >
                <Form>
                    <Form.Item
                        {...FORM_ITEM_LAYOUT_COMMON}
                        label={formatMessage({ id: 'change.password.current' })}
                    >
                        {getFieldDecorator('old_password', {
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({
                                        id: 'current_password.validate.isEmpty',
                                    }),
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (resetPasswordSuccess) {
                                            callback();
                                        } else {
                                            callback(
                                                formatMessage({
                                                    id: 'change.password.current.fail',
                                                })
                                            );
                                        }
                                    },
                                },
                            ],
                        })(<Input type="password" onFocus={this.inputFocus} />)}
                    </Form.Item>
                    <Form.Item
                        {...FORM_ITEM_LAYOUT_COMMON}
                        label={formatMessage({ id: 'change.password.old' })}
                    >
                        {getFieldDecorator('new_password', {
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    validator: (rule, value, callback) =>
                                        customValidate({
                                            field: 'password',
                                            rule,
                                            value,
                                            callback,
                                            extra: {
                                                getFieldValue,
                                                compare: true,
                                                compareField: 'old_password',
                                                messageId: {
                                                    isEmpty: 'new_password.validate.isEmpty',
                                                    isFormatted:
                                                        'new_password.validate.isFormatted',
                                                },
                                            },
                                        }),
                                },
                            ],
                        })(<Input type="password" />)}
                    </Form.Item>
                    <Form.Item
                        {...FORM_ITEM_LAYOUT_COMMON}
                        label={formatMessage({ id: 'change.password.confirm' })}
                    >
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
                                                compareField: 'new_password',
                                            },
                                        }),
                                },
                            ],
                        })(<Input type="password" />)}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default ChangePassword;
