import React from 'react';
import { Col, Row } from 'antd';
import { ESL_STATES } from '@/constants';
import { unixSecondToDate, formatEmpty } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import './index.less';

const ROW_GUTTER = 16;
const COL_SPAN = 12;

export default function detail(props) {
    const { detailInfo } = props;
    const eslInfo = formatEmpty(detailInfo, '--');

    return (
        <Row gutter={ROW_GUTTER}>
            <Col span={COL_SPAN}>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.id' })}：
                    </span>
                    <span className="detail-info-content">{eslInfo.esl_code}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.sn' })}：
                    </span>
                    <span className="detail-info-content">{eslInfo.sn}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.model.name' })}：
                    </span>
                    <span className="detail-info-content">{eslInfo.model}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.screen.size' })}：
                    </span>
                    <span className="detail-info-content">{eslInfo.screen_size}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.ware.version' })}：
                    </span>
                    <span className="detail-info-content">
                        {eslInfo.status === 0 ? '-' : eslInfo.bin_version}
                    </span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.battery' })}：
                    </span>
                    <span className="detail-info-content">{eslInfo.battery}%</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.device.status' })}：
                    </span>
                    <span className="detail-info-content">{ESL_STATES[eslInfo.status]}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.last.comm.time' })}：
                    </span>
                    <span className="detail-info-content">
                        {eslInfo.connect_time
                            ? unixSecondToDate(eslInfo.connect_time, 'YYYY-MM-DD HH:mm')
                            : '--'}
                    </span>
                </div>
            </Col>
            <Col span={COL_SPAN}>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.station.name' })}：
                    </span>
                    <span className="detail-info-content">{eslInfo.ap_name}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.bind.product.code' })}：
                    </span>
                    <span className="detail-info-content">{eslInfo.product_seq_num}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">
                        {formatMessage({ id: 'esl.device.esl.bind.product.name' })}：
                    </span>
                    <span className="detail-info-content">{eslInfo.product_name}</span>
                </div>
            </Col>
        </Row>
    );
}
