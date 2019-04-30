import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Modal, Icon, Button } from 'antd';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';
import styles from './captcha.less';
import { SHOW_VCODE, VCODE_ERROR } from '@/constants/errorCode';

@Form.create()
class ImgCaptchaModal extends Component {
    constructor(props) {
        super(props);
        this.state = { inErrorStatus: false };
    }

    checkVcode = async () => {
        const {
            form: { setFields },
            getCode,
        } = this.props;
        const response = await getCode();
        if (response && [SHOW_VCODE, VCODE_ERROR].includes(response.code)) {
            setFields({
                vcode2: {
                    value: '',
                    errors: [new Error(formatMessage({ id: 'vcode.input.error' }))],
                },
            });
            this.setState({ inErrorStatus: true });
        } else {
            this.setState({ inErrorStatus: false });
        }
    };

    handleOnBlur = () => {
        const {
            form: { validateFields },
        } = this.props;

        validateFields(['vcode2'], err => {
            if (err) {
                this.setState({ inErrorStatus: true });
            } else {
                this.setState({ inErrorStatus: false });
            }
        });
    };

    render() {
        const { inErrorStatus } = this.state;
        const {
            form: { getFieldDecorator },
            imgCaptcha,
            visible,
            getCode,
            refreshCode,
            onCancel,
        } = this.props;
        return (
            <Modal
                width={400}
                visible={visible}
                wrapClassName={styles['img-modal']}
                closable={false}
                maskClosable={false}
                title={null}
                footer={null}
                onCancel={onCancel}
            >
                <div className={styles['custom-modal-wrapper']}>
                    <div className={styles['custom-modal-header']}>
                        <div className={styles['close-icon']} onClick={onCancel}>
                            <Icon type="close" />
                        </div>
                    </div>
                    <div className={styles['custom-modal-content']}>
                        <h1 className={styles.title}>{formatMessage({ id: 'vcode.title' })}</h1>
                        <div className={styles.description}>
                            {formatMessage({ id: 'vcode.description' })}
                        </div>
                        <Form>
                            <Form.Item
                                className={`${styles['vcode-item']} ${styles['ant-form-item']}  ${
                                    inErrorStatus ? styles['ant-form-item-with-help'] : ''
                                }`}
                            >
                                {getFieldDecorator('vcode2', {
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
                                            imgUrl: imgCaptcha.url,
                                            getImageCode: getCode,
                                            onBlur: this.handleOnBlur,
                                            refreshCode,
                                            inputProps: {
                                                maxLength: 4,
                                                size: 'large',
                                                placeholder: formatMessage({
                                                    id: 'vcode.placeholder',
                                                }),
                                            },
                                            initial: false,
                                        }}
                                    />
                                )}
                            </Form.Item>
                        </Form>

                        <div className={styles['custom-modal-footer']}>
                            <Button onClick={onCancel} className={styles['cancel-btn']}>
                                {formatMessage({ id: 'btn.cancel' })}
                            </Button>
                            <Button onClick={this.checkVcode} className={styles['confirm-btn']}>
                                {formatMessage({ id: 'btn.confirm' })}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ImgCaptchaModal;
