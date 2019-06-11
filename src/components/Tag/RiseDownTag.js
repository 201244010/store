import React from 'react';
import { Icon } from 'antd';

import styles from './Tag.less';

const RiseDownTag = props => {
	const {
		wrapperStyle = {},
		label = null,
		labelClass = '',
		labelStyle = {},
		content = null,
		contentClass = '',
		contentStyle = {},
	} = props;

	const StatusIcon = () => {
		if (content) {
			return parseFloat(content) > 0 ? (
				<Icon type="caret-up" style={{ color: '#FF3838' }} />
			) : (
				<Icon type="caret-down" style={{ color: '#6DD13B' }} />
			);
		}
		return <></>;
	};

	return (
		<div className={styles['rise-down-wrapper']} style={wrapperStyle}>
			<div className={`${styles['rise-down-label']} ${labelClass}`} style={labelStyle}>
				{label}
			</div>

			<div className={`${styles['rise-down-content']} ${contentClass}`} style={contentStyle}>
				<StatusIcon />
				<div style={{ marginLeft: '2px' }}>{`${Math.abs(content) * 100}%`}</div>
			</div>
		</div>
	);
};

export default RiseDownTag;
