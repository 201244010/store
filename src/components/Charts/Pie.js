import React, { Component } from 'react';
import ReactFitText from 'react-fittext';
import { Chart, Geom, Coord } from 'bizcharts';
import { DataView } from '@antv/data-set';
import autoHeight from './autoHeight';

import styles from './pie.less';

@autoHeight()
class Pie extends Component {
	render() {
		const {
			total,
			percent,
			inner = 0.75,
			chartStyle = {},
			pieStyle = {},
			hasLegend = false,
			legend = <div />,
		} = this.props;

		const {
			height = 128,
			scale = {
				x: {
					type: 'cat',
					range: [0, 1],
				},
				y: {
					min: 0,
				},
			},
			padding = 'auto',
			forceFit = true,
			animate = true,
		} = chartStyle;

		const { color = '#4DBBFF', active = false } = pieStyle;
		const data = [{ x: 'direct', y: percent }, { x: 'inverse', y: 100 - percent }];

		const dv = new DataView();
		dv.source(data).transform({
			type: 'percent',
			field: 'y',
			dimension: 'x',
			as: 'percent',
		});

		return (
			<div className={styles['chart-wrapper']}>
				<ReactFitText maxFontSize={25}>
					<div className={styles.chart}>
						<Chart
							scale={scale}
							height={height}
							forceFit={forceFit}
							data={dv}
							padding={padding}
							animate={animate}
						>
							<Coord type="theta" innerRadius={inner} />
							<Geom
								type="intervalStack"
								position="percent"
								color={['x', x => (x === 'direct' ? color : '#F0F2F5')]}
								style={{ lineWidth: 2, stroke: '#fff' }}
								active={active}
								select={false}
							/>
						</Chart>

						<div className={styles.total}>{total}</div>
					</div>
				</ReactFitText>

				{hasLegend && <div className={styles.legend}>{legend}</div>}
			</div>
		);
	}
}

export default Pie;
