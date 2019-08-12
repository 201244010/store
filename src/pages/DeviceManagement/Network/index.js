import React from 'react';
import { connect } from 'dva';
import DeviceList from './DeviceList';
import NetworkList from './NetworkList';
import styles from './Network.less';

@connect(
	state => ({
		network: state.network,
	}),
	dispatch => ({
		getListWithStatus: () => dispatch({ type: 'network/getListWithStatus' }),
		getList: () => dispatch({ type: 'network/getList' }),
		updateAlias: (networkId, networkAlias) =>
			dispatch({ type: 'network/getListWithStatus', payload: { networkId, networkAlias } }),
		unsubscribeTopic: () => dispatch({ type: 'network/unsubscribeTopic' }),
		setAPHandler: payload => dispatch({ type: 'network/setAPHandler', payload }),
		getAPMessage: payload => dispatch({ type: 'network/getAPMessage', payload }),
		refreshNetworkList: payload => dispatch({ type: 'network/refreshNetworkList', payload }),
		checkClientExist: () => dispatch({ type: 'mqttStore/checkClientExist' }),
		generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
		subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
		clearMsg: payload => dispatch({ type: 'mqttStore/clearMsg', payload }),
	})
)
class Network extends React.Component {
	render() {
		const {
			network: { deviceList, networkList },
			getListWithStatus,
			updateAlias,
			getList,
			checkClientExist,
			generateTopic,
			subscribe,
			unsubscribeTopic,
			getAPMessage,
			setAPHandler,
			refreshNetworkList,
			clearMsg
		} = this.props;
		return (
			<div>
				<NetworkList
					{...{
						updateAlias,
						getList,
						networkList,
						checkClientExist,
						generateTopic,
						subscribe,
						unsubscribeTopic,
						deviceList,
						getAPMessage,
						setAPHandler,
						refreshNetworkList,
						clearMsg
					}}
				/>
				<div className={styles['card-network-wrapper']}>
					<DeviceList
						{...{
							deviceList,
							getAPMessage,
							getListWithStatus,
						}}
					/>
				</div>
			</div>
		);
	}
}

export default Network;
