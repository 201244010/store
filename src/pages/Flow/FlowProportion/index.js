import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import ProportionChart from '@/pages/Flow/ProportionChart';
import { COLORS } from './proportion';
import styles from './index.less';

@connect(
	state => ({
		flowInfo: state.flowInfo,
		flowFaceid: state.flowFaceid,
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
			flowFaceid: { list = [], libraryList = [] } = {},
		} = this.props;

		let strangerCount = 0;
		let regularCount = 0;
		countListByRegular.map(item => {
			strangerCount += item.strangerCount;
			regularCount += item.regularCount;
		});
		
		const data = [
			{
				type: 'strangerCount',
				count: strangerCount,
			},
			{
				type: 'regularCount',
				count: regularCount,
			},
		];

		let lightType = '';
		if (list.length > 0) {
			const { libraryId } = list[0];
			const lightList = libraryList.filter(item => item.id === libraryId);
			switch (lightList[0].type) {
				case 1:
					lightType = data[0].type;
					break;
				case 2:
					lightType = data[1].type;
					break;
				default:
					lightType = '';
			}
		}

		return (
			<div className={styles['flow-proportion']}>
				<div className={styles.title}>{formatMessage({ id: 'flow.proportion.rate' })}</div>
				{/* <div className={styles.description}>
					{formatMessage({ id: 'flow.proportion.rule' })}
				</div> */}
				<ProportionChart
					list={data}
					countType={data[0].type}
					lightType={lightType}
					chartName="newCustomer"
					chartTitle={formatMessage({ id: 'flow.proportion.title.new' })}
					chartColor={COLORS.COLOR_NEW}
				/>
				<ProportionChart
					list={data}
					countType={data[1].type}
					lightType={lightType}
					chartName="oldCustomer"
					chartTitle={formatMessage({ id: 'flow.proportion.title.old' })}
					chartColor={COLORS.COLOR_OLD}
				/>
			</div>
		);
	}
}
export default FlowProportion;
