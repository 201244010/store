import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { DataView } from '@antv/data-set';

class Bar extends Component {
	constructor(props) {
		super(props);
		this.dv = new DataView();
	}

	render() {
		const { chartStyle = {}, dataSource = [], barStyle = {} } = this.props;
		const chartOptions = {
			height: 418,
			forceFit: true,
			padding: 'auto',
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

		return (
			<div>
				<Chart {...chartOptions} data={this.dv}>
					<Axis name="x" />
					<Axis name="y" />
					<Tooltip crosshairs={false} />
					<Geom {...barOptions} />
				</Chart>
			</div>
		);
	}
}

export default Bar;
