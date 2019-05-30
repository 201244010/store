import React from 'react';
import { Input } from 'antd';
import { formatMessage } from 'umi/locale';

const BaseStationEdit = props => {
	const { record } = props;

	return (
		<div className="detail-info">
			<div className="detail-info-item">
				<span className="detail-info-label">
					{formatMessage({ id: 'esl.device.ap.id' })}：
				</span>
				<span className="detail-info-content">{record.ap_code}</span>
			</div>
			<div className="detail-info-item">
				<span className="detail-info-label">
					{formatMessage({ id: 'esl.device.ap.name' })}：
				</span>
				<div className="detail-input-wrapper">
					<Input defaultValue={record.name} />
				</div>
			</div>
		</div>
	);
};

export default BaseStationEdit;
