import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Card, List, Icon, Button } from 'antd';
import * as styles from './Account.less';

class Store extends Component {
    createStore = () => {
        // TODO 创建新商户逻辑
    };

    render() {
        const { itemList = [] } = this.props;
        console.log(itemList);

        return (
            <Card style={{ marginTop: '15px' }}>
                <h2>{formatMessage({ id: 'userCenter.store.title' })}</h2>
                <List className={styles['list-wrapper']}>
                    <List.Item>
                        <div className={styles['list-item']}>
                            <div className={styles['title-wrapper-start']}>
                                <h4>{formatMessage({ id: 'userCenter.store.name' })}</h4>
                                <Icon type="property-safety" />
                            </div>
                            <div>xxxxxxxxxxxxxx</div>
                        </div>
                    </List.Item>
                </List>
                <div>
                    <Button type="dashed" icon="plus" block onClick={this.createStore}>
                        {formatMessage({ id: 'userCenter.store.create' })}
                    </Button>
                </div>
            </Card>
        );
    }
}

export default Store;
