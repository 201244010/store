import React from 'react';
import styles from './BusinessLayout.less';

class BusinessLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles['title-background']} />
          {children}
        </div>
      </div>
    );
  }
}

export default BusinessLayout;
