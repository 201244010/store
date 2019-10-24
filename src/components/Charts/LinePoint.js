import React, { PureComponent } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';

class LinePoint extends PureComponent {
	render() {
		const {
			width = 300,
			height = 400,
			data = [],
			forceFit = true,
			scale = {},
			padding = 'auto',
			animate = false,
			axis: {
				x: { name: xName = null, label: xLabel = {} } = {},
				y: { name: yName = null, label: yLabel = {} } = {},
			} = {},
			tooltip = {},
			legend = {},
			legend: {
				position: legendPosition = 'bottom',
				offsetX = 0,
				offsetY = 0,
				custom = false,
				items = [],
			} = {},
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
			<Chart
				width={width}
				height={height}
				data={data}
				forceFit={forceFit}
				scale={scale}
				padding={padding}
				animate={animate}
			>
				{Object.keys(legend).length > 0 && (
					<Legend
						custom={custom}
						position={legendPosition}
						items={items}
						offsetY={offsetY}
						offsetX={offsetX}
					/>
				)}
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
