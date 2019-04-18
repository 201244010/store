import React from 'react';
import { STATION_STATES } from '@/constants/mapping';
import { unixSecondToDate } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import * as styles from './BaseStation.less';

const BaseStationDetail = props => {
    const { stationInfo } = props;
    return (
        <div className="detail-info">
            <div className={styles['detail-info-item']}>
                <span className={styles['detail-info-label']}>
                    {formatMessage({ id: 'esl.device.ap.id' })}：
                </span>
                <span className={styles['detail-info-content']}>{stationInfo.ap_code}</span>
            </div>
            <div className={styles['detail-info-item']}>
                <span className={styles['detail-info-label']}>
                    {formatMessage({ id: 'esl.device.ap.name' })}：
                </span>
                <span className={styles['detail-info-content']}>{stationInfo.sn}</span>
            </div>
            <div className={styles['detail-info-item']}>
                <span className={styles['detail-info-label']}>
                    {formatMessage({ id: 'esl.device.ap.model' })}：
                </span>
                <span className={styles['detail-info-content']}>{stationInfo.model}</span>
            </div>
            <div className={styles['detail-info-item']}>
                <span className={styles['detail-info-label']}>
                    {formatMessage({ id: 'esl.device.ap.version' })}：
                </span>
                <span className={styles['detail-info-content']}>
                    {`${stationInfo.status}` === '0' ? '--' : stationInfo.bin_version}
                </span>
            </div>
            <div className={styles['detail-info-item']}>
                <span className={styles['detail-info-label']}>
                    {formatMessage({ id: 'esl.device.ap.name' })}：
                </span>
                <span className={styles['detail-info-content']}>{stationInfo.name}</span>
            </div>
            <div className={styles['detail-info-item']}>
                <span className={styles['detail-info-label']}>
                    {formatMessage({ id: 'esl.device.ap.esl_num' })}：
                </span>
                <span className={styles['detail-info-content']}>
                    {`${stationInfo.status}` === '0' ? '--' : stationInfo.esl_number}
                </span>
            </div>
            <div className={styles['detail-info-item']}>
                <span className={styles['detail-info-label']}>
                    {formatMessage({ id: 'esl.device.ap.status' })}：
                </span>
                <span className={styles['detail-info-content']}>
                    {`${stationInfo.status}` === '0'
                        ? formatMessage({ id: 'esl.device.ap.inactivated.notice' })
                        : formatMessage({ id: STATION_STATES[stationInfo.status] })}
                </span>
            </div>
            {`${stationInfo.status}` === '2' && (
                <div className={styles['detail-info-item']}>
                    <span className={styles['detail-info-label']}>
                        {formatMessage({ id: 'esl.device.ap.disconnect_time' })}：
                    </span>
                    <span className={styles['detail-info-content']}>
                        {stationInfo.connect_time
                            ? unixSecondToDate(stationInfo.connect_time)
                            : '--'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default BaseStationDetail;
