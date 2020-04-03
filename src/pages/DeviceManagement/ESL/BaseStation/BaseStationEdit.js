import React from 'react';
import { Input } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './BaseStation.less';

const BaseStationEdit = props => {
	const { record, onChange } = props;

	return (
		<div className={styles['detail-info']}>
			<div className={styles['detail-info-item']}>
				<span className={styles['detail-info-label']}>
					{formatMessage({ id: 'esl.device.ap.sn' })}：
				</span>
				<span className={styles['custom-modal-content']}>{record.sn}</span>
			</div>
			<div className={styles['detail-info-item']}>
				<span className={styles['detail-info-label']}>
					{formatMessage({ id: 'esl.device.ap.name' })}：
				</span>
				<div className={styles['detail-input-wrapper']}>
					<Input
						value={record.name}
						maxLength={20}
						onChange={e => onChange(e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
};

export default BaseStationEdit;
