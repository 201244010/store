import React, { Component } from 'react';
import DeviceBasicInfo from './DeviceBasicInfo';
import ActiveDetection from './ActiveDetection';
import BasicParams from './BasicParams';
// import NetworkSetting from './NetworkSetting';
// import CloudService from './CloudService';
import SoftwareUpdate from './SoftwareUpdate';

import styles from './IPCManagement.less';

class IPCManagement extends Component {

	render() {
		// console.log(this.props);
		const { location } = this.props;
		const { query: {sn} } = location;
		return (
			<div className={styles.wrapper}>
				<DeviceBasicInfo sn={sn} />
				<ActiveDetection sn={sn} />
				<BasicParams sn={sn} />
				{/* <NetworkSetting sn={sn} /> */}
				{/* <CloudService sn={sn} /> */}
				<SoftwareUpdate sn={sn} />
			</div>

		);
	}
}

export default IPCManagement;
