import React from 'react';
import { Row, Col, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import * as styles from './index.less';

export default function overview(props) {
    const { productOverview = {}, deviceOverview = {}, refreshFailedImage } = props;

    return (
        <div className={styles.overview}>
            <Row gutter={20}>
                <Col span={6}>
                    <Card style={{ width: '100%', minHeight: '167px' }}>
                        <h4 className={styles['card-title']}>待推送</h4>
                        <div className={styles['overview-count']}>
                            {deviceOverview.esl_pending_count}
                        </div>
                        <div className={styles['overview-divider']} />
                        <div className={styles['overview-btn-bar']}>
                            <div>
                                {formatMessage({ id: 'esl.device.esl.week.fail' })}
                                <span className={styles['overview-fail-count']}>
                                    {deviceOverview.esl_failed_count}
                                </span>
                            </div>
                            <a href="javascript:void(0);" onClick={refreshFailedImage}>
                                {formatMessage({ id: 'esl.device.esl.push.all' })}
                            </a>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ width: '100%', minHeight: '167px' }}>
                        <h4 className={styles['card-title']}>商品总数</h4>
                        <div className={styles['overview-count']}>
                            {productOverview.total_count}
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ width: '100%', minHeight: '167px' }}>
                        <h4 className={styles['card-title']}>价签总数</h4>
                        <div className={styles['overview-count']}>
                            {deviceOverview.esl_total_count}
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ width: '100%', minHeight: '167px' }}>
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
