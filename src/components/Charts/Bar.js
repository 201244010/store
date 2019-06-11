import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';

class Bar extends Component {
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

		return (
			<div>
				<Chart height={400} data={data} scale={cols} forceFit>
					<Axis name="year" />
					<Axis name="sales" />
					<Tooltip
						crosshairs={{
							type: 'y',
						}}
					/>
					<Geom
						active={[
							true,
							{
								style: {
									fill: 'black', // 柱子颜色，继续默哀
									shadowColor: 'red', // 整体阴影颜色，包括边缘
									shadowBlur: 1, // 阴影的透明度
									opacity: 0, // 柱子颜色透明度
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
