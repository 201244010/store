import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Form, Input, Modal } from 'antd';
import { Result } from 'ant-design-pro';
import { FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import { customValidate } from '@/utils/customValidate';
import styles from '@/pages/User/Register/Register.less';

const SuccessInfo = props => {
  const { mail = '', mailBinded = true } = props;
  return (
    <Result
      type="success"
      title={<div>{formatMessage({ id: 'change.success' })}</div>}
      description={
        <div className={styles['result-content']}>
          {formatMessage({ id: 'mail.notice_1' })}
          {mail}
          {mailBinded
            ? formatMessage({ id: 'bind.mail.notice_2' })
            : formatMessage({ id: 'change.mail.notice_2' })}
        </div>
      }
      actions={
        <div>
          <Button type="primary" size="large">
            {formatMessage({ id: 'btn.mail.check' })}
          </Button>
        </div>
      }
    />
  );
};

@Form.create()
class ChangeMail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeSuccess: false,
    };
  }

  onOk = () => {
    const {
      form: { validateFields },
      changeOrBindMail,
    } = this.props;
    validateFields(async (err, values) => {
      if (!err) {
        // TODO 邮件提交，如果成功就切换显示内容
        const response = await changeOrBindMail(values);
        console.log(response);
      }
    });
  };

  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  getCode = () => {};

  render() {
    const { changeSuccess } = this.state;
    const {
      form: { getFieldDecorator },
      visible,
      mailBinded = true,
    } = this.props;

    let [title, footer] = [null, null];
    if (!changeSuccess) {
      title = mailBinded
        ? formatMessage({ id: 'change.mail.title' })
        : formatMessage({ id: 'bind.mail.title' });
      footer = (
        <div>
          <Button onClick={this.onCancel}>{formatMessage({ id: 'btn.cancel' })}</Button>
          <Button type="primary" onClick={this.onOk}>
            {formatMessage({ id: 'btn.confirm' })}
          </Button>
        </div>
      );
    }

    return (
      <Modal
        title={title}
        footer={footer}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        {changeSuccess ? (
          <SuccessInfo />
        ) : (
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
              })(<Input type="password" />)}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT_COMMON}
              label={
                mailBinded
                  ? formatMessage({ id: 'change.mail.address.new' })
                  : formatMessage({ id: 'change.mail.address' })
              }
            >
              {getFieldDecorator('mail', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    validator: (rule, value, callback) =>
                      customValidate({
                        field: 'mail',
                        rule,
                        value,
                        callback,
                      }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  }
}

export default ChangeMail;
