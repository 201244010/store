import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Select, Button, Input, Radio, Cascader } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './StoreManagement.less';

@connect(
    state => ({
        newStore: state.store,
    }),
    dispatch => ({
        createNewStore: payload => dispatch({ type: 'store/createNewStore', payload }),
    })
)
class CreateStore extends React.Component {
    state = {
        status: formatMessage({ id: 'storeManagement.create.statusValue1' }),
        optionArray: [],
    };

    handleSubmit = e => {
        e.preventDefault();
        const {
            form: { getFieldsValue },
            createNewStore,
        } = this.props;
        const formValue = getFieldsValue();
        if (
            formValue.name === '' ||
            (formValue.contactPhone !== /^0{0,1}(13[0-9]|15[0-9])[0-9]{8}$/ &&
                formValue.contactPhone !== '')
        ) {
            alert('请输入正确的表单信息');
        } else {
            const payload = {
                options: {
                    company_id: '56',
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
        }
    };

    handleOnChange = e => {
        this.setState({ status: e.target.value });
    };

    render() {
        const FormItem = Form.Item;
        const { status, optionArray } = this.state;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { Option } = Select;

        return (
            <div className={styles.storeList}>
                <h2>{formatMessage({ id: 'storeManagement.create.title' })}</h2>
                <Form onSubmit={this.handleSubmit} labelCol={{ span: 2 }} wrapperCol={{ span: 9 }}>
                    {/* <FormItem label={formatMessage({ id: 'storeManagement.create.id' })}> */}
                    {/* { */}
                    {/* getFieldDecorator('storeId', { */}
                    {/* rules: [ */}
                    {/* { */}
                    {/* required: true, */}
                    {/* message: formatMessage({ id: 'storeManagement.create.idMessage' }), */}
                    {/* }, */}
                    {/* ], */}
                    {/* initialValue: '', */}
                    {/* })(<Input style={{ width: 300 }} />)} */}
                    {/* </FormItem> */}
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
                            <Select
                                style={{ width: 300 }}
                                placeholder={formatMessage({
                                    id: 'storeManagement.create.typePlaceHolder',
                                })}
                            >
                                {optionArray.map(value => (
                                    <Option value={value} key={value}>
                                        {value}
                                    </Option>
                                ))}
                            </Select>
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
                        {getFieldDecorator('address', {
                            initialValue: '',
                        })(
                            <Cascader
                                style={{ width: 300 }}
                                placeholder={formatMessage({
                                    id: 'storeManagement.create.addressPlaceHolder1',
                                })}
                            />
                        )}
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
                                    pattern: /^0{0,1}(13[0-9]|15[0-9])[0-9]{8}$/,
                                },
                            ],
                            validateTrigger: 'onBlur',
                            initialValue: '',
                        })(<Input style={{ width: 300 }} />)}
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
