import React, { Component } from 'react';
import { formatMessage, getLocale } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { Tabs, Form, Input, Button, Icon, Alert, Modal, message } from 'antd';
import { encryption } from '@/utils/utils';
import Captcha from '@/components/Captcha';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';
import Storage from '@konata9/storage.js';
import { ERROR_OK, ALERT_NOTICE_MAP, VCODE_ERROR, SHOW_VCODE } from '@/constants/errorCode';
import styles from './Login.less';

const VALIDATE_FIELDS = {
    tabAccount: ['username', 'password'],
    tabMobile: ['phone', 'code'],
};

@connect(
    state => ({
        user: state.user,
        sso: state.sso,
        merchant: state.merchant,
        store: state.store,
    }),
    dispatch => ({
        userLogin: payload => dispatch({ type: 'user/login', payload }),
        checkImgCode: payload => dispatch({ type: 'user/checkImgCode', payload }),
        checkUser: payload => dispatch({ type: 'sso/checkUser', payload }),
        sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
        getImageCode: () => dispatch({ type: 'sso/getImageCode' }),
        getCompanyList: () => dispatch({ type: 'merchant/getCompanyList' }),
        getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
    })
)
@Form.create()
class Login extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            notice: '',
            currentTab: 'tabAccount',
            trigger: false,
            vcodeIsError: false,
            showImgCaptchaModal: false,
        };
    }

    onTabChange = tabName => {
        this.setState({
            notice: '',
            currentTab: tabName,
        });
    };

    closeImgCaptchaModal = () => {
        this.setState({ showImgCaptchaModal: false });
    };

    getCode = async (params = {}) => {
        const { imageStyle = {} } = params;
        const {
            form: { getFieldValue },
            sendCode,
            sso: { imgCaptcha, needImgCaptcha },
        } = this.props;

        const response = await sendCode({
            options: {
                username: getFieldValue('phone'),
                type: '2',
                imgCode: getFieldValue('vcode2') || '',
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
            setFieldsValue({ vcode2: '' });
            this.setState(
                {
                    vcodeIsError: true,
                },
                () => validateFields(['vcode2'], { force: true })
            );
        }
    };

    showAccountMergeModal = (path = '/') => {
        Modal.confirm({
            icon: 'info-circle',
            title: formatMessage({ id: 'account.merge.title' }),
            content: formatMessage({ id: 'account.merge.content' }),
            okText: formatMessage({ id: 'btn.confirm' }),
            cancelText: formatMessage({ id: 'btn.cancel' }),
            onOk: () => window.open(path),
        });
    };

    checkStoreExist = async () => {
        const { getStoreList } = this.props;
        const response = await getStoreList({});
        if (response && response.code === ERROR_OK) {
            const result = response.data || {};
            const storeList = result.shop_list || [];
            if (storeList.length === 0) {
                router.push('/basicData/storeManagement/createStore');
            } else {
                const defaultStore = storeList[0] || {};
                Storage.set({ __shop_id__: defaultStore.shop_id });
                router.push('/');
            }
        }
    };

    checkCompanyList = async () => {
        const { getCompanyList } = this.props;
        const response = await getCompanyList({});
        if (response && response.code === ERROR_OK) {
            const data = response.data || {};
            const companyList = data.company_list || [];
            const companys = companyList.length;
            if (companys === 0) {
                router.push('/merchant/create');
            } else if (companys === 1) {
                const companyInfo = companyList[0] || {};
                Storage.set({ __company_id__: companyInfo.company_id });
                this.checkStoreExist();
            } else {
                router.push('/user/storeRelate');
            }
        } else {
            router.push('/user/login');
        }
    };

    handleResponse = async response => {
        const {
            form: { getFieldValue },
            checkUser,
        } = this.props;

        if (response && response.code === ERROR_OK) {
            const { currentTab } = this.state;
            const checkUserName =
                currentTab === 'tabAccount' ? getFieldValue('username') : getFieldValue('phone');
            const result = await checkUser({ options: { username: checkUserName } });
            if (result && result.code === ERROR_OK) {
                const data = result.data || {};
                if (data.needMerge) {
                    this.showAccountMergeModal(data.url);
                } else {
                    this.checkCompanyList();
                }
            }
        } else if (Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)) {
            this.setState({
                notice: response.code || '',
            });
        }
    };

    doLogin = async (loginType, values) => {
        const { userLogin } = this.props;
        const options = {
            ...values,
            password: encryption(values.password),
        };

        const response = await userLogin({
            type: loginType,
            options,
        });
        this.handleResponse(response);
    };

    onSubmit = () => {
        const {
            form: { validateFields, getFieldValue, setFields },
            user: { errorTimes },
            sso: { imgCode },
            checkImgCode,
            getImageCode,
        } = this.props;
        const { currentTab } = this.state;
        const loginType = currentTab === 'tabAccount' ? 'login' : 'quickLogin';

        validateFields(VALIDATE_FIELDS[currentTab], async (err, values) => {
            if (!err) {
                if (errorTimes > 2 && currentTab === 'tabAccount') {
                    const code = getFieldValue('vcode');
                    if (!code) {
                        setFields({
                            vcode: {
                                errors: [new Error(formatMessage({ id: 'code.validate.isEmpty' }))],
                            },
                        });
                    } else {
                        const result = await checkImgCode({
                            options: {
                                code: getFieldValue('vcode') || '',
                                key: imgCode.key || '',
                            },
                        });

                        if (result && result.code === ERROR_OK) {
                            this.doLogin(loginType, values);
                        } else {
                            if (Object.keys(ALERT_NOTICE_MAP).includes(`${result.code}`)) {
                                this.setState({
                                    notice: result.code,
                                });
                            }
                            getImageCode();
                        }
                    }
                } else {
                    this.doLogin(loginType, values);
                }
            }
        });
    };

    render() {
        const { notice, trigger, vcodeIsError, showImgCaptchaModal } = this.state;
        const {
            form: { getFieldDecorator },
            getImageCode,
            sso: { imgCode, imgCaptcha },
            user: { errorTimes },
        } = this.props;
        const currentLanguage = getLocale();

        return (
            <div className={styles['login-warp']}>
                <Form>
                    <Tabs
                        animated={false}
                        defaultActiveKey="tabAccount"
                        tabBarStyle={{ textAlign: 'center' }}
                        onChange={this.onTabChange}
                    >
                        <Tabs.TabPane
                            tab={formatMessage({ id: 'login.useAccount' })}
                            key="tabAccount"
                        >
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
                                            message: formatMessage({
                                                id: 'account.validate.isEmpty',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        prefix={
                                            <Icon
                                                type="border"
                                                style={{ color: 'rgba(0,0,0,.25)' }}
                                            />
                                        }
                                        size="large"
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
                                        prefix={
                                            <Icon
                                                type="border"
                                                style={{ color: 'rgba(0,0,0,.25)' }}
                                            />
                                        }
                                        size="large"
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
                                                inputRef: this.inputRef,
                                                imgUrl: imgCode.url,
                                                inputProps: {
                                                    size: 'large',
                                                    placeholder: formatMessage({
                                                        id: 'vcode.placeholder',
                                                    }),
                                                },
                                                getImageCode,
                                            }}
                                        />
                                    )}
                                </Form.Item>
                            )}
                        </Tabs.TabPane>
                        {currentLanguage === 'zh-CN' && (
                            <Tabs.TabPane
                                tab={formatMessage({ id: 'login.useMobile' })}
                                key="tabMobile"
                            >
                                {notice && (
                                    <Form.Item>
                                        <Alert
                                            message={formatMessage({
                                                id: ALERT_NOTICE_MAP[notice],
                                            })}
                                            type="error"
                                            showIcon
                                        />
                                    </Form.Item>
                                )}
                                <Form.Item>
                                    {getFieldDecorator('phone', {
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
                                            prefix={
                                                <Icon
                                                    type="border"
                                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                                />
                                            }
                                            size="large"
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
                                            {getFieldDecorator('vcode2', {
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
                                                            size: 'large',
                                                            placeholder: formatMessage({
                                                                id: 'vcode.placeholder',
                                                            }),
                                                        },
                                                        initial: false,
                                                        onFocus: () =>
                                                            this.setState({ vcodeIsError: false }),
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
                                                    initText: formatMessage({ id: 'btn.get.code' }),
                                                    countText: formatMessage({
                                                        id: 'countDown.unit',
                                                    }),
                                                },
                                                onClick: this.getCode,
                                            }}
                                        />
                                    )}
                                </Form.Item>
                            </Tabs.TabPane>
                        )}
                    </Tabs>
                    <Form.Item>
                        <Button size="large" type="primary" block onClick={this.onSubmit}>
                            {formatMessage({ id: 'btn.login' })}
                        </Button>
                    </Form.Item>
                </Form>
                <div className={styles['login-footer']}>
                    <Link to="/user/resetPassword">
                        {formatMessage({ id: 'link.forgot.password' })}
                    </Link>
                    <Link to="/user/register">{formatMessage({ id: 'link.to.register' })}</Link>
                </div>
            </div>
        );
    }
}

export default Login;
