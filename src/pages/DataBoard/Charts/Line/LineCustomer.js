// 生熟客折线分布
import React from 'react';
import SingleLine from './SingleLine';
import { SyncCustomerData } from '../mock';

// Params:timeType,data

const chartOption = {
	timeType: 3,
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
	innerTitle: 'chart title area=true',
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

const LineCustomer = () => {
	const option = chartOption;
	return <SingleLine {...option} />;
};

export default LineCustomer;
