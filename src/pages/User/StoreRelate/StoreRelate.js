import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Button, Divider, Spin, List } from 'antd';
import styles from './StoreRelate.less';

class StoreRelate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: true,
      relatedStores: 0,
    };
  }

  componentDidMount() {
    this.getRelatedStore();
  }

  getRelatedStore = () => {
    // TODO 获取关联店铺
  };

  render() {
    const { spinning, relatedStores } = this.state;
    return (
      <Spin spinning={spinning}>
        <div className={styles['store-wrapper']}>
          {relatedStores > 0 ? (
            <>
              <p>{formatMessage({ id: 'relatedStore.choose' })}</p>
              {/* TODO 暂时定义的假列表 */}
              <List className={styles['store-list']}>
                <List.Item>
                  <List.Item.Meta description="商户A" />
                  <Link to="/">{formatMessage({ id: 'relatedStore.entry' })}</Link>
                </List.Item>
                <List.Item>
                  <List.Item.Meta description="商户B" />
                  <Link to="/">{formatMessage({ id: 'relatedStore.entry' })}</Link>
                </List.Item>
                <List.Item className={styles['last-child']}>
                  <List.Item.Meta description="商户C" />
                  <Link to="/">{formatMessage({ id: 'relatedStore.entry' })}</Link>
                </List.Item>
              </List>
            </>
          ) : (
            <>
              <p className={styles['store-content']}>
                {formatMessage({ id: 'relatedStore.none' })}
              </p>
              <Button type="primary" size="large" block>
                {formatMessage({ id: 'relatedStore.create' })}
              </Button>
              <Divider className={styles['store-divider']} />
              <p className={styles['store-content']}>
                {formatMessage({ id: 'relatedStore.notice' })}
              </p>
            </>
          )}
        </div>
      </Spin>
    );
  }
}

export default StoreRelate;
