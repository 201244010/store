import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { DataView } from '@antv/data-set';

class Bar extends Component {
	constructor(props) {
		super(props);
		this.dv = new DataView();
	}

	render() {
		// const { chartStyle = {}, dataSource = [], axis = {}, barStyle = {} } = this.props;
		// const { x = null, y = null } = axis;
		// const { height = 400 } = chartStyle;

		const data = [
			{
				year: '1951 年',
				sales: 38,
			},
			{
				year: '1952 年',
				sales: 52,
			},
			{
				year: '1956 年',
				sales: 61,
			},
			{
				year: '1957 年',
				sales: 145,
			},
			{
				year: '1958 年',
				sales: 48,
			},
			{
				year: '1959 年',
				sales: 38,
			},
			{
				year: '1960 年',
				sales: 38,
			},
			{
				year: '1962 年',
				sales: 38,
			},
		];

		const cols = {
			sales: {
				min: 0,
				tickCount: 6,
			},
		};

		this.dv.source(data);

		return (
			<div>
				<Chart height={418} data={this.dv} scale={cols} forceFit>
					<Axis name="year" />
					<Axis name="sales" />
					<Tooltip
						crosshairs={{
							type: 'y',
						}}
					/>
					<Geom
						color="#FFAA60"
						active={[
							true,
							{
								style: {
									fill: '#FF8133',
									shadowColor: 'red',
									shadowBlur: 1,
									opacity: 0,
								},
							},
						]}
						type="interval"
						position="year*sales"
					/>
				</Chart>
			</div>
		);
	}
}

export default Bar;
