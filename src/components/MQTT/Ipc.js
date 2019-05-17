import React from 'react';
import { connect } from 'dva';


const MqttWrapper = (WrappedComponent) => {

	@connect(null, (dispatch) => ({
		async init() {
			await dispatch({
				type: 'mqttIpc/create'
			});
			// console.log('create');
			const result = await dispatch({
				type: 'mqttIpc/connect'
			});
			// console.log(result);
			if (result){
				dispatch({
					type: 'mqttIpc/registerMessageHandler'
				});
			}
			return result;
		},
		async getIPCList () {
			const list = await dispatch({
				type: 'ipcList/read'
			});
			return list;
		},
		async subscribeIPCTopics (list) {

			const typeList = [];
			list.forEach((item) => {
				// console.log(item);
				if (typeList.indexOf(item.type) < 0) {
					typeList.push(item.type);
				}
			});

			typeList.forEach(async (type) => {
				const topicEvent = await dispatch({
					type: 'mqttIpc/generateTopic',
					payload: {
						deviceType: type,
						messageType: 'event',
						method: 'sub'
					}
				});

				dispatch({
					type: 'mqttIpc/subscribe',
					payload: {
						topic: topicEvent
					}
				});

				const topicResponse = await dispatch({
					type: 'mqttIpc/generateTopic',
					payload: {
						deviceType: type,
						messageType: 'response',
						method: 'sub'
					}
				});

				dispatch({
					type: 'mqttIpc/subscribe',
					payload: {
						topic: topicResponse
					}
				});

			});
		}
	}))
	class Component extends React.Component{

		async componentDidMount() {
			// console.log(this.props);
			const { init, getIPCList, subscribeIPCTopics } = this.props;

			await init();
			const list = await getIPCList();
			// console.log(list);
			subscribeIPCTopics(list);

		}

		render () {
			return(
				<WrappedComponent {...this.props} />
			);
		}
	};

	return Component;
};

export default MqttWrapper;