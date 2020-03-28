// 生熟客折线分布
import React from 'react';
// import SingleLine from '@/pages/DataBoard/Charts/Line/SingleLine';
import SingleLine from './SingleLine';
// import { SyncCustomerData } from './Charts/mock';

// Params:timeType,data
const foramtData = data => {
	let currentTotal = 0;
	return data.map((item, index) => {
		const { orderAmount: value } = item;
		currentTotal += value;
		return {
			value: currentTotal,
			name: 'amount',
			time: index + 1,
		};
	});
};
// eslint-disable-next-line arrow-body-style
const CurrentSalesLine = ({ data }) => {
	// console.log('wx----总部CurrentSalesLine:', data);
	return (
		<SingleLine
			{...{
				chartHeight: 370,
				timeType: 1,
				data: foramtData(data),
				lineColor: ['value', 'rgb(255,129,51)'],
				area: {
					// 是否填充面积
					show: true,
					color: ['l (90) 0:rgba(255,129,51, 1) 1:rgba(255,129,51,0.1)'],
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
			}}
		/>
	);
};
export default CurrentSalesLine;
