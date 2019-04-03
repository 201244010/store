import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { Icon } from 'antd';
import { GlobalFooter } from 'ant-design-pro';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> {formatMessage({ id: 'layout.user.footer' })}
  </Fragment>
);

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>{children}</div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
