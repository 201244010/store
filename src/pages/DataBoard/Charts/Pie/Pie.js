import React, { Component } from 'react';
import { Chart, Geom, Coord } from 'bizcharts';
import { Badge } from 'antd';
import { formatMessage } from 'umi/locale';
import autoHeight from './autoHeight';
import styles from './pie.less';

const PIE_PADDING = {
	top: 0,
	bottom: 0,
	left: 0,
	right: '30%'
};

@autoHeight()
class Pie extends Component {
	render() {
		const { data, chartStyle = {}, colorArray, chartName = 'pieChart' } = this.props;
		const {
			height = 140,
			scale = {
				x: {
					type: 'cat',
					range: [0, 1],
				},
				y: {
					min: 0,
				},
			},
			forceFit = true,
			animate = false,
		} = chartStyle;

		let maxItem = { value: 0 };
		let total = 0;

		data.forEach(item => {
			if (item.value > maxItem.value) {
				maxItem = item;
			}

			total += item.value;
		});
		const percent = Math.round((maxItem.value * 100 / total));

		if (maxItem.value === 0) {
			G2.Shape.registerShape('interval', chartName, {
				draw(cfg, container) {
					// const points = cfg.points;

					let path = [];
					path.push(['M', 6 / 7, 0]);
					path.push(['L', 6 / 7, 1]);
					path.push(['L', 1, 1]);
					path.push(['L', 1, 0]);
					path.push('Z');
					path = this.parsePath(path);

					return container.addShape('path', {
						attrs: {
							fill: 'rgba(230, 232, 235, 1)',
							path,
						},
					});
				},
			});
		} else {
			G2.Shape.registerShape('interval', chartName, {
				draw(cfg, container) {
					const points = cfg.points;
					const origin = cfg.origin._origin;
					let path = [];
					
					if (origin.value === maxItem.value && origin.name === maxItem.name) {
						path.push(['M', 5 / 7, points[0].y]);
						path.push(['L', 5 / 7, points[1].y]);
						path.push(['L', 1, points[2].y]);
						path.push(['L', 1, points[3].y]);
						path.push('Z');
						path = this.parsePath(path);

						return container.addShape('path', {
							attrs: {
								fill: cfg.color,
								path,
							},
						});
					}
					path.push(['M', 66 / 70, points[0].y]);
					path.push(['L', 66 / 70, points[1].y]);
					path.push(['L', 54 / 70, points[2].y]);
					path.push(['L', 54 / 70, points[3].y]);
					path.push('Z');
					path = this.parsePath(path);

					return container.addShape('path', {
						attrs: {
							fill: cfg.color,
							path,
						},
					});

				},
			});
		}

		return (
			<div className={styles.chart}>
				<Chart
					scale={scale}
					height={height}
					forceFit={forceFit}
					data={data}
					padding={PIE_PADDING}
					animate={animate}
				>
					<Coord type="theta" innerRadius={0} />
					<Geom
						type="intervalStack"
						position="value"
						color={['name', colorArray]}
						// style={{ lineWidth: 2, stroke: '#fff' }}
						// active={active}
						shape={chartName}
						select={false}
					/>
				</Chart>

				<div className={styles.total}>
					<span className={styles.title}>{maxItem.name}{formatMessage({id: 'databoard.data.percent'})}</span>
					<span className={styles.percent}>{percent || 0}</span>
				</div>

				<div className={styles.legend}>
					<div>
						{data.map((item, index) => (
							<div key={index}>
								<Badge color={colorArray[index]} />
								<span className={styles['item-name']}>{item.name}</span>
							</div>
						))}
					</div>
					<div>
						{data.map((item, index) => (
							<div key={index}>
								<span className={styles['item-value']}>{item.value}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default Pie;
