import React from 'react';
import MQTTWrapper from '@/components/MQTT';
import FlowHeader from '@/pages/Flow/FlowHeader';
import FlowTotalCount from '@/pages/Flow/FlowTotalCount';
import FlowConversionRate from '@/pages/Flow/FlowConversionRate';
import FlowDistribution from '@/pages/Flow/FlowDistribution';
import FlowProportion from '@/pages/Flow/FlowProportion';
import FlowFS from '@/pages/Flow/IPC/FlowFS/Live';

import styles from './PassengerFlowLayout.less';

@MQTTWrapper
class PassengerFlowLayout extends React.PureComponent {
	render() {
		return (
			<div
				className={styles.flowLayout}
			>
				<FlowHeader />
				<div
					className={styles['flowLayout-body']}
				>
					<div
						className={styles['flowLayout-fs']}
					>
						<FlowFS />
					</div>
					<div
						className={styles['flowLayout-count']}
					>
						<FlowTotalCount />
						<FlowConversionRate />
						<div
							className={styles['flowLayout-age']}
						>
							<FlowDistribution />
							<FlowProportion />
						</div>	
					</div>
				</div>
			</div>
		);
	}
}
export default PassengerFlowLayout;
