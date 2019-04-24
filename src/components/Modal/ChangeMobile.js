import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Modal, message } from 'antd';
import { FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import Captcha from '@/components/Captcha';
import { encryption } from '@/utils/utils';
import {
    ALERT_NOTICE_MAP,
    ERROR_OK,
    MOBILE_BINDED,
    SHOW_VCODE,
    USER_EXIST,
    USER_NOT_EXIST,
    VCODE_ERROR,
} from '@/constants/errorCode';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';

@Form.create()
class ChangeMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trigger: false,
            vcodeIsError: false,
            showImgCaptchaModal: false,
        };
    }

    closeImgCaptchaModal = () => {
        this.setState({ showImgCaptchaModal: false });
    };

    onOk = () => {
        const {
            form: { validateFields },
            mobileBinded,
            onOk,
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                const options = {
                    ...values,
                    password: encryption(values.password),
                };
                const response = await onOk(options);
                if (response && response.code === ERROR_OK) {
                    if (mobileBinded) {
                        message.success(formatMessage({ id: 'change.mobile.success' }));
                    } else {
                        message.success(formatMessage({ id: 'bind.mobile.success' }));
                    }
                } else if (response && response.code === MOBILE_BINDED) {
                    message.error(formatMessage({ id: 'mobile.binded' }));
                } else {
                    message.error(formatMessage({ id: 'change.mobile.fail' }));
                }
            }
        });
    };

    onCancel = () => {
        const { onCancel } = this.props;
        onCancel();
    };

    getCode = async (params = {}) => {
        const { imageStyle = {} } = params;
        const {
            form: { getFieldValue },
            sendCode,
            checkUserExist,
            sso: { needImgCaptcha, imgCaptcha },
        } = this.props;

        const checkUserResult = await checkUserExist({
            options: {
                username: getFieldValue('phone'),
            },
        });

        let optionType = '';
        if (checkUserResult && checkUserResult.code === USER_EXIST) {
            optionType = '2';
        } else if (checkUserResult && checkUserResult.code === USER_NOT_EXIST) {
            optionType = '1';
        } else {
            message.error(formatMessage({ id: 'change.mobile.number.error' }));
        }

        const response = await sendCode({
            options: {
                username: getFieldValue('phone'),
                type: optionType,
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
                vcodeIsError: false,
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

    render() {
        const { trigger, vcodeIsError, showImgCaptchaModal } = this.state;
        const {
            form: { getFieldDecorator },
            sso: { imgCaptcha },
            visible,
            mobileBinded = true,
        } = this.props;

        return (
            <Modal
                title={
                    mobileBinded
                        ? formatMessage({ id: 'change.mobile.title' })
                        : formatMessage({ id: 'bind.mobile.title' })
                }
                visible={visible}
                maskClosable={false}
                destroyOnClose
                onOk={this.onOk}
                onCancel={this.onCancel}
            >
                <Form>
                    <Form.Item
                        {...FORM_ITEM_LAYOUT_COMMON}
                        label={formatMessage({ id: 'change.loginPassword' })}
                    >
                        {getFieldDecorator('password', {
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'change.loginPassword.isEmpty' }),
                                },
                            ],
                        })(<Input type="password" maxLength={30} />)}
                    </Form.Item>
                    <Form.Item
                        {...FORM_ITEM_LAYOUT_COMMON}
                        label={
                            mobileBinded
                                ? formatMessage({ id: 'change.mobile.number.new' })
                                : formatMessage({ id: 'change.mobile.number' })
                        }
                    >
                        {getFieldDecorator('phone', {
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'mobile.validate.isEmpty' }),
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: formatMessage({ id: 'mobile.validate.isFormatted' }),
                                },
                            ],
                        })(<Input addonBefore="+86" maxLength={11} />)}
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
                                                        formatMessage({ id: 'vcode.input.error' })
                                                    );
                                                } else if (!vcodeIsError && !value) {
                                                    callback(
                                                        formatMessage({
                                                            id: 'code.validate.isEmpty',
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
                                            onFocus: () => this.setState({ vcodeIsError: false }),
                                        }}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </Modal>

                    <Form.Item
                        {...FORM_ITEM_LAYOUT_COMMON}
                        label={formatMessage({ id: 'change.mobile.code' })}
                    >
                        {getFieldDecorator('code', {
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'code.validate.isEmpty' }),
                                },
                            ],
                        })(
                            <Captcha
                                {...{
                                    trigger,
                                    inputProps: {
                                        maxLength: 4,
                                    },
                                    buttonProps: {
                                        block: true,
                                    },
                                    buttonText: {
                                        initText: formatMessage({ id: 'btn.get.code' }),
                                        countText: formatMessage({ id: 'countDown.unit' }),
                                    },
                                    onClick: this.getCode,
                                }}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default ChangeMobile;
