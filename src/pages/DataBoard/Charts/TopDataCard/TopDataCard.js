import React from 'react';
import { Tooltip, Card, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import {
	formatFloatByPermile,
	frequencyFormat,
	passengerNumFormat,
	saleMoneyFormat,
} from '@/utils/format';
import { DATABOARD } from '../constants';
// import { formatMessage } from 'umi/locale';
import styles from '../chartsCommon.less';

const {
	DATA_TYPE,
	UNIT_FREQUENCY,
	EARLY_LABEL_CURRENT,
	EARLY_LABEL_HISTORY_COMPARE,
	EARLY_LABEL_HISTORY_COMMON,
	FREQUENCY_TYPE,
	LABEL_TEXT,
} = DATABOARD;

const handleEarlyLabelText = (timeType, dataType, label) => {
	// console.log('timeType', timeType, 'dataType', dataType);
	if (dataType === DATA_TYPE.current) {
		return `${EARLY_LABEL_CURRENT[timeType]}`;
	}
	if (dataType === DATA_TYPE.history) {
		if (label === 'enteringRate') {
			return `${EARLY_LABEL_HISTORY_COMMON[timeType]}`;
		}
		return `${EARLY_LABEL_HISTORY_COMPARE[timeType]}`;
	}
	return '';
};

const handleUnitText = (unit, count, timeType) => {
	if (count === undefined) {
		return '';
	}
	if (unit === 'frequency') {
		return UNIT_FREQUENCY[timeType];
	}
	if (unit === 'percent') {
		return '%';
	}
	const { unit: countUnit } = passengerNumFormat({ value: count, returnType: 'split' });
	return countUnit;
};

const handleFormat = (count, fn) => {
	const { int, point, float } = fn({ value: count, returnType: 'split' });
	return `${int}${point}${float}`;
};

const handleCountFormat = (count, label, timeType) => {
	if (count === undefined) {
		return '--';
	}
	// let int, point, float;
	switch (label) {
		case 'totalPassengerCount':
		case 'passengerCount':
		case 'deviceCount':
		case 'totalCount':
		case 'strangerCount':
		case 'regularCount':
			return handleFormat(count, passengerNumFormat);
		case 'totalAmount':
			return handleFormat(count, saleMoneyFormat);
		case 'enteringRate':
		case 'transactionRate':
			return handleFormat(count, formatFloatByPermile);
		case 'avgFrequency': {
			const type = FREQUENCY_TYPE[timeType];
			const { int, point, float } = frequencyFormat({ value: count, returnType: 'split' })[
				type
			];
			return `${int}${point}${float}`;
		}
		default:
			return count;
	}
};

const EarlyLabel = ({ label, dataType, timeType }) => {
	switch (label) {
		case 'deviceCount':
			return <span>{formatMessage({ id: 'databoard.onlineDeviceCount' })} </span>;
		default:
			return <span>{handleEarlyLabelText(timeType, dataType, label)} </span>;
	}
};

const EarlyData = ({ count, earlyCount, compareRate, chainRate, label, unit, timeType }) => {
	if (compareRate) {
		if (!earlyCount) return '--';
		let changeRate;
		if (chainRate) {
			// 环比
			changeRate = earlyCount ? count - earlyCount : undefined;
		} else {
			changeRate = earlyCount ? (count - earlyCount) / earlyCount : undefined;
		}
		const formatRate =
			typeof changeRate === 'number' &&
			formatFloatByPermile({
				value: Math.abs(changeRate),
				returnType: 'join',
			});
		return (
			<>
				{changeRate === undefined ? (
					''
				) : (
					<div
						className={
							changeRate < 0 ? 'early-value__icon__down' : 'early-value__icon__rise'
						}
					/>
				)}
				<div>
					<span>{changeRate === undefined ? '--' : formatRate}</span>
				</div>
			</>
		);
	}
	return (
		<>
			<div className="text">
				<span>{handleCountFormat(earlyCount, label, timeType)}</span>
				<span>{handleUnitText(unit, earlyCount, timeType)}</span>
			</div>
		</>
	);
};

const TopDataCard = ({ data, dataType, timeType, loading, onClick = null }) => {
	const { label, unit, count, earlyCount, compareRate, toolTipText, chainRate, labelText } = data;

	return (
		<Card
			bordered={false}
			className={styles['top-data-card']}
			loading={loading}
			onClick={onClick}
		>
			<div className="label">{labelText || LABEL_TEXT[label]}</div>
			<div className="value">
				<span className="value__number">{handleCountFormat(count, label, timeType)}</span>
				<span className="value__unit">{handleUnitText(unit, count, timeType)}</span>
			</div>
			<div className="early-value">
				<div className="label">
					{/* // 昨日 上周 上月 、 较前一日 */}
					<EarlyLabel {...{ label, dataType, timeType }} />
				</div>
				<EarlyData
					{...{ count, earlyCount, compareRate, label, unit, timeType, chainRate }}
				/>
			</div>
			{toolTipText && (
				<Tooltip title={toolTipText}>
					<Icon type="info-circle" className="tooltip__icon" />
				</Tooltip>
			)}
		</Card>
	);
};

export default TopDataCard;
