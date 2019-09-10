import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Guide, Shape, View } from 'bizcharts';
import DataSet from '@antv/data-set';
import styles from './index.less';

export default class ProportionChart extends React.PureComponent {
	render() {
		const { list = [], lightType = '', chartName } = this.props;
		const { DataView } = DataSet;
		const { Html } = Guide;

		let totalCount = 0;
		let lightCount = 0;
		const data = list.map(item => {
			totalCount += item.count;
			if (item.type === lightType) {
				lightCount = item.count;
			}
			return {
				item: item.type,
				count: item.count,
			};	
		});

		const lightPercent = (lightCount/(totalCount === 0? 1 : totalCount)).toFixed(2)*100;

		Shape.registerShape('interval', chartName, {
			draw(cfg, container) {
				const {
					points,
					origin: { _origin },
					color,
				} = cfg;
				const origin = _origin;
				const xWidth = points[2].x - points[1].x;
				let path = [];
				path.push([
					'M',
					origin.item !== lightType ? points[0].x : points[0].x - xWidth * 0.15,
					points[0].y,
				]);
				path.push([
					'L',
					origin.item !== lightType ? points[1].x : points[1].x - xWidth * 0.15,
					points[1].y,
				]);
				path.push([
					'L',
					origin.item !== lightType
						? points[0].x + xWidth
						: points[0].x + xWidth * 1.15,
					points[2].y,
				]);
				path.push([
					'L',
					origin.item !== lightType
						? points[0].x + xWidth
						: points[0].x + xWidth * 1.15,
					points[3].y,
				]);
				path.push('Z');
				path = this.parsePath(path);
				return container.addShape('path', {
					attrs: {
						fill: color,
						path,
					},
				});
			},
		});

		const dv = new DataView();
		dv.source(data).transform({
			type: 'percent',
			field: 'count',
			dimension: 'item',
			as: 'percent',
		});

		const dv2Data = [{ item: '1', count: 1 }];
		const dv2 = new DataView();
		dv2.source(dv2Data).transform({
			type: 'percent',
			field: 'count',
			dimension: 'item',
			as: 'percent',
		});

		return (
			<div className={styles['proportion-chart']}>
				<Chart width={120} height={120} data={dv} padding={[-30, -30, -30, -30]}>
					<Coord type="theta" radius={0.60} innerRadius={0.55} />
					<Axis name="percent" />
					<Tooltip />
					<Guide>
						<Html
							position={['50%', '50%']}
							html={`<span style="font-family: PingFangSC-Semibold,serif;font-size: 16px; color: #FFFFFF; text-align: center;">${lightPercent}%</span>`}
							alignX="middle"
							alignY="middle"
						/>
					</Guide>
					<Geom
						type="intervalStack"
						position="count"
						color={[
							'item*percent',
							item => item === lightType ? 'l(45) 0:#66BDFF 1:#3D84FF' : 'transparent',
						]}
						style={[
							'item*percent',
							{
								lineWidth: 0,
								stroke: '#fff',
								shadowBlur: 20,
								shadowOffsetX: 0,
								shadowOffsetY: 10,
								shadowColor: item =>
									lightType === item ? 'rgba(255,255,255,1)' : 'transparent',
							},
						]}
						shape={chartName}
						tooltip={false}
					/>
					<View data={dv2}>
						<Coord type="theta" radius={0.60} innerRadius={0.55} />
						<Geom
							type="intervalStack"
							position="count"
							color={['item', ['rgba(125,158,250,0.16)']]}
							tooltip={false}
						/>
					</View>
				</Chart>
			</div>
		);
	}
}
