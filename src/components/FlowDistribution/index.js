import React from 'react';
import { connect } from 'dva';
import { Chart, Facet, View, Geom, Axis, Shape } from 'bizcharts';
import { formatMessage } from 'umi/locale';
// import DataSet from '@antv/data-set';
import styles from './index.less';

Shape.registerShape('interval', 'distributionShape', {
	getPoints(pointInfo) {
		const { x, y, y0, size } = pointInfo;
		const n = 60;
		const unit = size / n;
		return [
			{ x: x - (n / 3) * unit, y: y0 },
			{ x: x - (n / 2.5) * unit, y: y - y0 < unit ? y0 : y0 + unit },
			{ x: x - (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y0 : y0 + (n / 20) * unit },
			{ x: x - (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y0 : y0 + (n / 6) * unit },
			{ x: x - (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y0 : y0 + (n / 3) * unit },
			{ x: x - (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y : y - (n / 3) * unit },
			{ x: x - (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y : y - (n / 6) * unit },
			{ x: x - (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y : y - (n / 20) * unit },
			{ x: x - (n / 2.5) * unit, y: y - y0 < unit ? y : y - unit },
			{ x: x - (n / 3) * unit, y },
			{ x: x + (n / 3) * unit, y },
			{ x: x + (n / 2.5) * unit, y: y - y0 < unit ? y : y - unit },
			{ x: x + (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y : y - (n / 20) * unit },
			{ x: x + (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y : y - (n / 6) * unit },
			{ x: x + (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y : y - (n / 3) * unit },
			{ x: x + (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y0 : y0 + (n / 3) * unit },
			{ x: x + (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y0 : y0 + (n / 6) * unit },
			{ x: x + (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y0 : y0 + (n / 20) * unit },
			{ x: x + (n / 2.5) * unit, y: y - y0 < unit ? y0 : y0 + unit },
			{ x: x + (n / 3) * unit, y: y0 },
		];
	},
	draw(cfg, container) {
		const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
		const polygon = container.addShape('polygon', {
			attrs: {
				points: [
					[points[0].x, points[0].y],
					[points[1].x, points[1].y],
					[points[2].x, points[2].y],
					[points[3].x, points[3].y],
					[points[4].x, points[4].y],
					[points[5].x, points[5].y],
					[points[6].x, points[6].y],
					[points[7].x, points[7].y],
					[points[8].x, points[8].y],
					[points[9].x, points[9].y],
					[points[10].x, points[10].y],
					[points[11].x, points[11].y],
					[points[12].x, points[12].y],
					[points[13].x, points[13].y],
					[points[14].x, points[14].y],
					[points[15].x, points[15].y],
					[points[16].x, points[16].y],
					[points[17].x, points[17].y],
					[points[18].x, points[18].y],
					[points[19].x, points[19].y],
				],
				shadowColor: cfg.style.shadowColor,
				shadowBlur: cfg.style.shadowBlur,
				shadowOffsetX: cfg.style.shadowOffsetX,
				shadowOffsetY: cfg.style.shadowOffsetY,
				fill: cfg.color,
			},
		});
		return polygon;
	},
});

@connect(
	state => ({
		flowInfo: state.flowInfo,
	}),
	dispatch => ({
		getPassengerAgeByGender: () => dispatch({ type: 'flowInfo/getPassengerAgeByGender' }),
		getAgeRanges: () => dispatch({ type: 'flowInfo/getAgeRanges' }),
	})
)
class FlowDistribution extends React.PureComponent {
	componentDidMount() {
		const { getPassengerAgeByGender, getAgeRanges } = this.props;
		getAgeRanges();
		getPassengerAgeByGender();
		this.age = setInterval(() => {
			getPassengerAgeByGender();
		},5000);
	}

	componentWillUnmount() {
		clearInterval(this.age);
	}

	render() {
		const {
			light = ['40岁-50岁', 'male'],
			flowInfo: { countListByGender = [], ageRangeMap = {} } = {},
		} = this.props;
		// const data = [
		// 	{
		// 		age: '50岁以上',
		// 		visitor: 80,
		// 		gender: 'male',
		// 		max: 1000,
		// 	},
		// 	{
		// 		age: '50岁以上',
		// 		visitor: 100,
		// 		gender: 'female',
		// 		max: 1000,
		// 	},
		// 	{
		// 		age: '40岁-50岁',
		// 		visitor: 135,
		// 		gender: 'female',
		// 		max: 1000,
		// 	},
		// 	{
		// 		age: '40岁-50岁',
		// 		visitor: 140,
		// 		gender: 'male',
		// 		max: 1000,
		// 	},
		// 	{
		// 		age: '30岁-40岁',
		// 		visitor: 100,
		// 		gender: 'female',
		// 		max: 1000,
		// 	},
		// 	{
		// 		age: '30岁-40岁',
		// 		visitor: 130,
		// 		gender: 'male',
		// 		max: 1000,
		// 	},
		// 	{
		// 		age: '20岁-30岁',
		// 		visitor: 100,
		// 		gender: 'female',
		// 		max: 1000,
		// 	},
		// 	{
		// 		age: '20岁-30岁',
		// 		visitor: 120,
		// 		gender: 'male',
		// 		max: 1000,
		// 	},
		// 	{
		// 		age: '20岁以下',
		// 		visitor: 100,
		// 		gender: 'female',
		// 		max: 1000,
		// 	},
		// 	{
		// 		age: '20岁以下',
		// 		visitor: 200,
		// 		gender: 'male',
		// 		max: 1000,
		// 	},
		// ];

		const data1 = [];
		let male = 0;
		let female = 0;
		countListByGender.map(item => {
			male += item.maleCount;
			female += item.femaleCount;
			data1.push(
				{
					age: `${ageRangeMap[item.ageRangeCode]}岁`,
					visitor: item.maleCount,
					gender: 'male',
					max: 1000,
				},
				{
					age: `${ageRangeMap[item.ageRangeCode]}岁`,
					visitor: item.femaleCount,
					gender: 'female',
					max: 1000,
				}
			);
		});

		const cols = {
			visitor: {
				ticks: [0, 500],
			},
			max: {
				ticks: [0, 500],
			},
		};

		const label = {
			offset: 16,
			textStyle: {
				textAlign: 'start',
				fill: '#FFFFFF',
				fontSize: '14',
				textBaseline: 'middle',
			},
			autoRotate: true,
		};

		return (
			<div className={styles['flow-distribution']}>
				<p className={styles['distribution-title']}>{formatMessage({ id: 'flow.distribution.title' })}</p>
				<Chart
					width={400}
					height={204}
					data={data1}
					scale={cols}
					padding={[-50, -53, -50, -53]}
				>
					<Axis name="age" visible line={null} tickLine={null} label={label} />
					<Axis name="visitor" visible={false} />
					<Axis name="max" visible={false} />
					<Facet
						type="mirror"
						fields={['gender']}
						showTitle={false}
						padding={50}
						transpose
					>
						<View>
							<Geom
								type="interval"
								position="age*max"
								color={['gender', '#344166']}
								opacity={0.3}
							/>
							<Geom
								type="interval"
								position="age*visitor"
								shape="distributionShape"
								color={[
									'age*gender',
									(age, gender) => {
										if (gender === 'male') {
											if (light[0] === age && light[1] === gender) {
												return '#6CBBFF';
											}
											return '#667ECC';
										}
										return '#FF8080';
									},
								]}
								style={[
									'age*gender',
									{
										shadowBlur: 8,
										shadowOffsetX: 0,
										shadowOffsetY: 0,
										shadowColor: (age, gender) => {
											if (light[0] === age && light[1] === gender) {
												return '#1A56FF';
											}
											return 'transparent';
										},
									},
								]}
							/>
						</View>
					</Facet>
				</Chart>
				<div className={styles['distribution-footer']}>
					<div className={styles['footer-item']}>
						<p className={styles['item-title']}>{formatMessage({ id: 'flow.distribution.male' })}</p>
						<p className={styles['item-content']}>{(male * 100/((male + female) === 0 ? 1 : (male + female))).toFixed(1)}%&nbsp;&nbsp;{male}</p>
					</div>
					<div className={styles['footer-item']}>
						<p className={styles['item-title']}>{formatMessage({ id: 'flow.distribution.female' })}</p>
						<p className={styles['item-content']}>{(female * 100/((male + female) === 0 ? 1 : (male + female))).toFixed(1)}%&nbsp;&nbsp;{female}</p>
					</div>
				</div>
			</div>
		);
	}
}

export default FlowDistribution;
