import React, { Component } from 'react';
import { Chart, Geom, Coord, Legend } from 'bizcharts';
import { Badge } from 'antd';
import autoHeight from './autoHeight';

import styles from './pie.less';

@autoHeight()
class Pie extends Component {
	render() {
		const {
			data,
			chartStyle = {},
			colorArray
		} = this.props;
		const {
			height = 160,
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
		
		let maxItem = { value: 0 }, total = 0;
		
		data.forEach(item => {
			if(item.value > maxItem.value) {
				maxItem = item;
			}
			
			total += item.value;
		});
		const percent = parseInt(maxItem.value * 100 / total, 10);
		
		G2.Shape.registerShape("interval", "sliceShape", {
			draw(cfg, container) {
				const points = cfg.points;
				const origin = cfg.origin._origin;
				
				let path = [];
				if(origin.value === maxItem.value) {
					path.push(["M", 5 / 7, points[0].y]);
					path.push(["L", 5 / 7, points[1].y]);
					path.push(["L", 1, points[2].y]);
					path.push(["L", 1, points[3].y]);
					path.push("Z");
					path = this.parsePath(path);
					
					return container.addShape("path", {
						attrs: {
							fill: cfg.color,
							path: path
						}
					});
				} else {
					path.push(["M", 66 / 70, points[0].y]);
					path.push(["L", 66 / 70, points[1].y]);
					path.push(["L", 54 / 70, points[2].y]);
					path.push(["L", 54 / 70, points[3].y]);
					path.push("Z");
					path = this.parsePath(path);
					
					return container.addShape("path", {
						attrs: {
							fill: cfg.color,
							path: path
						}
					});
				}
				
			}
		});
	
		return (
			
			<div className={styles.chart}>
				<Chart
					scale={scale}
					height={height}
					forceFit={forceFit}
					data={data}
					padding={{ top: 0, bottom: 0, left: 0, right: '30%'}}
					animate={animate}
				>
					<Coord type="theta" innerRadius={0} />
					<Geom
						type="intervalStack"
						position="value"
						color={['name', colorArray]}
						// style={{ lineWidth: 2, stroke: '#fff' }}
						// active={active}
						shape='sliceShape'
						select={false}
					/>
				</Chart>
				
				<div className={styles.total}>
					<span className={styles.title}>{maxItem.name}占比</span>
					<span className={styles.percent}>{percent}</span>
				</div>
				
				<div className={styles.legend}>
					{data.map((item, index) => {
						return (
							<div key={index}>
								<Badge color={colorArray[index]} />
								<span className={styles['item-name']}>{item.name}</span>
								<span className={styles['item-value']}>{item.value}</span>
							</div>)
					})}
				</div>
			</div>
		);
	}
}

export default Pie;
