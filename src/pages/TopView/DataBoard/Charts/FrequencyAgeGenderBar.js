import React from 'react';
import { Progress } from 'antd';
import { customerDistriData } from './mock';
import styles from './frequencyAgeGenderBar.less';

// {
// foramtScaleRange ageCode 1 2 3 4 进行转换
// 	/* <FrequencyAgeGenderBar data={data} timeType={timeType} foramtScaleRange={code => code} /> */
// }
export default class FrequencyAgeGenderBar extends React.Component {
	formatData = data => {
		const dataByGender = { male: [], female: [] };
		data.forEach(item => {
			const { gender, value, range } = item;
			dataByGender[gender][range - 1] = value;
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

	foramtValUnitByTime = timeType => {
		if (timeType === 2) {
			return '次/周';
		}
		if (timeType === 3) {
			return '次/月';
		}
		return '次';
	};

	render() {
		const { data = customerDistriData, foramtAgeRange = val => val, timeType = 2 } = this.props;

		const { formatData, strokeColor, foramtValUnitByTime } = this;
		const { data: detailData, frequency: frequencyGender } = data;
		const dataByRange = formatData(detailData);
		const valUnit = foramtValUnitByTime(timeType);
		console.log('----------wx:', dataByRange);
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
					<div className="scale">{foramtAgeRange(index + 1)}</div>
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
				<h1 className="chart-title">客群平均到店频次</h1>
				<div className="chart-wrapper">
					<div className="overview-bar">
						<div className="left">
							<p className="value-wrapper">
								<span className="value">{frequencyGender.male}</span>
								<span className="unit">{valUnit}</span>
							</p>
							<p className="label__male">男性</p>
						</div>
						<div className="right">
							<p className="value-wrapper">
								<span className="value">{frequencyGender.female}</span>
								<span className="unit">{valUnit}</span>
							</p>
							<p className="label__female">女性</p>
						</div>
					</div>
					<div className="bar-wrapper">{barItems}</div>
				</div>
			</div>
		);
	}
}
