import React from 'react';
import { Card, Tooltip, Icon } from 'antd';

import styles from './DisplayCard.less';

const DisplayCard = props => {
	const { title = null, infoContent = null, content = null, footer = null } = props;

	return (
		<div className={styles['card-wrapper']}>
			<Card title={null} bordered={false} hoverable>
				<div className={styles['card-title']}>
					<div>{title}</div>
					<Tooltip title={infoContent}>
						<Icon type="info-circle" />
					</Tooltip>
				</div>

				<div className={styles['card-content']}>{content}</div>

				<div className={styles['card-footer']}>{footer}</div>
			</Card>
		</div>
	);
};

export default DisplayCard;
