import React, { Component } from 'react';
import { Tabs, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import SearchResult from './SearchResult';

@connect(
	state => ({
		deviceAP: state.deviceAP,
		deviceESL: state.deviceESL,
	}),
	dispatch => ({
		getESLGroupList: () => dispatch({ type: 'deviceESL/getESLGroupList' }),
		updateESLAutoUpgradeStatus: payload =>
			dispatch({ type: 'deviceESL/updateESLAutoUpgradeStatus', payload }),
		uploadESLFirmware: payload => dispatch({ type: 'deviceESL/uploadESLFirmware', payload }),
		getAPGroupList: () => dispatch({ type: 'deviceAP/getAPGroupList' }),
		updateAPAutoUpgradeStatus: payload =>
			dispatch({ type: 'deviceAP/updateAPAutoUpgradeStatus', payload }),
		uploadAPFirmware: payload => dispatch({ type: 'deviceAP/uploadAPFirmware', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class DeviceUpgrade extends Component {
	componentDidMount() {
		const { getESLGroupList } = this.props;
		getESLGroupList();
	}

	tabChange = activeTab => {
		const { getESLGroupList, getAPGroupList } = this.props;
		if (activeTab === 'esl') {
			getESLGroupList();
		} else if (activeTab === 'station') {
			getAPGroupList();
		}
	};

	render() {
		const {
			deviceESL: { eslGroupList, loading: eslLoading },
			deviceAP: { apGroupList, loading: apLoading },
			updateESLAutoUpgradeStatus,
			updateAPAutoUpgradeStatus,
			uploadESLFirmware,
			uploadAPFirmware,
			goToPath,
		} = this.props;
		return (
			<Card bordered={false}>
				<Tabs defaultActiveKey="esl" onChange={this.tabChange} animated={false}>
					<Tabs.TabPane
						tab={formatMessage({ id: 'esl.device.upgrade.tab.esl' })}
						key="esl"
					>
						<SearchResult
							{...{
								type: 'ESL',
								data: eslGroupList,
								loading: eslLoading,
								updateAutoUpgradeStatus: updateESLAutoUpgradeStatus,
								firmwareUpload: uploadESLFirmware,
								goToPath,
							}}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane
						tab={formatMessage({ id: 'esl.device.upgrade.tab.ap' })}
						key="station"
					>
						<SearchResult
							{...{
								type: 'AP',
								data: apGroupList,
								loading: apLoading,
								updateAutoUpgradeStatus: updateAPAutoUpgradeStatus,
								firmwareUpload: uploadAPFirmware,
								goToPath,
							}}
						/>
					</Tabs.TabPane>
				</Tabs>
			</Card>
		);
	}
}

export default DeviceUpgrade;
