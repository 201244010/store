import React, { PureComponent } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import _ from 'lodash';

import styles from '../chartsCommon.less';

class LinePoint extends PureComponent {
	thickInterval = (scale, data) => {
		if (!data.rows.length)
			return {
				...scale,
				value: {
					type: 'linear',
					nice: true,
					min: 0,
					// tickCount: 6,
				},
			};
		// 计算y轴最大值,最小值
		const max = _.maxBy(data.rows, o => o.value).value;
		const min = _.minBy(data.rows, o => o.value).value;
		// console.log('groupBy', max, min, data.rows);
		// return scale;
		if (min < 0) {
			// 自适应
			return scale;
		}
		if (max < 10) {
			return {
				...scale,
				value: {
					type: 'linear',
					nice: false,
					max: 10,
					tickCount: 6,
				},
			};
		}
		if (max < 50) {
			return {
				...scale,
				value: {
					type: 'linear',
					nice: true,
					max: 50,
					tickCount: 6,
				},
			};
		}
		//  max > 50 计算数字位数n * 10
		// const mul = 10 ** Math.floor(Math.log10(max / 5));
		// const tickInterval = Math.ceil(max / 5 / mul) * mul;
		// console.log('groupBy calc:Max', tickInterval * 5);
		return {
			...scale,
			value: {
				type: 'linear',
				nice: true,
				tickCount: 6,
				// tickInterval,
				// max: tickInterval * 5,
				// max: 20,
			},
		};
	};

	pointShow = (data, type) => {
		// console.log('before-lodash', data.rows);
		if (type !== 'interval') {
			const dataList = _.groupBy(data.rows, 'time');
			//  只有一个时刻有数据，无法连线
			// console.log('lodash', dataList);
			return Object.keys(dataList).length === 1;
		}
		return false;
	};

	render() {
		const { pointShow, thickInterval } = this;
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

		const scaleFormat = thickInterval(scale, data);
		// const min = _.minBy(data.rows, o => o.value).value;
		// console.log('thickInterval-min-scaleMax:', min, scaleFormat.value.max);

		return (
			<Chart
				width={width}
				height={height}
				scale={scaleFormat}
				data={data}
				forceFit={forceFit}
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
						active={false}
					/>
				)}
				{pointShow(data, lineType) && (
					<Geom
						type="point"
						position="time*value"
						size={4}
						shape="circle"
						color={lineColor}
						style={{
							stroke: '#fff',
							lineWidth: 1,
						}}
						tooltip={lineTooltip}
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
