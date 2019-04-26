import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Select, Button, Input, Radio, message } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import * as CookieUtil from '@/utils/cookies';
import { getLocationParam } from '@/utils/utils';
import styles from './StoreManagement.less';
import { MENU_PREFIX } from '@/constants';

const { Option } = Select;

@connect(
    state => ({
        alter: state.store,
    }),
    dispatch => ({
        getStoreInformation: payload => dispatch({ type: 'store/getStoreInformation', payload }),
        alterStoreInformation: payload =>
            dispatch({ type: 'store/alterStoreInformation', payload }),
    })
)
class AlterStore extends React.Component {
    state = {
        option: [],
        shopId: '',
        companyId: CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY),
    };

    componentDidMount() {
        this.initFetch();
    }

    initFetch = () => {
        const { getStoreInformation } = this.props;
        const shopId = getLocationParam('shopId');
        const payload = {
            options: {
                shop_id: shopId,
            },
        };
        this.setState({ shopId });
        getStoreInformation(payload);
    };

    handleSubmit = e => {
        e.preventDefault();
        const { shopId, companyId } = this.state;
        const {
            form: { getFieldsValue },
            alterStoreInformation,
        } = this.props;
        const formValue = getFieldsValue();
        if (
            formValue.storeName === '' ||
            (formValue.contactPhone !== /^0{0,1}(13[0-9]|15[0-9])[0-9]{8}$/ &&
                formValue.contactPhone !== '')
        ) {
            message.warning(formatMessage({ id: 'storeManagement.message.alterFailed' }));
        } else {
            const payload = {
                options: {
                    company_id: companyId,
                    shop_id: shopId,
                    shop_name: formValue.storeName,
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
            alterStoreInformation(payload);
        }
    };

    render() {
        const FormItem = Form.Item;
        const { option } = this.state;
        const {
            form: { getFieldDecorator },
            alter: { alter },
        } = this.props;

        return (
            <div className={styles.storeList}>
                <h2>{formatMessage({ id: 'storeManagement.alter.title' })}</h2>
                <Form onSubmit={this.handleSubmit} labelCol={{ span: 2 }} wrapperCol={{ span: 9 }}>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.nameLabel' })}>
                        {getFieldDecorator('storeName', {
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({
                                        id: 'storeManagement.create.nameMessage',
                                    }),
                                },
                            ],
                            initialValue: alter.name,
                        })(<Input style={{ width: 300 }} />)}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.typeLabel' })}>
                        {getFieldDecorator('type', {
                            initialValue: alter.type,
                        })(
                            <Select
                                style={{ width: 300 }}
                                placeholder={formatMessage({
                                    id: 'storeManagement.create.typePlaceHolder',
                                })}
                            >
                                {option.map(value => (
                                    <Option value={value} key={value}>
                                        {value}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.statusLabel' })}>
                        {getFieldDecorator('status', {
                            initialValue: alter.status,
                        })(
                            <Radio.Group>
                                <Radio value={0}>
                                    {formatMessage({ id: 'storeManagement.create.statusValue1' })}
                                </Radio>
                                <Radio value={1}>
                                    {formatMessage({ id: 'storeManagement.create.statusValue2' })}
                                </Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.address' })}>
                        {/* {getFieldDecorator('address')( */}
                        {/* <Cascader */}
                        {/* style={{ width: 300 }} */}
                        {/* placeholder={formatMessage({ */}
                        {/* id: 'storeManagement.create.addressPlaceHolder1', */}
                        {/* })} */}
                        {/* /> */}
                        {/* )} */}
                        {getFieldDecorator('detailAddress', {
                            initialValue: alter.address,
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
                            initialValue: alter.time,
                        })(<Input style={{ width: 300 }} />)}
                    </FormItem>

                    <FormItem label={formatMessage({ id: 'storeManagement.create.contactName' })}>
                        {getFieldDecorator('contactName', {
                            initialValue: alter.contactPerson,
                        })(<Input style={{ width: 300 }} />)}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.create.contactPhone' })}>
                        {getFieldDecorator('contactPhone', {
                            rules: [
                                {
                                    message: formatMessage({
                                        id: 'storeManagement.create.phoneMessage',
                                    }),
                                    pattern: /^0{0,1}(13[0-9]|15[0-9])[0-9]{8}$/,
                                },
                            ],
                            validateTrigger: 'onBlur',
                            initialValue: alter.contactPhone,
                        })(<Input style={{ width: 300 }} />)}
                    </FormItem>
                    <FormItem>
                        <Button className={styles.submitButton} htmlType="submit">
                            {formatMessage({ id: 'storeManagement.create.buttonConfirm' })}
                        </Button>
                        <Button
                            className={styles.submitButton2}
                            onClick={() => {
                                router.push(`${MENU_PREFIX.STORE}/list`);
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

const AlterStoreForm = Form.create({
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
})(AlterStore);
export default AlterStoreForm;
