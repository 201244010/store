import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
// import { DataView } from '@antv/data-set';

import styles from './bar.less';

class Bar extends Component {
	render() {
		const {
			chartStyle = {},
			dataSource = [],
			barStyle = {},
			tooltip = {},
			axis = {},
		} = this.props;

		const { x = 'xAxis', y = 'yAxis', xLabel = {}, yLabel = {} } = axis;
		const {
			width = 300,
			height = 388,
			forceFit = true,
			padding = 'auto',
			scale = {},
			animate = false,
		} = chartStyle;

		const {
			barColor = '#FFAA60',
			barActive = false,
			position = '',
			tooltip: barTooltip = {},
		} = barStyle;
		console.log('scale', scale);
		return (
			<div className={styles.chart}>
				<Chart
					width={width}
					height={height}
					padding={padding}
					scale={scale}
					data={dataSource}
					forceFit={forceFit}
					animate={animate}
				>
					<Axis name={x} label={xLabel} />
					<Axis name={y} label={yLabel} />
					<Tooltip showTitle={false} crosshairs={false} {...tooltip} />
					<Geom
						size={dataSource.length > 31 ? 8 : 15}
						type="interval"
						color={barColor}
						active={barActive}
						position={position}
						tooltip={barTooltip}
					/>
				</Chart>
			</div>
		);
	}
}

export default Bar;
