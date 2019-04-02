import React, { Component } from 'react';
import { Form } from 'antd';
import { getLocale } from 'umi/locale';
import styles from './Register.less';

@Form.create()
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const currentLanguage = getLocale();

    return (
      <div className={styles['register-wrapper']}>
        <div className={styles['register-title']} />
        <Form>
          {currentLanguage === 'zh-CN' ? <div>中文注册页面</div> : <div>其他地区注册页面</div>}
        </Form>
      </div>
    );
  }
}

export default Register;
