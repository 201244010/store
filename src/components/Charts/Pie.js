import React, { Component } from 'react';
import ReactFitText from 'react-fittext';
import { Chart, Geom, Tooltip, Coord } from 'bizcharts';
import { DataView } from '@antv/data-set';
import autoHeight from './autoHeight';

@autoHeight()
class Pie extends Component {
	render() {
		const {
			height,
			forceFit = true,
			percent,
			color,
			inner = 0.75,
			animate = true,
			colors,
			lineWidth = 1,
		} = this.props;

		const {
			data: propsData,
			selected: propsSelected = true,
			tooltip: propsTooltip = true,
		} = this.props;

		const defaultColors = colors;
		let data = propsData || [];
		let selected = propsSelected;
		let tooltip = propsTooltip;

		let formatColor;

		const scale = {
			x: {
				type: 'cat',
				range: [0, 1],
			},
			y: {
				min: 0,
			},
		};

		if (percent || percent === 0) {
			selected = false;
			tooltip = false;
			formatColor = value => {
				if (value === '占比') {
					return color || 'rgba(24, 144, 255, 0.85)';
				}
				return '#F0F2F5';
			};

			data = [
				{
					x: '占比',
					y: parseFloat(percent),
				},
				{
					x: '反比',
					y: 100 - parseFloat(percent),
				},
			];
		}

		const tooltipFormat = [
			'x*percent',
			(x, p) => ({
				name: x,
				value: `${(p * 100).toFixed(2)}%`,
			}),
		];

		const padding = [12, 0, 12, 0];
		const dv = new DataView();
		dv.source(data).transform({
			type: 'percent',
			field: 'y',
			dimension: 'x',
			as: 'percent',
		});

		return (
			<ReactFitText maxFontSize={25}>
				<div>
					<Chart
						scale={scale}
						height={height}
						forceFit={forceFit}
						data={dv}
						padding={padding}
						animate={animate}
						onGetG2Instance={this.getG2Instance}
					>
						{!!tooltip && <Tooltip showTitle={false} />}
						<Coord type="theta" innerRadius={inner} />
						<Geom
							style={{ lineWidth, stroke: '#fff' }}
							tooltip={tooltip && tooltipFormat}
							type="intervalStack"
							position="percent"
							color={['x', percent || percent === 0 ? formatColor : defaultColors]}
							selected={selected}
						/>
					</Chart>
				</div>
			</ReactFitText>
		);
	}
}

export default Pie;
