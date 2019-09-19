import React from 'react';
import MqttWrapper from '@/components/MQTT/Ipc';
import FlowHeader from '@/pages/Flow/FlowHeader';
import FlowTotalCount from '@/pages/Flow/FlowTotalCount';
import FlowConversionRate from '@/pages/Flow/FlowConversionRate';
import FlowDistribution from '@/pages/Flow/FlowDistribution';
import FlowProportion from '@/pages/Flow/FlowProportion';
import FlowFS from '@/pages/Flow/IPC/FlowFS/Live';

import styles from './PassengerFlowLayout.less';

@MqttWrapper
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
