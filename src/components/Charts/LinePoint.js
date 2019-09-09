import React, { PureComponent } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';

class LinePoint extends PureComponent {
	render() {
		const {
			height = 400,
			data = [],
			forceFit = true,
			scale = {},
			padding = ['15%', '10%'],
			axis: {
				x: { name: xName = null, label: xLabel = {} } = {},
				y: { name: yName = null, label: yLabel = {} } = {},
			} = {},
			tooltip = {},
			line: {
				position: linePosition = null,
				color: lineColor = null,
				size: lineSize = 2,
				shape: lineShape = 'smooth',
				style: lineStyle = {},
				tooltip: lineTooltip = {},
			} = {},
			point: {
				position: pointPosition = null,
				color: pointColor = null,
				size: pointSize = 4,
				shape: pointShape = 'circle',
				style: pointStyle = {},
				tooltip: pointTooltip = {},
			} = {},
		} = this.props;


		return (
			<Chart height={height} data={data} forceFit={forceFit} scale={scale} padding={padding}>
				<Axis name={xName} label={xLabel} />
				<Axis name={yName} label={yLabel} />
				<Tooltip
					showTitle={false}
					crosshairs={{ type: 'rect', fill: '#000000' }}
					{...tooltip}
				/>
				<Geom
					type="line"
					position={linePosition}
					size={lineSize}
					color={lineColor}
					shape={lineShape}
					style={lineStyle}
					tooltip={lineTooltip}
				/>
				<Geom
					type="point"
					position={pointPosition}
					size={pointSize}
					shape={pointShape}
					color={pointColor}
					style={pointStyle}
					tooltip={pointTooltip}
				/>
			</Chart>
		);
	}
}

export default LinePoint;
