// 生熟客折线分布
import React from 'react';
import SingleLine from './Charts/SingleLine';
import { SyncCustomerData } from './Charts/mock';

// Params:timeType,data

const chartOption = {
	timeType: 1,
	data: SyncCustomerData,
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
};

const foramtData = data =>
	[{ time: 1, totalCount: 0 }, ...data].map((item, index) => {
		item.name = '进客流量';
		item.time = index;
		item.value = item.totalCount;
		return item;
	});

const CurrentCustomerLine = ({ data }) => {
	console.log('wx----:', data);
	// console.log('wx----:', foramtData(data));
	const option = chartOption;
	return <SingleLine {...{ ...option, data: foramtData(data) }} />;
};

export default CurrentCustomerLine;
