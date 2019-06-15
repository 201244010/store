import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { DataView } from '@antv/data-set';

import styles from './bar.less';

const dv = new DataView();

class Bar extends Component {
	render() {
		const {
			chartStyle = {},
			dataSource = [],
			barStyle = {},
			toolTipStyle = {},
			axis = {},
		} = this.props;

		const { x = 'xAxis', y = 'yAxis' } = axis;
		const { height = 388, forceFit = true, padding = 'auto', scale = {} } = chartStyle;

		const { barColor = '#FFAA60', barActive = false, position = '', tooltip = {} } = barStyle;

		dv.source(dataSource);

		return (
			<div className={styles.chart}>
				<Chart
					height={height}
					padding={padding}
					scale={scale}
					data={dv}
					forceFit={forceFit}
				>
					<Axis name={x} />
					<Axis name={y} />
					<Tooltip crosshairs={false} {...toolTipStyle} />
					<Geom
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
