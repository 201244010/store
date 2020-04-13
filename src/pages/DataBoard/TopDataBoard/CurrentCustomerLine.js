// 生熟客折线分布
import React from 'react';
import SingleLine from './SingleLine';
// import { SyncCustomerData } from './Charts/mock';
import { passengerNumFormat } from '@/utils/format';

// Params:timeType,data

const foramtData = data => {
	let currentTotal = 0;
	return data.map((item, index) => {
		const { totalCount: value } = item;
		currentTotal += value;
		return {
			value: currentTotal,
			name: 'passenger',
			time: index + 1,
		};
	});
};

const CurrentCustomerLine = ({ data }) => {
	// console.log('wx----总部CurrentCustomerLine:', data);
	const dataForamt = foramtData(data);
	const chartOption = {
		chartHeight: 370,
		timeType: 1,
		data: dataForamt,
		lineColor: ['value', 'rgb(75,122,250)'],
		area: {
			// 是否填充面积
			show: true,
			color: ['l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0.1)'],
			type: 'area',
			position: 'time*value',
		},
		lineSize: 3,
		innerTitle: '',
		chartScale: {
			time: {
				type: 'linear',
				nice: false,
				min: 0,
				// tickInterval: 2,
			},
			value: {
				type: 'linear',
				nice: true,
				min: 0,
			},
		},
		formatYLabel: value => passengerNumFormat({ value, returnType: 'join' }),
		formatToolTipValue: value => passengerNumFormat({ value, returnType: 'join' }),
	};

	return <SingleLine {...chartOption} />;
};

export default CurrentCustomerLine;
