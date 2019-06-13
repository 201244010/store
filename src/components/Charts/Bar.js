import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { DataView } from '@antv/data-set';

class Bar extends Component {
	constructor(props) {
		super(props);
		this.dv = new DataView();
	}

	render() {
		const { chartStyle = {}, dataSource = [], axis = {}, barStyle = {} } = this.props;
		const { x = null, y = null } = axis;
		const chartOptions = {
			height: 418,
			forceFit: true,
			scale: {
				min: 0,
				tickCount: 6,
			},
			...chartStyle,
		};

		const barOptions = {
			type: 'interval',
			color: '#FFAA60',
			active: [
				true,
				{
					style: {
						fill: '#FF8133',
						shadowColor: 'red',
						shadowBlur: 1,
						opacity: 0,
						...(barStyle.activeStyle || {}),
					},
				},
			],
			position: '',
			...barStyle,
		};

		this.dv.source(dataSource);
		console.log(this.dv);
		console.log(axis);

		return (
			<div>
				<Chart {...chartOptions} data={this.dv}>
					<Axis name={x} />
					<Axis name={y} />
					<Tooltip
						crosshairs={{
							type: 'y',
						}}
					/>
					<Geom {...barOptions} />
				</Chart>
			</div>
		);
	}
}

export default Bar;
