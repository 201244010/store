import React from 'react';
import { Row, Col, Card } from 'antd';
import * as styles from './index.less';

export default function overview(props) {
    const { productOverview = {}, deviceOverview = {} } = props;

    return (
        <div className={styles.overview}>
            <Row gutter={20}>
                <Col span={6}>
                    <Card style={{ width: '100%' }}>
                        <h4 className={styles['card-title']}>待推送</h4>
                        <div className={styles['overview-count']}>
                            {deviceOverview.esl_pending_count}
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ width: '100%' }}>
                        <h4 className={styles['card-title']}>商品总数</h4>
                        <div className={styles['overview-count']}>
                            {productOverview.total_count}
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ width: '100%' }}>
                        <h4 className={styles['card-title']}>价签总数</h4>
                        <div className={styles['overview-count']}>
                            {deviceOverview.esl_total_count}
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ width: '100%' }}>
                        <h4 className={styles['card-title']}>基站总数</h4>
                        <div className={styles['overview-count']}>
                            {deviceOverview.ap_total_count}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
