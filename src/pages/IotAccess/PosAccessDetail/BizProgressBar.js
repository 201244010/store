import React, {Component} from 'react';
import {Chart, Coord, Axis, Guide, Geom} from 'bizcharts';
import DataSet from '@antv/data-set';

export default class BizProgressBar extends Component {
	render() {
		const {DataView} = DataSet;
		const {Html} = Guide;
		const data = [
			{
				item: '事例一',
				count: 40
			},
			{
				item: '事例二',
				count: 21
			}
		];
		const dv = new DataView();
		dv.source(data).transform({
			type: 'percent',
			field: 'count',
			dimension: 'item',
			as: 'percent'
		});
		const cols = {
			percent: {
				formatter: val => {
					val = `${val * 100}%`;
					return val;
				}
			}
		};
		return (
			<div>
				<Chart
					height={260}
					data={dv}
					scale={cols}
					padding={[10, 10, 10, 10]}
					forceFit
				>
					<Coord type="theta" radius={0.75} innerRadius={0.9} />
					<Axis name="percent" />
					<Guide>
						<Html
							position={['50%', '50%']}
							html="<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;><span style=&quot;color:#262626;font-size:2.5em&quot;>200</span>台</div>"
							alignX="middle"
							alignY="middle"
						/>
					</Guide>
					<Geom
						type="intervalStack"
						position="percent"
						color={['count', ['#ff0000', '#00ff00']]}
						style={{
							lineWidth: 1,
							stroke: '#fff'
						}}
					/>
				</Chart>
			</div>
		);
	}
}
