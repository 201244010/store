import React from 'react';
import { Badge } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './Tag.less';

export default ({ status, template }) => (
    <div className={styles['status-badge-wrapper']}>
        <Badge
            status={`${status}` === '1' ? 'success' : 'error'}
            text={formatMessage({ id: template[status] })}
        />
    </div>
);
