import React from 'react';
import { Icon } from 'antd';

import styles from './Tag.less';

const RiseDownTag = props => {
	const {
		wrapperStyle = { display: 'flex' },
		label = null,
		labelClass = '',
		labelStyle = {},
		content = null,
		contentClass = '',
		contentStyle = { marginLeft: '12px', display: 'flex', alignItems: 'center' },
	} = props;

	const IconUp = () => (
		<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
			<title>ic_up</title>
			<desc>Created with Sketch.</desc>
			<g id="组件" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g id="Data/上次比" transform="translate(-78.000000, -7.000000)">
					<g id="ic_up" transform="translate(78.000000, 7.000000)">
						<circle id="椭圆形" stroke="#FF3838" cx="8" cy="8" r="7.5" />
						<polyline
							id="路径-3"
							stroke="#FF3838"
							strokeLinecap="round"
							strokeLinejoin="round"
							transform="translate(8.000000, 6.000000) scale(1, -1) translate(-8.000000, -6.000000) "
							points="5.5 5 8.04654059 7 10.5 5"
						/>
						<rect
							id="矩形"
							fill="#FF3838"
							x="7.5"
							y="5"
							width="1"
							height="6"
							rx="0.5"
						/>
					</g>
				</g>
			</g>
		</svg>
	);

	const IconDown = () => (
		<svg
			width="16px"
			height="16px"
			viewBox="0 0 16 16"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>ic_down</title>
			<desc>Created with Sketch.</desc>
			<g id="组件" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g id="Data/环比" transform="translate(-50.000000, -7.000000)">
					<g id="ic_down" transform="translate(50.000000, 7.000000)">
						<circle id="椭圆形" stroke="#6DD13B" cx="8" cy="8" r="7.5" />
						<polyline
							id="路径-3"
							stroke="#6DD13B"
							strokeLinecap="round"
							strokeLinejoin="round"
							points="5.5 9 8.04654059 11 10.5 9"
						/>
						<rect
							id="矩形"
							fill="#6DD13B"
							x="7.5"
							y="5"
							width="1"
							height="6"
							rx="0.5"
						/>
					</g>
				</g>
			</g>
		</svg>
	);

	const StatusIcon = () => {
		if (content) {
			return parseFloat(content) > 0 ? (
				<Icon component={IconUp} />
			) : (
				<Icon component={IconDown} />
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
				<div style={{ marginLeft: '2px' }}>
					{`${
						content || content === 0
							? `${Math.round(Math.abs(content) * 100)}%`
							: '--'
					}`}
				</div>
			</div>
		</div>
	);
};

export default RiseDownTag;
