import React from 'react';
import { connect } from 'dva';
import { Chart, Facet, View, Geom, Axis } from 'bizcharts';
import { formatMessage, getLocale } from 'umi/locale';
import { getLabel, COLORS, GENDERS } from './distribution';

// import DataSet from '@antv/data-set';
import styles from './index.less';

@connect(
	state => ({
		flowInfo: state.flowInfo,
		flowFaceid: state.flowFaceid,
	}),
	dispatch => ({
		getPassengerAgeByGender: () => dispatch({ type: 'flowInfo/getPassengerAgeByGender' }),
		getAgeRanges: () => dispatch({ type: 'flowInfo/getAgeRanges' }),
	})
)
class FlowDistribution extends React.PureComponent {
	constructor(props) {
		super(props);
		this.cols = {
			visitor: {
				ticks: [0, 50],
			},
		};
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
			flowInfo: { countListByGender = [], ageRangeMap = {} } = {},
			flowFaceid: { list = [] } = {},
		} = this.props;

		const currentLanguage = getLocale();

		let lightItem = [];
		if (list.length > 0) {
			const { ageRangeCode = 0, gender = '0'} = list[0];
			const lightAge = `${ageRangeMap[ageRangeCode]}${formatMessage({ id: 'flow.distribution.age' })}`;
			const lightGender = GENDERS[gender];
			lightItem = [ lightAge, lightGender ];
		}

		const data = [];
		let male = 0;
		let female = 0;
		countListByGender.map(item => {
			male += item.maleCount;
			female += item.femaleCount;
			data.push(
				{
					age: `${ageRangeMap[item.ageRangeCode]}${formatMessage({ id: 'flow.distribution.age' })}`,
					visitor: item.maleCount,
					gender: 'male',
					max: 1,
				},
				{
					age: `${ageRangeMap[item.ageRangeCode]}${formatMessage({ id: 'flow.distribution.age' })}`,
					visitor: item.femaleCount,
					gender: 'female',
					max: 1,
				}
			);
		});

		let maxTicks = 0;
		data.map(item => {
			maxTicks = item.visitor > maxTicks ? item.visitor : maxTicks;
		});

		this.cols = {
			visitor: {
				ticks: [0, maxTicks + 20],
			},
		};

		const personTotal = (male + female) === 0 ? 1 : (male + female);
		const malePercent = (male * 100/ personTotal).toFixed(1);
		const femalePercent = (female * 100/ personTotal).toFixed(1);

		const guideData = [
			{
				title: formatMessage({ id: 'flow.distribution.male' }),
				percent: malePercent,
				num: male,
			},
			{
				title: formatMessage({ id: 'flow.distribution.female' }),
				percent: femalePercent,
				num: female,
			}
		];

		return (
			<div className={styles['flow-distribution']}>
				<p className={styles['distribution-title']}>{formatMessage({ id: 'flow.distribution.title' })}</p>
				<Chart
					width={400}
					height={204}
					data={data}
					scale={this.cols}
					padding={[-50, -53, -50, -53]}
				>
					<Axis name="age" visible line={null} tickLine={null} label={getLabel(currentLanguage)} />
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
								color={['gender', COLORS.GENDER]}
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
											if (lightItem[0] === age && lightItem[1] === gender) {
												return COLORS.MALE_LIGHT;
											}
											return COLORS.MALE;
										}
										if (lightItem[0] === age && lightItem[1] === gender) {
											return COLORS.FEMALE_LIGHT;
										}
										return COLORS.FEMALE;
									},
								]}
								style={[
									'age*gender',
									{
										shadowBlur: 8,
										shadowOffsetX: 0,
										shadowOffsetY: 0,
										shadowColor: (age, gender) => {
											if (gender === 'male') {
												if (lightItem[0] === age && lightItem[1] === gender) {
													return COLORS.MALE_SHADOW;
												}
											}
											if (lightItem[0] === age && lightItem[1] === gender) {
												return COLORS.FEMALE_SHADOW;
											}
											return COLORS.NOR_SHADOW;
										},
									},
								]}
							/>
						</View>
					</Facet>
				</Chart>
				<div className={styles['distribution-footer']}>
					{
						guideData.map(item => (
							<div className={styles['footer-item']} key={item.title}>
								<p className={styles['item-content']}><span>{item.percent}%</span><span className={styles['item-num']}>{`${item.num}${formatMessage({ id: 'flow.distribution.footer.unit' })}`}</span></p>
								<p className={styles['item-title']}>{item.title}</p>
							</div>
						))
					}
				</div>
			</div>
		);
	}
}

export default FlowDistribution;
