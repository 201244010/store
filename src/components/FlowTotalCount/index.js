import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

@connect(
	state => ({
		flowInfo: state.flowInfo,
	}),
	dispatch => ({
		getPassengerFlowLatest: () => dispatch({ type: 'flowInfo/getPassengerFlowLatest' }),
	})
)
class FlowTotalCount extends React.PureComponent {
	componentDidMount() {
		const { getPassengerFlowLatest } = this.props;
		getPassengerFlowLatest();
		this.counter = setInterval(() => {
			getPassengerFlowLatest();
		}, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.counter);
	}

	render() {
		const {
			flowInfo: { passengerFlowCount: { latestCount = '999', earlyCount = '888' } = {} },
		} = this.props;
		return (
			<div className={styles.border}>
				<div className={styles.content}>
					<div className={styles.line} />
					<div className={styles.today}>
						<p className={styles['today-title']}>{formatMessage({ id: 'flow.totalCount.today' })}</p>
						<span className={styles['today-num']}>{latestCount}</span>
					</div>
					<div className={styles.yesterday}>
						<p className={styles['yesterday-title']}>{formatMessage({ id: 'flow.totalCount.yesterday' })}</p>
						<span className={styles['yesterday-num']}>{earlyCount}</span>
					</div>
				</div>
			</div>
		);
	}
}

export default FlowTotalCount;
