import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Checkbox, Select, Button, Input, Radio, TimePicker, Cascader } from 'antd';
import { mail } from '@/constants/regexp';
import styles from './StoreManagement.less';

const days = [
  formatMessage({ id: 'storeManagement.create.daysMon' }),
  formatMessage({ id: 'storeManagement.create.daysTus' }),
  formatMessage({ id: 'storeManagement.create.daysWdn' }),
  formatMessage({ id: 'storeManagement.create.daysThr' }),
  formatMessage({ id: 'storeManagement.create.daysFri' }),
  formatMessage({ id: 'storeManagement.create.daysSat' }),
  formatMessage({ id: 'storeManagement.create.daysSun' }),
];

class CreateStore extends React.Component {
  state = {
    status: formatMessage({ id: 'storeManagement.create.statusValue1' }),
    daysFullChecked: true,
    timeFullChecked: true,
    optionArray: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    // const {
    //   form: { getFieldsValue },
    // } = this.props;
    // const formValue = getFieldsValue();
    // let time = '';
    // if(formValue.)
    // const requestObj = {
    // 处理之后 发送新增门店的请求
  };

  handleOnChange = e => {
    this.setState({ status: e.target.value });
  };

  handleCheckBox = () => {};

  handleDaysFullChecked = () => {
    const { daysFullChecked } = this.state;
    const {
      form: { setFieldsValue },
    } = this.props;
    if (daysFullChecked === true) {
      setFieldsValue({ days: [] });
    } else {
      setFieldsValue({ days });
    }
    this.setState({ daysFullChecked: !daysFullChecked });
  };

  handleTimeFullChecked = () => {
    const { timeFullChecked } = this.state;
    this.setState({ timeFullChecked: !timeFullChecked });
  };

  render() {
    const FormItem = Form.Item;
    const { timeFullChecked, status, optionArray } = this.state;
    const { form } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { Option } = Select;

    return (
        <div className={styles.storeList}>
            <h2
          onClick={() => {
            const a = getFieldsValue();
            console.log(a);
          }}
            >
                {formatMessage({ id: 'storeManagement.create.title' })}
            </h2>
            <Form onSubmit={this.handleSubmit} labelCol={{ span: 2 }} wrapperCol={{ span: 9 }}>
                <FormItem label={formatMessage({ id: 'storeManagement.create.id' })}>
                    {getFieldDecorator('storeId', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'storeManagement.create.idMessage' }),
                },
              ],
              initialValue: '',
            })(<Input style={{ width: 300 }} />)}
                </FormItem>
                <FormItem label={formatMessage({ id: 'storeManagement.create.nameLabel' })}>
                    {getFieldDecorator('storeName', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'storeManagement.create.nameMessage' }),
                },
              ],
              initialValue: '',
            })(
                <Input
                style={{ width: 300 }}
                placeholder={formatMessage({ id: 'storeManagement.create.namePlaceHolder' })}
                />
            )}
                </FormItem>
                <FormItem label={formatMessage({ id: 'storeManagement.create.typeLabel' })}>
                    {getFieldDecorator('type', {
              initialValue: '',
            })(
                <Select
                style={{ width: 300 }}
                placeholder={formatMessage({ id: 'storeManagement.create.typePlaceHolder' })}
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
                    <Radio value={formatMessage({ id: 'storeManagement.create.statusValue1' })}>
                        {formatMessage({ id: 'storeManagement.create.statusValue1' })}
                    </Radio>
                    <Radio value={formatMessage({ id: 'storeManagement.create.statusValue2' })}>
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
                placeholder={formatMessage({ id: 'storeManagement.create.addressPlaceHolder1' })}
                />
            )}
                    {getFieldDecorator('detailAddress', {
              initialValue: '',
            })(
                <Input
                placeholder={formatMessage({ id: 'storeManagement.create.addressPlaceHolder2' })}
                style={{ width: 300 }}
                />
            )}
                </FormItem>

                <FormItem label={formatMessage({ id: 'storeManagement.create.daysLabel' })}>
                    {/* <Checkbox checked={daysFullChecked} onChange={this.handleDaysFullChecked}> */}
                    {/* {formatMessage({id:'storeManagement.create.daysAll'})} */}
                    {/* </Checkbox> */}
                    {/* { */}
                    {/* getFieldDecorator('days', { */}
                    {/* initialValue: days */}
                    {/* })( */}
                    {/* <Checkbox.Group */}
                    {/* options={days} */}
                    {/* onChange={this.handleCheckBox} */}
                    {/* /> */}
                    {/* ) */}
                    {/* } */}
                    {getFieldDecorator('startTime', {})(
                        <TimePicker placeholder={formatMessage({ id: 'storeManagement.create.startTime' })} />
            )}
                    <span style={{ margin: '0 15px 0 15px' }}>~</span>
                    {getFieldDecorator('endTime')(
                        <TimePicker placeholder={formatMessage({ id: 'storeManagement.create.endTime' })} />
            )}
                    <Checkbox
              style={{ marginLeft: '15px' }}
              checked={timeFullChecked}
              onChange={this.handleTimeFullChecked}
                    >
                        {formatMessage({ id: 'storeManagement.create.fullDay' })}
                    </Checkbox>
                </FormItem>
                {/* <FormItem label={formatMessage({id:'storeManagement.create.pic'})}> */}
                {/* { */}
                {/* getFieldDecorator('pic')( */}
                {/* <div> */}
                {/* <Button onClick={this.upload} type='button' className={styles.uploadButton}>{formatMessage({id:'storeManagement.create.upload'})}</Button> */}
                {/* <span className={styles.picSpan}>{formatMessage({id:'storeManagement.create.supportTypes'})}</span> */}
                {/* </div> */}
                {/* ) */}
                {/* } */}
                {/* </FormItem> */}
                <FormItem label={formatMessage({ id: 'storeManagement.create.contactName' })}>
                    {getFieldDecorator('contactName', {
              initialValue: '',
            })(<Input style={{ width: 300 }} />)}
                </FormItem>
                <FormItem label={formatMessage({ id: 'storeManagement.create.contactPhone' })}>
                    {getFieldDecorator('contactPhone', {
              rules: [
                {
                  message: '请输入正确的电话号码',
                  pattern: /^0{0,1}(13[0-9]|15[0-9])[0-9]{8}$/,
                },
              ],
              validateTrigger: 'onBlur',
              initialValue: '',
            })(<Input style={{ width: 300 }} />)}
                </FormItem>
                <FormItem label={formatMessage({ id: 'storeManagement.create.contactMail' })}>
                    {getFieldDecorator('contactMail', {
              rules: [
                {
                  message: '请输入正确的邮箱格式',
                  pattern: mail,
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
                window.location = '/storeManagement/list';
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
    days: Form.createFormField(''),
    startTime: Form.createFormField(''),
    endTime: Form.createFormField(''),
    pic: Form.createFormField(''),
    contactName: Form.createFormField(''),
    contactPhone: Form.createFormField(''),
    contactMail: Form.createFormField(''),
  }),
})(CreateStore);
export default CreateStoreForm;
