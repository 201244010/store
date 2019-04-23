import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input, Radio, message, Cascader } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Storage from '@konata9/storage.js/src/storage';
import { cellphone } from '@/constants/regexp';
import styles from './StoreManagement.less';

const FormItem = Form.Item;

@connect(
    state => ({
        store: state.store,
    }),
    dispatch => ({
        createNewStore: payload => dispatch({ type: 'store/createNewStore', payload }),
        getShopTypeList: () => dispatch({ type: 'store/getShopTypeList' }),
        getRegionList: () => dispatch({ type: 'store/getRegionList' }),
    })
)
@Form.create()
class CreateStore extends React.Component {
    state = {
        status: formatMessage({ id: 'storeManagement.create.statusValue1' }),
    };

    componentDidMount() {
        const { getShopTypeList, getRegionList } = this.props;
        if (!Storage.get('__shopTypeList__', 'local')) {
            getShopTypeList();
        }

        if (!Storage.get('__regionList__', 'local')) {
            getRegionList();
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const companyId = Storage.get('__company_id__');
        const {
            form: { getFieldsValue },
            createNewStore,
        } = this.props;
        const formValue = getFieldsValue();
        if (!this.validFormValue(formValue)) {
            return;
        }
        const payload = {
            options: {
                company_id: companyId,
                shop_name: formValue.name,
                type_one: formValue.shopType[0],
                type_two: formValue.shopType[1],
                business_status:
                    formValue.status ===
                    formatMessage({ id: 'storeManagement.create.statusValue1' })
                        ? 0
                        : 1,
                province: formValue.region[0],
                city: formValue.region[1],
                area: formValue.region[2],
                address: formValue.detailAddress,
                business_hours: formValue.time,
                contact_person: formValue.contactName,
                contact_tel: formValue.contactPhone,
            },
        };
        createNewStore(payload);
    };

    validFormValue = formValue => {
        if (!formValue.name) {
            message.warning(formatMessage({ id: 'storeManagement.message.name.error' }));
            return false;
        }
        if (formValue.contactPhone && !cellphone.test(formValue.contactPhone)) {
            message.warning(formatMessage({ id: 'storeManagement.message.cellphone.error' }));
            return false;
        }
        return true;
    };

    handleOnChange = e => {
        this.setState({ status: e.target.value });
    };

    render() {
        const { status } = this.state;
        const {
            form: { getFieldDecorator },
            store: { shopType_list, regionList },
        } = this.props;

        return (
            <div className={styles.storeList}>
                <h2>{formatMessage({ id: 'storeManagement.create.title' })}</h2>
                <Form onSubmit={this.handleSubmit} labelCol={{ span: 2 }} wrapperCol={{ span: 9 }}>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.nameLabel' })}>
                        {getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({
                                        id: 'storeManagement.create.nameMessage',
                                    }),
                                },
                            ],
                            initialValue: '',
                        })(
                            <Input
                                style={{ width: 300 }}
                                placeholder={formatMessage({
                                    id: 'storeManagement.create.namePlaceHolder',
                                })}
                            />
                        )}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.typeLabel' })}>
                        {getFieldDecorator('shopType', {
                            initialValue: '',
                        })(
                            <Cascader
                                style={{ width: 300 }}
                                placeholder={formatMessage({
                                    id: 'storeManagement.create.typePlaceHolder',
                                })}
                                options={shopType_list}
                            />
                        )}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.statusLabel' })}>
                        {getFieldDecorator('status', {
                            initialValue: status,
                        })(
                            <Radio.Group onChange={this.handleOnChange}>
                                <Radio
                                    value={formatMessage({
                                        id: 'storeManagement.create.statusValue1',
                                    })}
                                >
                                    {formatMessage({ id: 'storeManagement.create.statusValue1' })}
                                </Radio>
                                <Radio
                                    value={formatMessage({
                                        id: 'storeManagement.create.statusValue2',
                                    })}
                                >
                                    {formatMessage({ id: 'storeManagement.create.statusValue2' })}
                                </Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.address' })}>
                        {getFieldDecorator('region', {
                            initialValue: '',
                        })(
                            <Cascader
                                options={regionList}
                                placeholder={formatMessage({
                                    id: 'storeManagement.create.addressPlaceHolder2',
                                })}
                                style={{ width: 300 }}
                            />
                        )}
                    </FormItem>
                    <FormItem label=" " colon={false}>
                        {getFieldDecorator('detailAddress', {
                            initialValue: '',
                        })(
                            <Input
                                placeholder={formatMessage({
                                    id: 'storeManagement.create.addressPlaceHolder2',
                                })}
                                style={{ width: 300 }}
                            />
                        )}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.daysLabel' })}>
                        {getFieldDecorator('time', {
                            initialValue: '',
                        })(<Input style={{ width: 300 }} />)}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.contactName' })}>
                        {getFieldDecorator('contactName', {
                            initialValue: '',
                        })(<Input style={{ width: 300 }} />)}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.contactPhone' })}>
                        {getFieldDecorator('contactPhone', {
                            rules: [
                                {
                                    message: formatMessage({
                                        id: 'storeManagement.create.phoneMessage',
                                    }),
                                    pattern: cellphone,
                                },
                            ],
                            validateTrigger: 'onBlur',
                            initialValue: '',
                        })(<Input style={{ width: 300 }} maxLength={11} />)}
                    </FormItem>
                    <FormItem>
                        <Button htmlType="submit" className={styles.submitButton}>
                            {formatMessage({ id: 'storeManagement.create.buttonConfirm' })}
                        </Button>
                        <Button
                            htmlType="button"
                            className={styles.submitButton2}
                            onClick={() => {
                                router.push('list');
                            }}
                        >
                            {formatMessage({ id: 'storeManagement.create.buttonCancel' })}
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default CreateStore;
