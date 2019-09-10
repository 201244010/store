import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Guide, View } from 'bizcharts';
import DataSet from '@antv/data-set';
import { shape, COLORS } from './proportion';

import styles from './index.less';

class ProportionChart extends React.PureComponent {
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

		totalCount = totalCount === 0 ? 1 : totalCount;
		const lightPercent = (lightCount / totalCount).toFixed(2) * 100;

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

		shape(lightType, chartName);

		return (
			<div className={styles['proportion-chart']}>
				<Chart width={120} height={120} data={dv} padding={[-30, -30, -30, -30]}>
					<Coord type="theta" radius={0.6} innerRadius={0.55} />
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
							item =>
								item === lightType ? COLORS.LIGHT_COLOR : COLORS.NOR_COLOR,
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
									lightType === item ? COLORS.LIGHT_SHADOW : COLORS.NOR_SHADOW,
							},
						]}
						shape={chartName}
						tooltip={false}
					/>
					<View data={dv2}>
						<Coord type="theta" radius={0.6} innerRadius={0.55} />
						<Geom
							type="intervalStack"
							position="count"
							color={['item', [COLORS.GEOM_COLOR]]}
							tooltip={false}
						/>
					</View>
				</Chart>
			</div>
		);
	}
}

export default ProportionChart;
