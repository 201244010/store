import React from 'react';
import { connect } from 'dva';
import { Chart, Facet, View, Geom, Axis } from 'bizcharts';
import { formatMessage } from 'umi/locale';
import { LABEL, COLS} from './distributionShape';

// import DataSet from '@antv/data-set';
import styles from './index.less';

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
	constructor(props) {
		super(props);
		this.age = 0;
	}

	componentDidMount() {
		const { getPassengerAgeByGender, getAgeRanges } = this.props;
		getAgeRanges();
		getPassengerAgeByGender();
		clearInterval(this.age);
		this.age = setInterval(() => {
			getPassengerAgeByGender();
		},5000);
	}

	componentWillUnmount() {
		clearInterval(this.age);
	}

	render() {
		const {
			// light = ['40岁-50岁', 'male'],
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
					age: `${ageRangeMap[item.ageRangeCode]}${formatMessage({ id: 'flow.distribution.age' })}`,
					visitor: item.maleCount,
					gender: 'male',
					max: 1000,
				},
				{
					age: `${ageRangeMap[item.ageRangeCode]}${formatMessage({ id: 'flow.distribution.age' })}`,
					visitor: item.femaleCount,
					gender: 'female',
					max: 1000,
				}
			);
		});

		const personTotal = (male + female) === 0 ? 1 : (male + female);
		const malePercent = (male * 100/ personTotal).toFixed(1);
		const femalePercent = (female * 100/ personTotal).toFixed(1);

		return (
			<div className={styles['flow-distribution']}>
				<p className={styles['distribution-title']}>{formatMessage({ id: 'flow.distribution.title' })}</p>
				<Chart
					width={400}
					height={204}
					data={data1}
					scale={COLS}
					padding={[-50, -53, -50, -53]}
				>
					<Axis name="age" visible line={null} tickLine={null} label={LABEL} />
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
											// if (light[0] === age && light[1] === gender) {
											// 	return '#6CBBFF';
											// }
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
										shadowColor: 'transparent',
										// shadowColor: (age, gender) => {
										// 	if (light[0] === age && light[1] === gender) {
										// 		return '#1A56FF';
										// 	}
										// 	return 'transparent';
										// },
									},
								]}
							/>
						</View>
					</Facet>
				</Chart>
				<div className={styles['distribution-footer']}>
					<div className={styles['footer-item']}>
						<p className={styles['item-title']}>{formatMessage({ id: 'flow.distribution.male' })}</p>
						<p className={styles['item-content']}>{malePercent}%&nbsp;&nbsp;{male}</p>
					</div>
					<div className={styles['footer-item']}>
						<p className={styles['item-title']}>{formatMessage({ id: 'flow.distribution.female' })}</p>
						<p className={styles['item-content']}>{femalePercent}%&nbsp;&nbsp;{female}</p>
					</div>
				</div>
			</div>
		);
	}
}

export default FlowDistribution;
