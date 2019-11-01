import MQTT from 'mqtt';
import CONFIG from '@/config';

const { WEB_SOCKET_PREFIX } = CONFIG;

const generateMsgId = () => `${parseInt(Math.random() * 11 + 10, 10)}${`${+new Date()}`.substr(5)}`;

class MqttClient {
	constructor(config) {
		this.client = null;

		this.messages = {
			id: 0,
		};

		this.config = {
			qos: 0,
			...config,
		};

		this._subscribeStack = [];
		this._publishStack = [];

		this.listenerStack = [];

		this.msgIdMap = new Map();
		this.handlerMap = new Map();
		this.reconnectTimes = 0;

		this.connect = this.connect.bind(this);
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
		this.publish = this.publish.bind(this);
		this.destroy = this.destroy.bind(this);
		this.clearMsg = this.clearMsg.bind(this);

		this.registerMessageHandler = this.registerMessageHandler.bind(this);
		this.registerTopicHandler = this.registerTopicHandler.bind(this);
		this.registerErrorHandler = this.registerErrorHandler.bind(this);
	}

	connect({ address, username, password, clientId, path = '/mqtt', reconnectPeriod = 3 * 1000 }) {
		const promise = new Promise((resolve, reject) => {
			const client = MQTT.connect(
				`${WEB_SOCKET_PREFIX}//${address}`,
				{
					clientId,
					username,
					password,
					path,
					reconnectPeriod,
				}
			);

			client.on('connect', () => {
				console.log('mqtt connect');
				this.reconnectTimes = 0;
				console.log('established client: ', client);

				this._publishStack.map(item => {
					const { topic, message } = item;
					this.publish(topic, message);
				});
				this._publishStack = [];

				resolve(client);
			});

			client.on('reconnect', () => {
				console.log(this);
				console.log('mqtt reconnect', this.reconnectTimes);
				this.reconnectTimes++;
			});

			// client.on('close', () => {
			// 	console.log('mqtt close');
			// 	if (this.reconnectTimes > 10) {
			// 		client.end(true);
			// 	}
			// });

			client.on('error', () => {
				console.log('mqtt error');
			});

			client.on('end', () => {
				console.log('mqtt end');
				reject(client);
			});

			client.on('message', (topic, message) => {
				console.log('mqtt message', topic, message.toString());
			});

			this.client = client;
		});

		return promise;
	}

	subscribe(topic) {
		const { client } = this;
		const { config } = this;

		client.subscribe(topic, config, () => {
			console.log('subscribe', topic);
		});
	}

	unsubscribe(topic) {
		const { client } = this;
		this.handlerMap.delete(topic);
		console.log('rest handler: ', this.handlerMap);
		if (client) {
			client.unsubscribe([topic], () => {
				console.log('unsubscribe', topic);
			});
		}
	}

	publish(topic, message = []) {
		// const { messages } = this;
		const { client } = this;
		console.log('publish', client);
		if (client) {
			const { config } = this;
			const { msgIdMap } = this;
			// console.log('random id ', generateMsgId());
			// messages.id += 1;
			const msgId = parseInt(generateMsgId(), 10);
			const { sn } = message.param || {};
			const msg = JSON.stringify({
				msg_id: msgId,
				params: Array.isArray(message) ? [...message] : [message],
			});

			client.publish(topic, msg, config, err => {
				console.log('publish', topic, msg, err);
				if (!err) {
					console.log(sn);
					msgIdMap.set(msgId, sn);
					console.log(msgIdMap);
				}
			});
		} else {
			this._publishStack.push({
				topic,
				message,
			});
		}
	}

	registerTopicHandler(topic, topicHandler) {
		const { client, handlerMap } = this;
		if (!handlerMap.has(topic)) {
			handlerMap.set(topic, topicHandler);
		}
		console.log('current handler: ', this.handlerMap);
		client.on('message', (messageTopic, message) => {
			console.log('message received: ', messageTopic);
			if (handlerMap.has(messageTopic)) {
				console.log('message topic: ', messageTopic, ' : received.');
				console.log('data: ', message.toString());
				handlerMap.get(messageTopic)(message);
			}
		});
	}

	registerMessageHandler(messageHandler) {
		const { client } = this;
		const { listenerStack } = this;

		client.on('message', (topic, message) => {
			messageHandler(topic, message, listenerStack);
		});
	}

	registerErrorHandler(errorHandler) {
		const { client } = this;

		client.on('error', errorHandler);
	}

	destroy() {
		const { client } = this;
		if (client) {
			client.end(true);
		}
	}

	clearMsg({ msgId }) {
		const { msgIdMap } = this;
		msgIdMap.delete(msgId);
	}
}

export default MqttClient;
