// 生熟客折线分布
import React from 'react';
import SingleLine from './SingleLine';
import { CustomerData } from '../mock';
import { passengerNumFormat } from '@/utils/format';

// Params:timeType,data

const MultiLineOption = {
	timeType: 1,
	data: CustomerData,
	linePosition: ['time*value'],
	lineColor: ['name', ['#4B7AFA', '#FF8133', '#00BC7D']],
	area: {
		show: true,
		color: [
			'name',
			[
				'l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0.1)',
				'l (90) 0:rgba(255,188,80, 1) 1:rgba(255,188,80, 0.1)',
				'l (90) 0:rgba(0,188,125, 1) 1:rgba(0,188,125, 0.1)',
			],
		],
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
	type: 'line',
	legend: {
		position: 'top-right',
		offsetX: 0,
		offsetY: 0,
		custom: false,
		marker: 'circle',
	},
	formatYLabel: value => passengerNumFormat({ value, returnType: 'join' }),
	formatToolTipValue: value => passengerNumFormat({ value, returnType: 'join' }),
};

const MultiLineCustomer = () => {
	const option = MultiLineOption;
	return <SingleLine {...option} />;
};

export default MultiLineCustomer;
