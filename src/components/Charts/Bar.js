import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { DataView } from '@antv/data-set';

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

		const { x = 'xAxis', y = 'yAxis' } = axis;
		const { height = 388, forceFit = true, padding = 'auto', scale = {} } = chartStyle;

		const { barColor = '#FFAA60', barActive = false, position = '', tooltip = {} } = barStyle;

		const dv = new DataView();
		dv.source(dataSource);

		return (
			<div className={styles.chart}>
				<Chart
					height={height}
					padding={padding}
					scale={scale}
					data={dataSource}
					forceFit={forceFit}
				>
					<Axis name={x} />
					<Axis name={y} />
					<Tooltip crosshairs={false} {...toolTipStyle} />
					<Geom
						adjust="stack"
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
