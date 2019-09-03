import React from 'react';
import { connect } from 'dva';
import DeviceList from './DeviceList';
import NetworkList from './NetworkList';
import EventList from './EventList';
import styles from './Network.less';

@connect(
	state => ({
		network: state.network,
	}),
	dispatch => ({
		updateAlias: ({ networkId, networkAlias }) =>
			dispatch({ type: 'network/updateAlias', payload: { networkId, networkAlias } }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		getListWithStatus: () => dispatch({ type: 'network/getListWithStatus' }),
		getList: () => dispatch({ type: 'network/getList' }),
		editNetworkId: ({ networkId, edit }) =>
			dispatch({ type: 'network/editNetworkId', payload: { networkId, edit } }),
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
	constructor(props) {
		super(props);
		this.checkTimer = null;
	}

	async componentDidMount() {
		await this.checkMQTTClient();
	}

	componentWillUnmount() {
		clearTimeout(this.checkTimer);
		const { unsubscribeTopic } = this.props;
		unsubscribeTopic();
	}

	checkMQTTClient = async () => {
		clearTimeout(this.checkTimer);
		const { checkClientExist, setAPHandler, generateTopic, subscribe } = this.props;
		const isClientExist = await checkClientExist();
		if (isClientExist) {
			const apInfoTopic = await generateTopic({ service: 'W1/response', action: 'sub' });
			await subscribe({ topic: [apInfoTopic] });
			await setAPHandler({ handler: this.apHandler });
		} else {
			this.checkTimer = setTimeout(() => this.checkMQTTClient(), 1000);
		}
	};

	apHandler = async payload => {
		const { refreshNetworkList, clearMsg } = this.props;
		const { msgId } = payload;
		console.log(payload);
		await refreshNetworkList(payload);
		await clearMsg({ msgId });
	};

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
			goToPath,
			clearMsg,
			editNetworkId
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
						clearMsg,
						setAPHandler,
						refreshNetworkList,
						goToPath,
						editNetworkId
					}}
				/>
				<div className={styles['card-network-wrapper']}>
					<DeviceList
						{...{
							deviceList,
							getAPMessage,
							getListWithStatus,
							refreshNetworkList,
						}}
					/>
				</div>
				<div className={styles['card-network-wrapper']}>
					<EventList />
				</div>
			</div>
		);
	}
}

export default Network;
