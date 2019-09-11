import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import ProportionChart from '@/pages/Flow/ProportionChart';
import styles from './index.less';

@connect(
	state => ({
		flowInfo: state.flowInfo,
	}),
	dispatch => ({
		getPassengerAgeByRegular: () => dispatch({ type: 'flowInfo/getPassengerAgeByRegular' }),
	})
)
class FlowProportion extends React.PureComponent {
	constructor(props) {
		super(props);
		this.regular = 0;
	}

	componentDidMount() {
		const { getPassengerAgeByRegular } = this.props;
		getPassengerAgeByRegular();
		clearInterval(this.regular);
		this.regular = setInterval(() => {
			getPassengerAgeByRegular();
		}, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.regular);
	}

	render() {
		const {
			flowInfo: { countListByRegular = [] },
		} = this.props;

		let strangerCount = 0;
		let regularCount = 0;
		countListByRegular.map(item => {
			strangerCount += item.strangerCount;
			regularCount += item.regularCount;
		});
		const list = [
			{
				type: 'strangerCount',
				count: strangerCount,
			},
			{
				type: 'regularCount',
				count: regularCount,
			},
		];

		return (
			<div className={styles['flow-proportion']}>
				<div className={styles.title}>{formatMessage({ id: 'flow.proportion.rate' })}</div>
				<div className={styles.description}>{formatMessage({ id: 'flow.proportion.rule' })}</div>
				<ProportionChart list={list} lightType="strangerCount" chartName="newCustomer" />
				<ProportionChart list={list} lightType="regularCount" chartName="oldCustomer" />
			</div>
		);
	}
}
export default FlowProportion;
