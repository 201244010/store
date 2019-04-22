import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input, Radio, message, Cascader } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import storage from '@konata9/storage.js/src/storage';
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
    })
)
class CreateStore extends React.Component {
    state = {
        status: formatMessage({ id: 'storeManagement.create.statusValue1' }),
        companyId: storage.get('__company_id__'),
    };

    componentDidMount() {
        const { getShopTypeList } = this.props;
        getShopTypeList();
    }

    handleSubmit = e => {
        e.preventDefault();
        const { companyId } = this.state;
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
                type_one: 0,
                type_two: 0,
                business_status:
                    formValue.status ===
                    formatMessage({ id: 'storeManagement.create.statusValue1' })
                        ? 0
                        : 1,
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
            store: { shopType_list },
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
                        {getFieldDecorator('type', {
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

const CreateStoreForm = Form.create({
    mapPropsToFields: () => ({
        storeId: Form.createFormField(''),
        name: Form.createFormField(''),
        type: Form.createFormField(''),
        status: Form.createFormField(''),
        address: Form.createFormField(''),
        detailAddress: Form.createFormField(''),
        time: Form.createFormField(''),
        pic: Form.createFormField(''),
        contactName: Form.createFormField(''),
        contactPhone: Form.createFormField(''),
    }),
})(CreateStore);
export default CreateStoreForm;
