import MQTT from 'mqtt';
import { RECONNECT_LIMIT } from '@/constants';

class MqttClient {
    constructor(token, config = {}, category = 'store') {
        const { address, ...rest } = token;

        this.client = null;
        this.category = category;
        this.address = address;
        this.clientInfo = {
            ...rest,
        };
        this.subscribeStack = [];
        this.publishStack = [];
        this.listenerStack = [];
        this.reconnectTimes = 0;

        this.config = {
            qos: 0,
            ...config,
        };

        this.messages = {
            id: 0,
        };

        this.initial();
    }

    initial() {
        this.client = MQTT.connect(
            this.address,
            {
                ...this.clientInfo,
                clean: true,
                path: '/mqtt',
            }
        );
    }

    getClient() {
        return this.client;
    }

    connect() {
        const { client, subscribeStack, publishStack } = this;

        return new Promise(resolve => {
            client.on('connect', () => {
                console.log('mqtt connect');
                this.reconnectTimes = 0;

                if (subscribeStack.length > 0) {
                    subscribeStack.forEach(itemStr => {
                        const item = JSON.parse(itemStr);
                        this.subscribe(item.topic);
                    });
                    subscribeStack.splice(0, subscribeStack.length);
                }

                if (publishStack.length > 0) {
                    publishStack.forEach(itemStr => {
                        const item = JSON.parse(itemStr);
                        this.publish(item.topic, item.message);
                    });
                    publishStack.splice(0, publishStack.length);
                }

                resolve(true);
            });

            client.on('reconnect', () => {
                console.log('mqtt reconnect');
                this.reconnectTimes += 1;
            });

            client.on('close', () => {
                console.log('mqtt connection close. times: ', this.reconnectTimes);
                if (this.reconnectTimes > RECONNECT_LIMIT) {
                    // 重连10次终止
                    client.end(true);
                    this.reconnectTimes = 0;
                }
            });

            client.on('end', () => {
                console.log('mqtt connection end');
                resolve(false);
            });

            client.on('message', (topic, message) => {
                console.log(
                    'mqtt message received: topic: ',
                    topic,
                    ' - message: ',
                    message.toString()
                );
            });
        });
    }

    subscribe(topic) {
        const { client, subscribeStack } = this;
        if (client.connected) {
            console.log('before subscribe, topic: ', topic);
            client.subscribe(topic, this.config, () => {
                console.log('topic: ', topic, ' is subscribed');
            });
        } else {
            this.subscribeStack = [...new Set(subscribeStack.push(JSON.stringify(topic)))];
        }
    }

    publish(topic, message) {
        const {
            client,
            publishStack,
            messages: { id },
        } = this;
        this.messages.id = id + 1;

        const msg = JSON.stringify({
            msg_id: this.messages.id,
            params: Array.isArray(message) ? [...message] : [message],
        });

        if (client.connected) {
            client.publish(topic, msg, this.config, () => {
                console.log('publish', topic, msg);
            });
        } else {
            this.publishStack = [...new Set(publishStack.push(JSON.stringify({ topic, message })))];
        }
    }

    setMessageHandler(handler) {
        const { client } = this;
        console.log('regist message handler');
        if (client.on) {
            // 若init请求失败，则无法被初始化client
            client.on('message', (topic, message) => {
                handler(topic, message);
            });
        }
    }

    setErrorHandler(action) {
        const { client } = this;
        console.log('regist error handler');
        if (client && client.on) {
            client.on('error', error => {
                action(error);
            });
        }
    }
}

export default MqttClient;
