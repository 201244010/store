import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Button, Row, Col, Alert } from 'antd';
import { Result } from 'ant-design-pro';
import * as RegExp from '../../constants/regexp';
import styles from '@/pages/Register/Register.less';

// TODO 根据 error code 显示不同的错误信息，等待 error code
const ALERT_NOTICE_MAP = {
  '000': 'alert.vcode.error',
  '001': 'alert.mail.not.registered',
};

const MailActive = () => (
  <Result
    className={styles['result-wrapper']}
    type="success"
    description={
      <div className={styles['result-content']}>{formatMessage({ id: 'reset.mail.notice' })}</div>
    }
    actions={
      <div className={styles['result-action-wrapper']}>
        <Button type="primary" size="large">
          {formatMessage({ id: 'btn.mail.check' })}
        </Button>
        <Button type="default" size="large" href="/login">
          {formatMessage({ id: 'btn.back.index' })}
        </Button>
      </div>
    }
  />
);

@Form.create()
class MailReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notice: '',
      resetSuccess: false,
    };
  }

  refreshCode = () => {
    // TODO 刷新图片验证码并清除已填内容
  };

  onSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        // TODO 通过邮件重置密码的逻辑
        console.log(values);
      }
    });
  };

  render() {
    const { notice, resetSuccess } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <>
        {resetSuccess ? (
          <MailActive />
        ) : (
          <Form>
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
              {getFieldDecorator('mail', {
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: formatMessage({ id: 'mail.validate.isEmpty' }) },
                  {
                    pattern: RegExp.mail,
                    message: formatMessage({ id: 'mail.validate.isFormatted' }),
                  },
                ],
              })(<Input size="large" placeholder={formatMessage({ id: 'mail.placeholder' })} />)}
            </Form.Item>
            <Form.Item>
              <Row gutter={16}>
                <Col span={16}>
                  {getFieldDecorator('vcode')(
                    <Input size="large" placeholder={formatMessage({ id: 'vcode.placeholder' })} />
                  )}
                </Col>
                <Col span={8}>
                  <img style={{ width: '100%', height: '100%' }} src="" alt="" />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="large" block onClick={this.onSubmit}>
                {formatMessage({ id: 'btn.confirm' })}
              </Button>
            </Form.Item>
          </Form>
        )}
      </>
    );
  }
}

export default MailReset;
