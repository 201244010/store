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
			toolTipStyle = {},
			axis = {},
		} = this.props;

		const { x = 'xAxis', y = 'yAxis', xLabel = {}, yLabel = {} } = axis;
		const { height = 388, forceFit = true, padding = 'auto', scale = {} } = chartStyle;

		const { barColor = '#FFAA60', barActive = false, position = '', tooltip = {} } = barStyle;

		return (
			<div className={styles.chart}>
				<Chart
					height={height}
					padding={padding}
					scale={scale}
					data={dataSource}
					forceFit={forceFit}
				>
					<Axis name={x} label={xLabel} />
					<Axis name={y} label={yLabel} />
					<Tooltip crosshairs={false} {...toolTipStyle} showTitle={false} />
					<Geom
						size={dataSource.length > 31 ? 8 : 15}
						type="interval"
						color={barColor}
						active={barActive}
						position={position}
						tooltip={tooltip}
					/>
				</Chart>
			</div>
		);
	}
}

export default Bar;
