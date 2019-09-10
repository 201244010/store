import React, { Component } from 'react';
import { notification } from 'antd';
import { connect } from 'dva';
import { format } from '@konata9/milk-shake';
import { displayNotification } from '@/components/Notification';
import { REGISTER_PUB_MSG, OPCODE } from '@/constants/mqttStore';
import { getRandomString } from '@/utils/utils';
import { ORDER_OK } from '@/constants/errorCode';

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
			getUnreadNotification: () => dispatch({ type: 'notification/getUnreadNotification' }),
			goToPath: (pathId, urlParams = {}) =>
				dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
			formatSdCard: sn => {
				dispatch({ type: 'sdcard/formatSdCard', sn });
			},
			getSdStatus: async sn => {
				const status = await dispatch({
					type: 'sdcard/getSdStatus',
					sn,
				});
				return status;
			},
			getCurrentCompanyId: () => dispatch({ type: 'global/getCompanyIdFromStorage' }),
			getCurrentShopId: () => dispatch({ type: 'global/getShopIdFromStorage' }),
			getStoreNameById: shopId =>
				dispatch({ type: 'store/getStoreNameById', payload: { shopId } }),
			getCompanyNameById: companyId =>
				dispatch({ type: 'merchant/getCompanyNameById', payload: { companyId } }),
			getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
		})
	)
	@Ipc
	class Wrapper extends Component {
		constructor(props) {
			super(props);
			this.state = {
				notificationList: [],
			};
		}

		componentDidMount() {
			this.initClient();
		}

		componentWillUnmount() {
			const { destroyClient } = this.props;
			destroyClient();
		}

		removeNotification = key => {
			const { notificationList } = this.state;
			const keyList = [...notificationList];
			keyList.splice(keyList.indexOf(key), 1);
			notification.close(key);
			this.setState({
				notificationList: keyList,
			});
		};

		handleTrade = async param => {
			const { getCurrentCompanyId, goToPath } = this.props;
			const { companyId, orderStatus } = format('toCamel')(param) || {};

			const currentCompanyId = await getCurrentCompanyId();
			if (`${currentCompanyId}` === `${companyId}`) {
				goToPath('tradeResult', {
					status: orderStatus === ORDER_OK ? 'success' : 'error',
				});
			}
		};

		handleNotification = async data => {
			const { notificationList } = this.state;
			const {
				getNotificationCount,
				getUnreadNotification,
				goToPath,
				formatSdCard,
				getSdStatus,
				getCurrentCompanyId,
				getCurrentShopId,
				getStoreNameById,
				getCompanyNameById,
				getStoreList,
			} = this.props;

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
				const { param = {}, opcode = null } = item;

				if (opcode && opcode === OPCODE.NOTIFICATION) {
					displayNotification({
						data: param,
						key: uniqueKey,
						closeAction: this.removeNotification,
						handlers: {
							goToPath,
							formatSdCard,
							getSdStatus,
							getStoreList,
							getCurrentCompanyId,
							getCurrentShopId,
							getStoreNameById,
							getCompanyNameById,
							removeNotification: this.removeNotification,
						},
					});
				} else if (opcode && opcode === OPCODE.TRADE_NOTIFICATION) {
					this.handleTrade(param);
				}
			});

			await getNotificationCount();
			await getUnreadNotification();
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
				await setTopicListener({
					service: 'notification',
					handler: this.handleNotification,
				});
				await subscribe({ topic: [registerTopic, notificationTopic] });
				// console.log('subscribed');
				await publish({ topic: registerTopicPub, message: REGISTER_PUB_MSG });
			}
		};

		render() {
			return <WrapperedComponent {...this.props} />;
		}
	}

	return Wrapper;
}

export default MQTTWrapper;
