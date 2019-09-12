import React from 'react';
import { Badge } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './Tag.less';

const STATUS = {
	SUCCESS: 'success',
	ERROR: 'error'
};

export default ({ status, template }) => (
	<div className={status === 1 ? styles['status-badge-wrapper-success'] : styles['status-badge-wrapper-error']}>
		<Badge
			status={`${status}` === '1' ? STATUS.SUCCESS : STATUS.ERROR}
			text={formatMessage({ id: template[status] })}
		/>
	</div>
);
