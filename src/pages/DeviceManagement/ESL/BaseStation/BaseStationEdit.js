import React from 'react';
import { Input } from 'antd';
import { formatMessage } from 'umi/locale';

const BaseStationEdit = props => {
	const { record, onChange } = props;

	return (
		<div className="detail-info">
			<div className="detail-info-item">
				<span className="detail-info-label">
					{formatMessage({ id: 'esl.device.ap.sn' })}：
				</span>
				<span className="detail-info-content">{record.sn}</span>
			</div>
			<div className="detail-info-item">
				<span className="detail-info-label">
					{formatMessage({ id: 'esl.device.ap.name' })}：
				</span>
				<div className="detail-input-wrapper">
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
