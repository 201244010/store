import MQTT from 'mqtt';
import CONFIG from '@/config';

const { WEB_SOCKET_PREFIX } = CONFIG;

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

		// this._subscribeStack = [];
		// this._publishStack = [];

		this.listenerStack = [];

		this.reconnectTimes = 0;

		this.connect = this.connect.bind(this);
		this.subscribe = this.subscribe.bind(this);
		this.publish = this.publish.bind(this);
		this.destroy = this.destroy.bind(this);

		this.registerMessageHandler = this.registerMessageHandler.bind(this);
		this.registerTopicHandler = this.registerTopicHandler.bind(this);
		this.registerErrorHandler = this.registerErrorHandler.bind(this);
	}

	connect({ address, username, password, clientId, path = '/mqtt' }) {
		return new Promise((resolve, reject) => {
			const client = MQTT.connect(
				`${WEB_SOCKET_PREFIX}://${address}`,
				{
					clientId,
					username,
					password,
					path,
				},
			);

			client.on('connect', () => {
				console.log('mqtt connect');
				this.reconnectTimes = 0;
				resolve(client);
			});

			client.on('reconnect', () => {
				console.log('mqtt reconnect', this.reconnectTimes);
				this.reconnectTimes = this.reconnectTimes + 1;
			});

			client.on('close', () => {
				console.log('mqtt close');
				if (this.reconnectTimes > 10) {
					client.end(true);
				}
			});

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
		},
		);
	}

	subscribe(topic) {
		const { client } = this;
		const { config } = this;

		client.subscribe(topic, config, () => {
			console.log('subscribe', topic);
		});
	}

	publish(topic, message) {
		const { messages } = this;
		const { client } = this;
		const { config } = this;

		messages.id += 1;
		const msg = JSON.stringify({
			msg_id: messages.id,
			params: Array.isArray(message) ? [...message] : [message],
		});

		client.publish(topic, msg, config, () => {
			console.log('publish', topic, msg);
		});
	}

	registerTopicHandler(topic, topicHandler) {
		const { client } = this;

		client.on('message', (messageTopic, message) => {
			if (messageTopic === topic) {
				console.log(messageTopic, ': received.');
				console.log('data: ', message.toString());
				topicHandler(message);
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
}

export default MqttClient;
