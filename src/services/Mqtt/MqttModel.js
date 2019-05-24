import MqttClient from '@/services/Mqtt/MqttClient';

class MqttModel {
	constructor(namespace) {
		this.client = new MqttClient();

		this.namespace = namespace;
		this.username = '';
		this.address = '';
		this.password = '';
		this.clientId = '';
	}

	reducers() {
		const me = this;
		return {
			updateInfo(
				_,
				{
					payload: { username, password, address, clientId },
				}
			) {
				me.username = username;
				me.address = address;
				me.password = password;
				me.clientId = clientId;

				return {
					username,
					address,
					password,
					clientId,
					created: true,
				};
			},
		};
	}

	effects() {
		const me = this;
		return {
			*connect(_, { select }) {
				const info = yield select(state => state[me.namespace]);
				// console.log(info);
				return me.client.connect(info).then(
					client =>
						// console.log(client);
						client.connected
				);
			},

			*subscribe(
				{
					payload: { topic },
				},
				{ call }
			) {
				yield call(me.client.subscribe, topic);
			},

			*publish(
				{
					payload: { topic, message },
				},
				{ call, select }
			) {
				const { currentCompanyId } = yield select(state => state.merchant);
				const sendMessage = {
					...message,
					param: {
						...message.param,
						company_id: currentCompanyId,
					},
				};

				yield call(me.client.publish, topic, sendMessage);
			},

			*destroy(_, { call }) {
				yield call(me.client.destroy);
			},

			*registerMessageHandler(
				{
					payload: { handler },
				},
				{ call }
			) {
				yield call(me.client.registerMessageHandler, handler);
			},

			*registerTopicHandler(
				{
					payload: { topic, handler },
				},
				{ call }
			) {
				yield call(me.client.registerTopicHandler, topic, handler);
			},

			*registerErrorHandler(
				{
					payload: { handler },
				},
				{ call }
			) {
				yield call(me.client.registerErrorHandler, handler);
			},
		};
	}
}

export default MqttModel;
