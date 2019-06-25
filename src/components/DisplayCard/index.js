import React from 'react';
import { Card, Tooltip, Icon } from 'antd';

import styles from './DisplayCard.less';

const DisplayCard = props => {
	const {
		title = null,
		infoContent = null,
		needTip = false,
		content = null,
		footer = null,
		loading = false,
		extra = <></>,
		cardStyle = {},
		onClick = null,
	} = props;

	return (
		<div
			className={styles['card-wrapper']}
			style={cardStyle}
			onClick={() => {
				if (onClick) {
					onClick();
				}
			}}
		>
			<Card title={null} bordered={false} loading={loading}>
				<div className={styles['card-title']}>
					<div>{title}</div>
					{needTip && (
						<Tooltip title={infoContent}>
							<Icon type="info-circle" />
						</Tooltip>
					)}
				</div>

				<div className={styles['card-content']}>{content}</div>
				<div className={styles['card-footer']}>{footer}</div>
				{extra}
			</Card>
		</div>
	);
};

export default DisplayCard;
