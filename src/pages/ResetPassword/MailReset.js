import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Button, Row, Col, Alert } from 'antd';
import { Result } from 'ant-design-pro';
import { connect } from 'dva';
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

@connect(
  state => ({
    user: state.user,
    sso: state.sso,
  }),
  dispatch => ({
    getImageCode: () => dispatch({ type: 'sso/getImageCode' }),
    sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
    resetPassword: payload => dispatch({ type: 'user/resetPassword', payload }),
  })
)
@Form.create()
class MailReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notice: '',
      resetSuccess: false,
    };
  }

  componentDidMount() {
    this.getImpageCode();
  }

  getImpageCode = async () => {
    const { getImageCode } = this.props;
    await getImageCode();
  };

  refreshCode = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ code: '' });
    this.getImpageCode();
  };

  onSubmit = () => {
    const {
      form: { validateFields },
      resetPassword,
    } = this.props;
    validateFields(async (err, values) => {
      if (!err) {
        const response = await resetPassword({ options: values });
        console.log(response);
      }
    });
  };

  render() {
    const { notice, resetSuccess } = this.state;
    const {
      form: { getFieldDecorator },
      sso: { imgUrl },
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
              {getFieldDecorator('username', {
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
                  <img src={imgUrl} alt="" onClick={this.refreshCode} />
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
