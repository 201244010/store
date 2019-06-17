import React from 'react';
import { Badge, Icon, Tooltip } from 'antd';
import { unixSecondToDate } from '@/utils/utils';
import { formatMessage } from 'umi/locale';

export default ({ record, template }) => {
	let title;
	if (`${record.status}` === '0') {
		title = formatMessage({ id: 'esl.device.ap.inactivated.notice' });
	} else if (`${record.status}` === '2') {
		title = (
			<div>
				{formatMessage({ id: 'esl.device.ap.disconnect_time' })}：<br />
				{unixSecondToDate(record.disconnect_time)}
			</div>
		);
	}

	return (
		<div className="tag-wrapper">
			<Badge
				status={`${record.status}` === '1' ? 'success' : 'error'}
				text={formatMessage({ id: template[record.status] })}
			/>
			{`${record.status}` !== '1' && (
				<Tooltip placement="bottomRight" title={title}>
					<Icon type="question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
				</Tooltip>
			)}
		</div>
	);
};
