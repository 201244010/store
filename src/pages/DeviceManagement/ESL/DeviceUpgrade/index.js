import React, { Component } from 'react';
import { Tabs } from 'antd';
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
        } = this.props;
        return (
            <div className="content-container">
                <Tabs defaultActiveKey="esl" onChange={this.tabChange} animated={false}>
                    <Tabs.TabPane
                        tab={formatMessage({ id: 'esl.device.upgrade.tab.esl' })}
                        key="esl"
                    >
                        <SearchResult
                            {...{
                                type: 'Esl',
                                data: eslGroupList,
                                loading: eslLoading,
                                updateAutoUpgradeStatus: updateESLAutoUpgradeStatus,
                                firmwareUpload: uploadESLFirmware,
                            }}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={formatMessage({ id: 'esl.device.upgrade.tab.ap' })}
                        key="station"
                    >
                        <SearchResult
                            {...{
                                type: 'Station',
                                data: apGroupList,
                                loading: apLoading,
                                updateAutoUpgradeStatus: updateAPAutoUpgradeStatus,
                                firmwareUpload: uploadAPFirmware,
                            }}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        );
    }
}

export default DeviceUpgrade;
