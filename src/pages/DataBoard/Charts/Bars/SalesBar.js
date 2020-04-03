// 生熟客折线分布
import React from 'react';
import SingleLine from '../Line/SingleLine';
// import { SyncCustomerData } from './mock';

const chartOption = {
	timeType: 1,
	data: SyncCustomerData,
	lineColor: 'l(270) 0:rgba(255,161,102,1) 1:rgba(255,129,51,1)',
	type: 'interval',
	// innerTitle: 'Bar AxisX：时间维度',
	lineActive: [
		true,
		{
			highlight: true,
			style: {
				fill: 'l(270) 0:rgba(255,161,102,1) 1:rgba(255,129,51,1)',
			},
		},
	],
	crosshairs: {
		type: 'rect',
	},
};

const BarSales = () => {
	const option = chartOption;
	return <SingleLine {...option} />;
};

export default BarSales;
