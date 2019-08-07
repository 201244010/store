import React from 'react';
import DeviceList from './DeviceList';
import NetworkList from './NetworkList';
import styles from './Network.less';

class Network extends React.Component {

	render() {
		return (
			<div>
				<NetworkList />
				<div className={styles['card-network-wrapper']}>
					<DeviceList />
				</div>
			</div>
		);
	}
}

export default Network;
