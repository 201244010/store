import React from 'react';
import MQTTWrapper from '@/components/MQTT';
import FlowHeader from '@/components/FlowHeader';
import FlowTotalCount from '@/components/FlowTotalCount';
import FlowConversionRate from '@/components/FlowConversionRate';
import FlowDistribution from '@/components/FlowDistribution';
import FlowProportion from '@/components/FlowProportion';
import FlowFS from '@/components/FlowFS';

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
