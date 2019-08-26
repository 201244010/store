import React, { PureComponent } from 'react';
import {
	// G2,
	Chart,
	Geom,
	Axis,
	Tooltip,
	// Coord,
	Label,
	// Legend,
	View,
	// Guide,
	// Shape,
	Facet,
	// Util,
} from 'bizcharts';

// const { Text } = Guide;
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

const chartData = data.map(d => ({ ...d, limit: 1500 }));

class FacetChart extends PureComponent {
	render() {
		return (
			<div>
				<Chart
					axis={false}
					height={window.innerHeight}
					data={chartData}
					scale={{
						visitor: {
							ticks: [0, 1500, 2000],
						},
						limit: {
							ticks: [0, 1500, 2000],
						},
					}}
					padding={[30, 120, 95]}
					forceFit
				>
					<Tooltip
						crosshairs={false}
						itemTpl='<li data-index={index} style="margin-bottom:4px;"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}<br/><span style="padding-left: 16px">{value}</span></li>'
					/>
					<Axis name="action" line={null} tickLine={null} />
					<Axis name="visitor" visible={false} />
					<Axis name="limit" visible={false} />
					<Facet type="mirror" fields={['site']} transpose padding={50}>
						<View>
							<Geom type="intervalStack" position="action*limit" color="#fefefe" />
							<Geom
								type="intervalStack"
								position="action*visitor"
								color={['site', site => (site === '站点1' ? 'blue' : 'red')]}
							>
								<Label content="visitor" />
							</Geom>
						</View>
					</Facet>
				</Chart>
			</div>
		);
	}
}

export default FacetChart;
