import React, { Component } from 'react';

import { Form, Button, Input } from 'antd';

import { formatMessage } from 'umi/locale';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
// import router from 'umi/router';
import { customValidate } from '@/utils/customValidate';

import { connect } from 'dva';
import styles from './Business.less';

@connect(
  state => ({
    business: state.business,
  }),
  dispatch => ({
    companyUpdate: payload => dispatch({ type: 'business/companyUpdate', payload }),
  })
)
@Form.create()
class BusinessModify extends Component {
  constructor(props) {
    super(props);
    const {
      business: {
        companyList: { company_name: companyName, contact_person: contactPerson },
      },
    } = this.props;
    this.state = {
      contactPerson,
      companyName,
    };
  }

  componentDidMount() {
    const {
      form: { setFieldsValue },
      business: {
        companyList: { contact_email: contactEmail, contact_tel: contactTel },
      },
    } = this.props;
    setFieldsValue({
      email: contactEmail,
      phone: contactTel,
    });
  }

  onChange = (e, key) => {
    console.log(key);
    this.setState({
      [key]: e.target.value,
    });
  };

  saveInfo = () => {
    const {
      form: { validateFields },
    } = this.props;

    validateFields((err, values) => {
      if (!err) {
        // const result = await checkImgCode({
        //     //TODO
        // });
        console.log(err, values);
      }
    });
  };

  cancel = () => {};

  render() {
    const { companyName, contactPerson } = this.state;
    const {
      form: { getFieldDecorator },
      business: {
        companyList: { company_no: companyNo },
      },
    } = this.props;
    return (
      <div className={styles['view-wrapper']}>
        <h1>{formatMessage({ id: 'businessManagement.business.modify' })}</h1>
        <Form {...FORM_ITEM_LAYOUT_BUSINESS}>
          <Form.Item label={formatMessage({ id: 'businessManagement.business.number' })}>
            <span>{companyNo}</span>
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'businessManagement.business.name' })}>
            <Input value={companyName} onChange={e => this.onChange(e, 'companyName')} />
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'businessManagement.business.contactPerson' })}>
            <Input value={contactPerson} onChange={e => this.onChange(e, 'contactPerson')} />
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'businessManagement.business.contactPhone' })}>
            {getFieldDecorator('phone', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  validator: (rule, value, callback) =>
                    customValidate({
                      field: 'telphone',
                      rule,
                      value,
                      callback,
                    }),
                },
              ],
            })(<Input />)}
            {/* <Input value={contactTel} onChange={e => this.onChange(e, 'contactTel')} /> */}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'businessManagement.business.contactEmail' })}>
            {getFieldDecorator('email', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  type: 'email',
                  message: formatMessage({ id: 'mail.validate.isFormatted' }),
                },
              ],
            })(<Input />)}
          </Form.Item>
        </Form>
        <div className={styles['button-style']}>
          <Button type="primary" onClick={this.saveInfo}>
            {formatMessage({ id: 'btn.save' })}
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={this.cancel}>
            {formatMessage({ id: 'btn.cancel' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default BusinessModify;
