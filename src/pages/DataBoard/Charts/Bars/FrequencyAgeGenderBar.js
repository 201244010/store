import React from 'react';
import { Progress } from 'antd';
import { formatMessage } from 'umi/locale';
import { frequencyFormat } from '@/utils/format';
// import { customerDistriData } from './mock';
import styles from '../chartsCommon.less';

// {
// foramtScaleRange ageCode 1 2 3 4 进行转换
// 	/* <FrequencyAgeGenderBar data={data} timeType={timeType} foramtScaleRange={code => {}} /> */
// }
const ageCodeToIndex = range => {
	switch (range) {
		case 1:
			return 0;
		case 4:
			return 1;
		case 5:
			return 2;
		case 6:
			return 3;
		case 7:
			return 4;
		case 8:
			return 5;
		default:
			return 0;
	}
};

const AGE_RANGE_LABEL = {
	0: formatMessage('databoard.age.range.1'),
	1: formatMessage('databoard.age.range.4'),
	2: formatMessage('databoard.age.range.5'),
	3: formatMessage('databoard.age.range.6'),
	4: formatMessage('databoard.age.range.7'),
	5: formatMessage('databoard.age.range.8'),
};

export default class FrequencyAgeGenderBar extends React.Component {
	formatData = data => {
		const dataByGender = { male: [], female: [] };
		data.forEach(item => {
			const { gender, range } = item;
			const index = ageCodeToIndex(range);
			dataByGender[gender][index] = item.value.toFixed(1, 10);
		});
		const maleMax = Math.max(...dataByGender.male);
		const femaleMax = Math.max(...dataByGender.female);
		return dataByGender.male.map((_, rangeCode) => {
			const maleVal = dataByGender.male[rangeCode];
			const femaleVal = dataByGender.female[rangeCode];
			return {
				maleVal: dataByGender.male[rangeCode],
				femaleVal: dataByGender.female[rangeCode],
				maleLineLength: (maleVal / maleMax) * 100,
				femaleLineLength: (femaleVal / femaleMax) * 100,
			};
		});
	};

	strokeColor = (gender, length) => {
		if (gender === 'male') {
			return length === 100
				? {
					from: '#709EFA',
					to: '#4B7AFA',
				  }
				: '#C8D5FA';
		}
		if (gender === 'female') {
			return length === 100
				? {
					from: '#FF9999',
					to: '#FF6666',
				  }
				: '#FFCCCC';
		}
		return 'red';
	};

	foramtValUnitByTime = (value, timeType) => {
		if (value === undefined) {
			return {
				value: '--',
				unit: '',
			};
		}
		const obj = frequencyFormat({ value, returnType: 'split' });
		if (timeType === 2) {
			const { int, float, point, unit } = obj.week;
			return {
				value: `${int}${point}${float}`,
				unit,
			};
			// return '次/周';
		}
		if (timeType === 3) {
			const { int, float, point, unit } = obj.month;
			return {
				value: `${int}${point}${float}`,
				unit,
			};
			// return '次/月';
		}
		return {
			value: '--',
			unit: '',
		};
		// return '次';
	};

	render() {
		const { data, timeType } = this.props;

		const { formatData, strokeColor, foramtValUnitByTime } = this;
		const { data: detailData, frequency: frequencyGender } = data;
		const dataByRange = formatData(detailData);
		// console.log('qqqqqq:', dataByRange);
		const maleValue = foramtValUnitByTime(frequencyGender.male, timeType);
		const femaleValue = foramtValUnitByTime(frequencyGender.female, timeType);
		const barItems = dataByRange.map((frequency, index) => {
			const { maleVal, femaleVal, maleLineLength, femaleLineLength } = frequency;
			return (
				<div className="bar-wrapper-row" key={index}>
					<div className="left">
						<Progress
							strokeColor={strokeColor('male', maleLineLength)}
							percent={maleLineLength}
							size="small"
							format={() => maleVal}
						/>
					</div>
					<div className="scale">{AGE_RANGE_LABEL[index]}</div>
					<div className="right">
						<Progress
							strokeColor={strokeColor('female', femaleLineLength)}
							percent={femaleLineLength}
							size="small"
							format={() => femaleVal}
						/>
					</div>
				</div>
			);
		});

		return (
			<div className={styles['frequency-age-gender-bar']}>
				<h1 className="chart-title">
					{formatMessage({ id: 'databoard.chart.ageGenderFrequency' })}
				</h1>
				<div className="chart-wrapper">
					<div className="overview-bar">
						<div className="left">
							<p className="value-wrapper">
								<span className="value">{maleValue.value}</span>
								<span className="unit">{maleValue.unit}</span>
							</p>
							<p className="label__male">
								{formatMessage({ id: 'databoard.chart.gender.male' })}
							</p>
						</div>
						<div className="right">
							<p className="value-wrapper">
								<span className="value">{femaleValue.value}</span>
								<span className="unit">{femaleValue.unit}</span>
							</p>
							<p className="label__female">
								{formatMessage({ id: 'databoard.chart.gender.female' })}
							</p>
						</div>
					</div>
					<div className="bar-wrapper">{barItems}</div>
				</div>
			</div>
		);
	}
}
