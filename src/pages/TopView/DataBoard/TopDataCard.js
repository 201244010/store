import React from 'react';
import { Tooltip, Card, Icon } from 'antd';
import { DATABOARD } from './constants';
// import { formatMessage } from 'umi/locale';
import styles from './topView.less';

const { DATA_TYPE, UNIT_FREQUENCY, EARLY_LABEL_CURRENT, EARLY_LABEL_HISTORY } = DATABOARD;

const handleEarlyLabelText = (dataType, timeType) => {
	if (dataType === DATA_TYPE.current) {
		return EARLY_LABEL_CURRENT[timeType];
	}
	if (dataType === DATA_TYPE.history) {
		return EARLY_LABEL_HISTORY[timeType];
	}
	return '';
};

const handleUnitText = (unit, timeType) => {
	if (unit === 'frequency') {
		return UNIT_FREQUENCY(timeType);
	}
	return '';
};

const EarlyData = ({ count, earlyCount, compareRate }) => {
	if (compareRate) {
		const changeRate = ((count - earlyCount) / earlyCount).toFixed(4) * 100;
		return (
			<>
				<div
					className={
						changeRate > 0 ? 'early-value__icon__rise' : 'early-value__icon__down'
					}
				/>
				<div>
					<span>{`${Math.abs(changeRate)}%`}</span>
				</div>
			</>
		);
	}
	return (
		<>
			<div>
				<span>{earlyCount}</span>
			</div>
		</>
	);
};

const TopDataCard = ({ data, dataType, timeType, loading }) => {
	const { label, unit, count, earlyCount, compareRate, toolTipText } = data;

	return (
		<Card loading={loading} bordered={false} className={styles['top-data-card']}>
			<div className="label">{label}</div>
			<div className="value">
				<span className="value__number">{count}</span>
				<span className="value__unit">{handleUnitText(unit, timeType)}</span>
			</div>
			<div className="early-value">
				<div>
					{/* // 昨日 上周 上月 、 较前一日 */}
					<span>{handleEarlyLabelText(timeType, dataType)}</span>
				</div>
				<EarlyData {...{ count, earlyCount, compareRate }} />
			</div>
			<Tooltip title={toolTipText}>
				<Icon type="info-circle" className="tooltip__icon" />
			</Tooltip>
		</Card>
	);
};

export default TopDataCard;
