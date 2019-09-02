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

const data = [
	{
		action: '访问',
		visitor: 500,
		site: '站点1',
	},
	{
		action: '浏览',
		visitor: 400,
		site: '站点1',
	},
	{
		action: '交互',
		visitor: 300,
		site: '站点1',
	},
	{
		action: '下单',
		visitor: 200,
		site: '站点1',
	},
	{
		action: '完成',
		visitor: 100,
		site: '站点1',
	},
	{
		action: '访问',
		visitor: 550,
		site: '站点2',
	},
	{
		action: '浏览',
		visitor: 420,
		site: '站点2',
	},
	{
		action: '交互',
		visitor: 280,
		site: '站点2',
	},
	{
		action: '下单',
		visitor: 150,
		site: '站点2',
	},
	{
		action: '完成',
		visitor: 80,
		site: '站点2',
	},
];

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
	})
)
class CustomerChart extends PureComponent {
	radioChange = value => {
		console.log(value);
		const { setSearchValue } = this.props;
		setSearchValue({
			passengerFlowType: value,
		});
	};

	render() {
		return (
			<Card
				title={<CardTitle onChange={this.radioChange} />}
				className={`${styles['card-bar-wrapper']} ${styles['customer-chart']}`}
			>
				<Facet
					{...{
						data: data.map(item => ({ ...item, limit: 2000 })),
						tooltip: { crosshairs: false },
						scale: {
							visitor: {
								ticks: [0, 200, 600, 1000],
							},
							limit: {
								ticks: [0, 200, 600, 1000],
							},
						},
						axis: {
							x: { name: 'action', line: null, tickLink: null },
							y: { name: 'visitor', visible: false },
							assist: { name: 'limit', visible: false },
						},
						facet: { fields: ['site'] },
						geom: {
							position: 'action*visitor',
							color: ['site', site => (site === '站点1' ? '#2b7ac0' : '#ff6666')],
							label: { content: 'visitor' },
						},
						assistGeom: { position: 'action*limit' },
					}}
				/>
			</Card>
		);
	}
}

export default CustomerChart;
