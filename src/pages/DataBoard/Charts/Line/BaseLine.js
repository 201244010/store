import React, { PureComponent } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';

import styles from '../chartsCommon.less';

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
			// tooltip = {},
			tooltip: {
				shared = true,
				useHtml = false,
				showTitle = true,
				crosshairs = {},
				// htmlContent = (title, items) => {
				// 	const { list = [] } = items[0];
				// 	return `<div class='custom-tooltip'>${title}:${JSON.stringify(list)} </div>`;
				// },
				containerTpl = `<div class="g2-tooltip">
					<div class="g2-tooltip-title" style="margin-bottom: 4px;"></div>
						<ul class="g2-tooltip-list"></ul>
					</div>`,
				itemTpl = `<li data-index={index}>
					<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
					{name}: {value}
				</li>`,
			},
			legend = {},
			legend: {
				position: legendPosition = 'bottom',
				offsetX = 0,
				offsetY = 0,
				custom = false,
				items = [],
				marker: legendMarker = 'circle',
				itemFormatter = val => val,
			} = {},
			line: {
				type: lineType = 'line',
				position: linePosition = null,
				color: lineColor = null,
				size: lineSize,
				// shape: lineShape = 'smooth',
				// style: lineStyle = {},
				tooltip: lineTooltip = {},
				lineActive = false,
			} = {},
			area: {
				show: areaShow = false,
				color: areaColor = null,
				type: areaType = 'area',
				position: areaPositon = null,
			},
			title,
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
				{title && <h1 className={styles['chart-title']}>{title}</h1>}
				{Object.keys(legend).length > 0 && (
					<Legend
						custom={custom}
						position={legendPosition}
						items={items}
						offsetY={offsetY}
						offsetX={offsetX}
						marker={legendMarker}
						itemFormatter={itemFormatter}
					/>
				)}
				<Axis name={xName} label={xLabel} />
				<Axis name={yName} label={yLabel} />
				<Tooltip
					// htmlContent={htmlContent}
					shared={shared}
					containerTpl={containerTpl}
					itemTpl={itemTpl}
					useHtml={useHtml}
					showTitle={showTitle}
					crosshairs={crosshairs}
				/>
				<Geom
					type={lineType}
					position={linePosition}
					size={lineSize}
					color={lineColor}
					tooltip={lineTooltip}
					active={lineActive}
					// shape={lineShape}
					// style={lineStyle}
				/>
				{areaShow && (
					<Geom
						type={areaType}
						position={areaPositon}
						color={areaColor}
						tooltip={false}
					/>
				)}
				{/* {Object.keys(point).length > 0 && (
					<Geom
						type="point"
						position={pointPosition}
						size={pointSize}
						shape={pointShape}
						color={pointColor}
						style={pointStyle}
						tooltip={pointTooltip}
					/>
				)} */}
			</Chart>
		);
	}
}

export default LinePoint;
