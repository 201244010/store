import React, { Component } from 'react';
import { notification } from 'antd';
import { connect } from 'dva';
import { displayNotification } from '@/components/Notification';
import VideoPlayComponent from '@/pages/IPC/component/VideoPlayComponent';
import { REGISTER_PUB_MSG } from '@/constants/mqttStore';
import { ACTION_MAP } from '@/constants/mqttActionMap';
import { getRandomString } from '@/utils/utils';

import Ipc from './Ipc';

function MQTTWrapper(WrapperedComponent) {
	@connect(
		null,
		dispatch => ({
			getUserInfo: () => dispatch({ type: 'user/getUserInfo' }),
			initializeClient: () => dispatch({ type: 'mqttStore/initializeClient' }),
			generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
			subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
			publish: payload => dispatch({ type: 'mqttStore/publish', payload }),
			setTopicListener: payload => dispatch({ type: 'mqttStore/setTopicListener', payload }),
			setMessageHandler: payload =>
				dispatch({ type: 'mqttStore/setMessageHandler', payload }),
			destroyClient: () => dispatch({ type: 'mqttStore/destroyClient' }),
			getNotificationCount: () => dispatch({ type: 'notification/getNotificationCount' }),
			goToPath: (pathId, urlParams = {}) =>
				dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		})
	)
	@Ipc
	class Wrapper extends Component {
		constructor(props) {
			super(props);
			this.state = {
				notificationList: [],
				isWatchVideo: false,
				videoUrl: '',
				ipcType: '',
			};
		}

		componentDidMount() {
			this.initClient();
		}

		componentWillUnmount() {
			const { destroyClient } = this.props;
			destroyClient();
		}

		watchVideoClose = () => {
			this.setState({
				videoUrl: '',
				isWatchVideo: false,
			});
		};

		removeNotification = key => {
			const { notificationList } = this.state;
			const keyList = [...notificationList];
			keyList.splice(keyList.indexOf(key), 1);
			notification.close(key);
			this.setState({
				notificationList: keyList,
			});
		};

		handleAction = (action, paramsStr) => {
			const { goToPath } = this.props;
			if (action) {
				const handler = ACTION_MAP[action] || (() => null);
				const result = handler({ handlers: { goToPath }, params: paramsStr });

				const { action: resultAction = null, payload = {} } = result || {};
				if (resultAction === 'showMotionVideo') {
					const { url, ipcType } = payload;
					this.setState({
						isWatchVideo: true,
						videoUrl: url,
						ipcType,
					});
				}
			}
		};

		showNotification = data => {
			const { notificationList } = this.state;
			const { getNotificationCount } = this.props;
			const messageData = JSON.parse(data.toString()) || {};
			const uniqueKey = getRandomString();

			if (notificationList.length >= 3) {
				this.removeNotification(notificationList.shift());
			}

			this.setState({
				notificationList: [...notificationList, uniqueKey],
			});
			const { params = [] } = messageData;
			params.forEach(item => {
				const { param = {} } = item;
				displayNotification({
					data: param,
					key: uniqueKey,
					mainAction: this.handleAction,
					subAction: (action, paramsStr) =>
						this.handleAction(action, paramsStr, { key: uniqueKey }),
					closeAction: this.removeNotification,
				});
			});
			getNotificationCount();
		};

		initClient = async () => {
			const {
				getUserInfo,
				initializeClient,
				generateTopic,
				setTopicListener,
				subscribe,
				publish,
			} = this.props;

			await getUserInfo();
			const initializeStatus = await initializeClient();
			if (initializeStatus === 'success') {
				const registerTopic = await generateTopic({ service: 'register', action: 'sub' });
				const registerTopicPub = await generateTopic({
					service: 'register',
					action: 'pub',
				});
				const notificationTopic = await generateTopic({
					service: 'notification',
					action: 'sub',
				});

				await setTopicListener({ service: 'notification', handler: this.showNotification });

				await subscribe({ topic: [registerTopic, notificationTopic] });
				// console.log('subscribed');
				await publish({ topic: registerTopicPub, message: REGISTER_PUB_MSG });
			}
		};

		render() {
			const { isWatchVideo, videoUrl, ipcType } = this.state;

			return (
				<>
					<WrapperedComponent {...this.props} />
					<VideoPlayComponent
						playing={isWatchVideo}
						watchVideoClose={this.watchVideoClose}
						videoUrl={videoUrl}
						ipcType={ipcType}
					/>
				</>
			);
		}
	}

	return Wrapper;
}

export default MQTTWrapper;
