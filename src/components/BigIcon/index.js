import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

const BigIcon = props => {
  const { type, wrapperStyle = {}, iconStyle = {} } = props;
  return (
    <div className={styles['icon-wrapper']} style={wrapperStyle}>
      <Icon className={styles['icon-default']} type={type} style={iconStyle} />
    </div>
  );
};

export default BigIcon;
