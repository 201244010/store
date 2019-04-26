import React, { Component } from 'react';
import { Form, Input, Button, Select, Modal } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { FORM_FORMAT, HEAD_FORM_ITEM_LAYOUT, FORM_ITEM_LONGER } from '@/constants/form';
import * as styles from './ProductManagement.less';
import { ERROR_OK } from '@/constants/errorCode';
import { MENU_PREFIX } from '@/constants';

const SDNM = props => {
    const { getFieldDecorator, checkSaasInfo } = props;
    return (
        <>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.key' })}>
                {getFieldDecorator('saas_info.app_key', {
                    validateTrigger: 'onBlur',
                    rules: [
                        {
                            required: true,
                            message: formatMessage({ id: 'basicData.erp.sdnm.key.isEmpty' }),
                        },
                    ],
                })(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.secret' })}>
                {getFieldDecorator('saas_info.secret', {
                    validateTrigger: 'onBlur',
                    rules: [
                        {
                            required: true,
                            message: formatMessage({ id: 'basicData.erp.sdnm.secret.isEmpty' }),
                        },
                    ],
                })(
                    <Input
                        onBlur={() =>
                            checkSaasInfo(
                                'saas_info.secret',
                                formatMessage({ id: 'basicData.erp.sdnm.key.error' })
                            )
                        }
                    />
                )}
            </Form.Item>
        </>
    );
};

const KWYLS = props => {
    const { getFieldDecorator, checkSaasInfo } = props;
    return (
        <>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.store.num' })}>
                {getFieldDecorator('saas_info.store_num', {
                    validateTrigger: 'onBlur',
                    rules: [
                        {
                            required: true,
                            message: formatMessage({ id: 'basicData.erp.kwyls.shopId.isEmpty' }),
                        },
                    ],
                })(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.account' })}>
                {getFieldDecorator('saas_info.store_account', {
                    validateTrigger: 'onBlur',
                    rules: [
                        {
                            required: true,
                            message: formatMessage({ id: 'basicData.erp.kwyls.account.isEmpty' }),
                        },
                    ],
                })(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.password' })}>
                {getFieldDecorator('saas_info.store_password', {
                    validateTrigger: 'onBlur',
                    rules: [
                        {
                            required: true,
                            message: formatMessage({ id: 'basicData.erp.kwyls.password.isEmpty' }),
                        },
                    ],
                })(
                    <Input
                        type="password"
                        onBlur={() =>
                            checkSaasInfo(
                                'saas_info.store_password',
                                formatMessage({ id: 'basicData.erp.kwyls.key.error' })
                            )
                        }
                    />
                )}
            </Form.Item>
        </>
    );
};

const RenderFormItem = {
    'SAAS-KWYLS': KWYLS,
    'SAAS-SDNM': SDNM,
    default: () => <div />,
};

@connect(
    state => ({
        product: state.basicDataProduct,
    }),
    dispatch => ({
        getERPPlatformList: () => dispatch({ type: 'basicDataProduct/getERPPlatformList' }),
        erpAuthCheck: payload => dispatch({ type: 'basicDataProduct/erpAuthCheck', payload }),
        erpImport: payload => dispatch({ type: 'basicDataProduct/erpImport', payload }),
    })
)
@Form.create()
class ERPImport extends Component {
    constructor(props) {
        super(props);
        this.saasKey = null;
        this.state = {
            RenderItem: () => <div />,
        };
    }

    componentDidMount() {
        const { getERPPlatformList } = this.props;
        getERPPlatformList();
    }

    checkSaasInfo = (field, errMsg) => {
        const {
            erpAuthCheck,
            form: { validateFields, setFields, getFieldValue },
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                const response = await erpAuthCheck({
                    options: {
                        ...values,
                        saas_id: this.saasKey,
                        saas_info: JSON.stringify(values.saas_info),
                    },
                });
                if (response && response.code !== ERROR_OK) {
                    setFields({
                        [field]: { value: getFieldValue(field), errors: [new Error(errMsg)] },
                    });
                }
            }
        });
    };

    handlePlatformSelect = (value, options) => {
        this.saasKey = parseInt(options.key, 10);
        this.setState({
            RenderItem: RenderFormItem[value] || RenderFormItem.default,
        });
    };

    handleSubmit = () => {
        const {
            erpImport,
            form: { validateFields },
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                await erpImport({
                    options: {
                        ...values,
                        saas_id: this.saasKey,
                        saas_info: JSON.stringify(values.saas_info),
                    },
                });
            }
        });
    };

    showConfirmModal = () => {
        Modal.confirm({
            icon: 'info-circle',
            title: formatMessage({ id: 'basicData.erp.confirm.title' }),
            content: formatMessage({ id: 'basicData.erp.confirm.content' }),
            okText: formatMessage({ id: 'btn.confirm' }),
            cancelText: formatMessage({ id: 'btn.cancel' }),
            onOk: this.handleSubmit,
        });
    };

    goBack = () => router.push(`${MENU_PREFIX.PRODUCT}`);

    render() {
        const { RenderItem } = this.state;
        const {
            form: { getFieldDecorator },
            product: { sassInfoList, erpEnable },
        } = this.props;

        return (
            <div className={styles['content-container']}>
                <h3>{formatMessage({ id: 'btn.erp.import' })}</h3>
                <div className={styles['form-wrapper']}>
                    <Form
                        {...{
                            ...FORM_FORMAT,
                            ...HEAD_FORM_ITEM_LAYOUT,
                        }}
                    >
                        <Form.Item label={formatMessage({ id: 'basicData.erp.platform' })}>
                            {getFieldDecorator('saas_id')(
                                <Select onSelect={this.handlePlatformSelect}>
                                    {sassInfoList.map((platform, index) => (
                                        <Select.Option
                                            key={platform.id || index}
                                            value={platform.name}
                                        >
                                            {platform.full_name || ''}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>

                        <RenderItem
                            {...{
                                getFieldDecorator,
                                checkSaasInfo: this.checkSaasInfo,
                            }}
                        />

                        <Form.Item
                            {...FORM_ITEM_LONGER}
                            label={formatMessage({ id: 'basicData.erp.description' })}
                        >
                            <ul className={styles['description-list']}>
                                <li className={styles['list-item']}>
                                    {formatMessage({ id: 'basicData.erp.description.list1' })}
                                </li>
                                <li className={styles['list-item']}>
                                    {formatMessage({ id: 'basicData.erp.description.list2' })}
                                </li>
                                <li className={styles['list-item']}>
                                    {formatMessage({ id: 'basicData.erp.description.list3' })}
                                </li>
                            </ul>
                        </Form.Item>
                        <Form.Item label=" " colon={false}>
                            <div className={styles['form-btn-wrapper']}>
                                <Button
                                    disabled={!erpEnable}
                                    className={styles['form-btn']}
                                    type="primary"
                                    onClick={this.showConfirmModal}
                                >
                                    {formatMessage({ id: 'btn.save' })}
                                </Button>
                                <Button className={styles['form-btn']} onClick={this.goBack}>
                                    {formatMessage({ id: 'btn.cancel' })}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

export default ERPImport;
