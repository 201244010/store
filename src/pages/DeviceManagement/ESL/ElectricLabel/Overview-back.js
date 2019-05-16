import React, { Component } from 'react';
import { Row, Col, Card, Divider } from 'antd';
import * as styles from './index.less';

export default class Overview extends Component {
    handlePushAgain = () => {};

    render() {
        return (
            <div className={styles.overview}>
                <Row gutter={20}>
                    <Col span={6}>
                        <Card style={{ width: '100%' }}>
                            <h4 className={styles['card-title']}>待推送</h4>
                            <div className={styles['overview-count']}>6560</div>
                            <Divider className={styles['overview-divider']} />
                            <div>
                                <span>推送失败</span>
                                <span className={styles['overview-fail-count']}>345</span>
                                <a
                                    href="javascript: void (0);"
                                    className={styles['overview-push-again']}
                                    onClick={this.handlePushAgain}
                                >
                                    立即重推
                                </a>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card
                            style={{ width: '100%' }}
                            bodyStyle={{ padding: '24px 24px 33px 24px' }}
                        >
                            <h4 className={styles['card-title']}>待推送</h4>
                            <div className={styles['overview-count']}>6560</div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card
                            style={{ width: '100%' }}
                            bodyStyle={{ padding: '24px 24px 33px 24px' }}
                        >
                            <h4 className={styles['card-title']}>待推送</h4>
                            <div className={styles['overview-count']}>6560</div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card
                            style={{ width: '100%' }}
                            bodyStyle={{ padding: '24px 24px 33px 24px' }}
                        >
                            <h4 className={styles['card-title']}>待推送</h4>
                            <div className={styles['overview-count']}>6560</div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
