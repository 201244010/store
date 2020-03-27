// 生熟客折线分布
import React from 'react';
import SingleLine from './Charts/SingleLine';
// import { SyncCustomerData } from './Charts/mock';

// Params:timeType,data
const foramtData = data =>
	[{ time: 1, orderAmout: 0 }, ...data].map((item, index) => {
		item.name = '销售额';
		item.time = index;
		item.value = item.orderAmount;
		return item;
	});

const CurrentSalesLine = ({ data }) => {
	console.log('wxxxxxx:', data);
	return (
		<SingleLine
			{...{
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
