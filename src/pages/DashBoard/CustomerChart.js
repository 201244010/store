import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card } from 'antd';
import Facet from '@/components/Charts/Facet';
import styles from './DashBoard.less';

const data = [
	{
		action: '访问',
		visitor: 500,
		site: '站点1',
	},
	{
		action: '浏览',
		visitor: 400,
		site: '站点1',
	},
	{
		action: '交互',
		visitor: 300,
		site: '站点1',
	},
	{
		action: '下单',
		visitor: 200,
		site: '站点1',
	},
	{
		action: '完成',
		visitor: 100,
		site: '站点1',
	},
	{
		action: '访问',
		visitor: 550,
		site: '站点2',
	},
	{
		action: '浏览',
		visitor: 420,
		site: '站点2',
	},
	{
		action: '交互',
		visitor: 280,
		site: '站点2',
	},
	{
		action: '下单',
		visitor: 150,
		site: '站点2',
	},
	{
		action: '完成',
		visitor: 80,
		site: '站点2',
	},
];

@connect()
class CustomerChart extends PureComponent {
	render() {
		return (
			<Card
				title={formatMessage({ id: 'customer.distribute' })}
				className={`${styles['card-bar-wrapper']} ${styles['customer-chart']}`}
			>
				<Facet
					{...{
						data: data.map(item => ({ ...item, limit: 2000 })),
						scale: {
							visitor: {
								ticks: [0, 200, 600, 1000, 2000],
							},
							limit: {
								ticks: [0, 200, 600, 1000, 2000],
							},
						},
						axis: {
							x: { name: 'action', line: null, tickLink: null },
							y: { name: 'visitor', visible: false },
							assist: { name: 'limit', visible: false },
						},
						facet: { fields: ['site'] },
						geom: {
							position: 'action*visitor',
							color: ['site', site => (site === '站点1' ? 'blue' : 'red')],
							label: { content: 'visitor' },
						},
						assistGeom: { position: 'action*limit', color: '#000000' },
					}}
				/>
			</Card>
		);
	}
}

export default CustomerChart;
