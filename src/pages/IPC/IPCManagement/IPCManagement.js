
import React, { Component } from 'react';
// eslint-disable-next-line import/no-cycle
import DeviceBasicInfo from './DeviceBasicInfo';
// eslint-disable-next-line import/no-cycle
import ActiveDetection from './ActiveDetection';
// eslint-disable-next-line import/no-cycle
import BasicParams from './BasicParams';
// import NetworkSetting from './NetworkSetting';
// import CloudService from './CloudService';
import SoftwareUpdate from './SoftwareUpdate';

import styles from './IPCManagement.less';

class IPCManagement extends Component {

	render() {
		// console.log(this.props);
		const { location } = this.props;
		const { query: {sn, showModal} } = location;
		return (
			<div className={styles.wrapper}>
				<DeviceBasicInfo sn={sn} />
				<ActiveDetection sn={sn} />
				<BasicParams sn={sn} />
				{/* <NetworkSetting sn={sn} /> */}
				{/* <CloudService sn={sn} /> */}
				<SoftwareUpdate sn={sn} showModal={showModal} />
			</div>

		);
	}
}

export default IPCManagement;



