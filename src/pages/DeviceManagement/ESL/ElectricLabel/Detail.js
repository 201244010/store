import React from 'react';
import { Col, Row } from 'antd';
import { unixSecondToDate } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

const ROW_GUTTER = 16;
const COL_SPAN = 12;
const ESL_STATES = {
	0: formatMessage({ id:'esl.device.esl.inactivated' }),
	1: formatMessage({ id: 'esl.device.esl.push.wait.bind' }),
	2: formatMessage({ id: 'esl.device.esl.push.wait' }),
	3: formatMessage({ id: 'esl.device.esl.push.success' }),
	4: formatMessage({ id: 'esl.device.esl.push.fail' }),
};

export default function detail(props) {
	const { detailInfo: eslInfo } = props;

	return (
		<div className={styles['detail-info']}>
			<Row gutter={ROW_GUTTER}>
				<Col span={COL_SPAN}>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.id' })}：
						</span>
						<span className={styles['detail-info-content']}>
							{eslInfo.esl_code || '--'}
						</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.sn' })}：
						</span>
						<span className={styles['detail-info-content']}>{eslInfo.sn || '--'}</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.model.name' })}：
						</span>
						<span className={styles['detail-info-content']}>
							{eslInfo.model || '--'}
						</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.screen.size' })}：
						</span>
						<span className={styles['detail-info-content']}>
							{eslInfo.screen_size || '--'}
						</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.ware.version' })}：
						</span>
						<span className={styles['detail-info-content']}>
							{eslInfo.status === 0 ? '-' : eslInfo.bin_version || '--'}
						</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.battery' })}：
						</span>
						<span className={styles['detail-info-content']}>{eslInfo.battery}%</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.signal.strength' })}：
						</span>
						<span className={styles['detail-info-content']}>{eslInfo.rssi || '--'}</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.status' })}：
						</span>
						<span className={styles['detail-info-content']}>
							{ESL_STATES[eslInfo.status] || '--'}
						</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.last.comm.time' })}：
						</span>
						<span className={styles['detail-info-content']}>
							{eslInfo.connect_time ? unixSecondToDate(eslInfo.connect_time) : '--'}
						</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.push.time' })}：
						</span>
						<span className={styles['detail-info-content']}>
							{eslInfo.push_time ? unixSecondToDate(eslInfo.push_time) : '--'}
						</span>
					</div>
				</Col>
				<Col span={COL_SPAN}>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.station.name' })}：
						</span>
						<span className={styles['detail-info-content']}>
							{eslInfo.ap_name || '--'}
						</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.bind.product.code' })}：
						</span>
						<span className={styles['detail-info-content']}>
							{eslInfo.product_seq_num || '--'}
						</span>
					</div>
					<div className={styles['detail-info-item']}>
						<span className={styles['detail-info-label']}>
							{formatMessage({ id: 'esl.device.esl.bind.product.name' })}：
						</span>
						<span className={styles['detail-info-content']}>
							{eslInfo.product_name || '--'}
						</span>
					</div>
				</Col>
			</Row>
		</div>
	);
}
