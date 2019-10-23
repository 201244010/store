import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Radio } from 'antd';
import Facet from '@/components/Charts/Facet';
import { DASHBOARD } from './constants';
import styles from './DashBoard.less';

const {
	SEARCH_TYPE: { PASSENGER_FLOW_TYPE },
} = DASHBOARD;

const CardTitle = ({ onChange = null }) => {
	const handleChange = e => {
		const { target: { value = null } = {} } = e;
		if (onChange) {
			onChange(value);
		}
	};

	return (
		<div className={styles['customer-card-header']}>
			<div className={styles['customer-title']}>
				{formatMessage({ id: 'customer.distribute' })}
			</div>
			<div className={styles['customer-button']}>
				<Radio.Group
					defaultValue={PASSENGER_FLOW_TYPE.GENDER}
					buttonStyle="solid"
					onChange={handleChange}
				>
					<Radio.Button value={PASSENGER_FLOW_TYPE.GENDER}>
						{formatMessage({ id: 'customer.sex' })}
					</Radio.Button>
					<Radio.Button value={PASSENGER_FLOW_TYPE.REGULAR}>
						{formatMessage({ id: 'customer.newold' })}
					</Radio.Button>
				</Radio.Group>
			</div>
		</div>
	);
};

@connect(
	({ dashboard }) => ({
		passengerFlowTypeLoading: dashboard.passengerFlowTypeLoading,
		passengerAgeInfo: dashboard.passengerAgeInfo,
		searchValue: dashboard.searchValue,
	}),
	dispatch => ({
		setSearchValue: payload => dispatch({ type: 'dashboard/setSearchValue', payload }),
		fetchPassengerAgeByTimeRange: ({ needLoading }) =>
			dispatch({ type: 'dashboard/fetchPassengerAgeByTimeRange', payload: { needLoading } }),
	})
)
class CustomerChart extends PureComponent {
	constructor(props) {
		super(props);
		this.chartWrapper = React.createRef();
	}

	radioChange = async value => {
		const { setSearchValue, fetchPassengerAgeByTimeRange } = this.props;
		await setSearchValue({
			passengerFlowType: value,
		});
		await fetchPassengerAgeByTimeRange({ needLoading: true });
	};

	formatPassengerList = ({
		passengerList = [],
		maleCount = 0,
		femaleCount = 0,
		strangerCount = 0,
		regularCount = 0,
	}) => {
		const { searchValue: { passengerFlowType } = {} } = this.props;

		let [fieldLeftCount, fieldRightCount] = [0, 0];
		if (passengerFlowType === PASSENGER_FLOW_TYPE.GENDER) {
			fieldLeftCount = maleCount;
			fieldRightCount = femaleCount;
		} else {
			fieldLeftCount = regularCount;
			fieldRightCount = strangerCount;
		}

		const totalCount = fieldLeftCount + fieldRightCount;
		const fieldLeftPercent =
			totalCount === 0 ? 0 : parseInt((fieldLeftCount / totalCount) * 100, 10);
		const fieldRightPercent = totalCount === 0 ? 0 : parseInt(100 - fieldLeftPercent, 10);

		const getTitle = ({ gender, regular }) => {
			if (passengerFlowType === PASSENGER_FLOW_TYPE.GENDER) {
				return gender !== null
					? `${formatMessage({
						id: 'common.male',
					  })}：${fieldLeftPercent}% | ${fieldLeftCount} ${formatMessage({
						id: 'common.person',
					  })}`
					: `${formatMessage({
						id: 'common.female',
					  })}：${fieldRightPercent}% | ${fieldRightCount} ${formatMessage({
						id: 'common.person',
					  })}`;
			}
			return regular !== null
				? `${formatMessage({
					id: 'customer.regular',
				  })}：${fieldLeftPercent}% | ${fieldLeftCount} ${formatMessage({
					id: 'common.person',
				  })}`
				: `${formatMessage({
					id: 'customer.stranger',
				  })}：${fieldRightPercent}% | ${fieldRightCount} ${formatMessage({
					id: 'common.person',
				  })}`;
		};

		return passengerList.map(passenger => {
			const {
				maleCount: pMaleCount = null,
				regularCount: pRegularCount = null,
				ageRange,
			} = passenger;

			return {
				...passenger,
				ageRange: `${ageRange}${formatMessage({ id: 'common.age' })}`,
				limit: totalCount === 0 ? 100 : totalCount * 2.5,
				title: getTitle({ gender: pMaleCount, regular: pRegularCount }),
			};
		});
	};

	render() {
		const {
			passengerFlowTypeLoading,
			passengerAgeInfo: {
				passengerList = [],
				maleCount = 0,
				femaleCount = 0,
				strangerCount = 0,
				regularCount = 0,
			} = {},
			searchValue: { passengerFlowType },
		} = this.props;

		const { current = {} } = this.chartWrapper;
		const { clientWidth = null } = current || {};
		const chartWidth = Math.round(clientWidth * 0.45);
		console.log(chartWidth);

		const displayPassengerList = this.formatPassengerList({
			passengerList,
			maleCount,
			femaleCount,
			strangerCount,
			regularCount,
		});

		const { limit = 100 } = displayPassengerList[0] || {};
		const ticks = [
			0,
			Math.floor(limit * 0.2),
			Math.floor(limit * 0.4),
			Math.floor(limit * 0.6),
			Math.floor(limit * 0.8),
			limit,
		];

		const geomColor =
			passengerFlowType === PASSENGER_FLOW_TYPE.GENDER
				? [
					'title',
					// eslint-disable-next-line no-shadow
					title =>
						title.indexOf(formatMessage({ id: 'common.male' })) > -1
							? '#2b7ac0'
							: '#ff6666',
				  ]
				: [
					'title',
					// eslint-disable-next-line no-shadow
					title =>
						title.indexOf(formatMessage({ id: 'customer.stranger' })) > -1
							? '#2b7ac0'
							: '#ff6666',
				  ];

		return (
			<div ref={this.chartWrapper} className={styles['chart-wrapper']}>
				<Card
					title={<CardTitle onChange={this.radioChange} />}
					className={`${styles['card-bar-wrapper']} ${
						passengerFlowTypeLoading ? '' : styles['customer-chart']
					}`}
					loading={passengerFlowTypeLoading}
				>
					<div className={styles['chart-wrapper']}>
						{chartWidth && (
							<Facet
								{...{
									width: clientWidth,
									forceFit: false,
									data: displayPassengerList,
									tooltip: { crosshairs: false },
									scale: {
										personCount: {
											ticks,
										},
										limit: {
											ticks,
										},
									},
									axis: {
										x: { name: 'ageRange', line: null, tickLink: null },
										y: { name: 'personCount', visible: false },
										assist: { name: 'limit', visible: false },
									},
									facet: { fields: ['title'] },
									geom: {
										position: 'ageRange*personCount',
										color: geomColor,
										label: { content: 'personCount' },
									},
									assistGeom: { position: 'ageRange*limit' },
								}}
							/>
						)}
					</div>
				</Card>
			</div>
		);
	}
}

export default CustomerChart;
