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
	state => ({
		dashboard: state.dashboard,
	}),
	dispatch => ({
		setSearchValue: payload => dispatch({ type: 'dashboard/setSearchValue', payload }),
		fetchPassengerAgeByTimeRange: ({ needLoading }) =>
			dispatch({ type: 'dashboard/fetchPassengerAgeByTimeRange', payload: { needLoading } }),
	})
)
class CustomerChart extends PureComponent {
	radioChange = async value => {
		console.log(value);
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
		const {
			dashboard: { searchValue: { passengerFlowType } = {} },
		} = this.props;

		let [fieldLeftCount, fieldRightCount] = [0, 0];
		if (passengerFlowType === PASSENGER_FLOW_TYPE.GENDER) {
			fieldLeftCount = maleCount;
			fieldRightCount = femaleCount;
		} else {
			fieldLeftCount = strangerCount;
			fieldRightCount = regularCount;
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
					id: 'customer.stranger',
					  })}：${fieldLeftPercent}% | ${fieldLeftCount} ${formatMessage({
					id: 'common.person',
					  })}`
				: `${formatMessage({
					id: 'customer.regular',
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
				limit: totalCount === 0 ? 100 : totalCount,
				title: getTitle({ gender: pMaleCount, regular: pRegularCount }),
			};
		});
	};

	render() {
		const {
			dashboard: {
				passengerFlowTypeLoading,
				passengerAgeInfo: { passengerList = [], maleCount = 0, femaleCount = 0 } = {},
			},
		} = this.props;

		const displayPassengerList = this.formatPassengerList({
			passengerList,
			maleCount,
			femaleCount,
		});

		const totalCount = maleCount === 0 && femaleCount === 0 ? 100 : maleCount + femaleCount;

		return (
			<Card
				title={<CardTitle onChange={this.radioChange} />}
				className={`${styles['card-bar-wrapper']} ${
					passengerFlowTypeLoading ? '' : styles['customer-chart']
				}`}
				loading={passengerFlowTypeLoading}
			>
				<Facet
					{...{
						data: displayPassengerList,
						tooltip: { crosshairs: false },
						scale: {
							visitor: {
								ticks: [
									0,
									parseInt(totalCount / 4, 10),
									parseInt(totalCount / 2, 10),
									totalCount,
								],
							},
							limit: {
								ticks: [
									0,
									parseInt(totalCount / 4, 10),
									parseInt(totalCount / 2, 10),
									totalCount,
								],
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
							color: [
								'title',
								// eslint-disable-next-line no-shadow
								title =>
									title.indexOf(formatMessage({ id: 'common.male' })) > -1
										? '#2b7ac0'
										: '#ff6666',
							],
							label: { content: 'personCount' },
						},
						assistGeom: { position: 'ageRange*limit' },
					}}
				/>
			</Card>
		);
	}
}

export default CustomerChart;
