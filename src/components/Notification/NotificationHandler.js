import React from 'react';
import { Button, Modal, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import ModalPlayer from '@/components/VideoPlayer/ModalPlayer';

import { formatMessageTemplate, convertArrayPrams, replaceTemplateWithValue } from '@/utils/utils';
import ipcTypes from '@/constants/ipcTypes';

const isInCurrentCompany = ({ currentCompanyId, companyId }) =>
	`${currentCompanyId}` === `${companyId}`;

const isInCurrentShop = ({ currentShopId, shopId }) => `${currentShopId}` === `${shopId}`;

const getCurrentAndTargetCompanyInfo = async ({
	getCurrentCompanyId,
	getCompanyNameById,
	getCurrentShopId,
	getStoreNameById,
	companyId,
	shopId,
}) => {
	const [currentCompanyId, currentShopId] = await Promise.all([
		getCurrentCompanyId(),
		getCurrentShopId(),
	]);

	const [
		currentCompanyName,
		currentShopName,
		targetCompanyName,
		targetShopName,
	] = await Promise.all([
		getCompanyNameById(currentCompanyId),
		getStoreNameById(currentShopId),
		getCompanyNameById(companyId),
		getStoreNameById(shopId),
	]);

	return {
		currentCompanyId,
		currentShopId,
		companyId,
		shopId,
		currentCompanyName,
		currentShopName,
		targetCompanyName,
		targetShopName,
	};
};

const formatInfoMessage = ({
	currentCompanyName,
	currentShopName,
	targetCompanyName,
	targetShopName,
}) => {
	const templateValue = {
		messageId: 'notif-modal-content',
		valueList: [
			{
				key: '##currentCompanyName##',
				value: currentCompanyName,
			},
			{
				key: '##currentShopName##',
				value: currentShopName,
			},
			{
				key: '##targetCompanyName##',
				value: targetCompanyName,
			},
			{
				key: '##targetShopName##',
				value: targetShopName,
			},
		],
	};

	Modal.info({
		title: '',
		content: (
			<div>
				<p>{replaceTemplateWithValue(templateValue)}</p>
			</div>
		),
		okText: formatMessage({ id: 'notif-modal-known-text' }),
	});
};

const palyMotion = async ({ handlers, params }) => {
	const {
		url = null,
		device_model: ipcType = null,
		shop_id: shopId = null,
		company_id: companyId = null,
	} = convertArrayPrams(params) || {};

	const { getCurrentCompanyId, getCompanyNameById, getCurrentShopId, getStoreNameById } =
		handlers || {};

	const {
		currentCompanyId,
		currentShopId,
		currentCompanyName,
		currentShopName,
		targetCompanyName,
		targetShopName,
	} =
		(await getCurrentAndTargetCompanyInfo({
			getCurrentCompanyId,
			getCompanyNameById,
			getCurrentShopId,
			getStoreNameById,
			companyId,
			shopId,
		})) || {};

	if (
		isInCurrentCompany({ currentCompanyId, companyId }) &&
		isInCurrentShop({ currentShopId, shopId })
	) {
		const { pixelRatio = '16:9' } = ipcTypes[ipcType] || {};
		const modal = Modal.info({
			title: '',
			content: (
				<>
					{url && (
						<ModalPlayer
							visible
							onClose={() => {
								if (modal) {
									modal.destroy();
								}
							}}
							url={decodeURIComponent(url)}
							pixelRatio={pixelRatio}
						/>
					)}
				</>
			),
			okButtonProps: { style: { dispaly: 'none' } },
		});
	} else {
		formatInfoMessage({
			currentCompanyName,
			currentShopName,
			targetCompanyName,
			targetShopName,
		});
	}
};

const switchPage = async ({ target = null, handlers = {}, params = '' }) => {
	const { shop_id: shopId = null, company_id: companyId = null } =
		convertArrayPrams(params) || {};

	const {
		getCurrentCompanyId,
		getCompanyNameById,
		getCurrentShopId,
		getStoreNameById,
		goToPath,
	} = handlers || {};

	const {
		currentCompanyId,
		currentShopId,
		currentCompanyName,
		currentShopName,
		targetCompanyName,
		targetShopName,
	} =
		(await getCurrentAndTargetCompanyInfo({
			getCurrentCompanyId,
			getCompanyNameById,
			getCurrentShopId,
			getStoreNameById,
			companyId,
			shopId,
		})) || {};

	if (
		isInCurrentCompany({ currentCompanyId, companyId }) &&
		isInCurrentShop({ currentShopId, shopId })
	) {
		goToPath(target);
	} else {
		formatInfoMessage({
			currentCompanyName,
			currentShopName,
			targetCompanyName,
			targetShopName,
		});
	}
};

const ACTION_MAP = {
	'GET-AP-LIST': ({ handlers, params }) =>
		switchPage({ target: 'baseStation', handlers, params }),

	'notif-device-esl-ap-offline-btn1': ({ handlers, params }) =>
		switchPage({ target: 'baseStation', handlers, params }),

	'notif-ap-offline-btn1': ({ handlers, params }) =>
		switchPage({ target: 'baseStation', handlers, params }),

	'notif-system-task-erp-btn1': ({ handlers, params }) =>
		switchPage({ target: 'productList', handlers, params }),

	'notif-device-ipc-motion-detect-video-btn1': palyMotion,
	'notif-device-ipc-motion-detect-audio-btn1': palyMotion,
	'notif-motion-detect-btn1': palyMotion,

	'notif-motion-detect-btn2': ({
		handlers = {},
		params,
		extra: { from = null, key = null } = {},
	}) => {
		const { removeNotification = null } = handlers;
		if (from === 'mqtt' && removeNotification) {
			removeNotification(key);
		} else {
			switchPage({ target: 'notificationList', handlers, params });
		}
	},

	// TF卡需格式化
	'notif-device-ipc-tf-card-detect-tf-exist-btn1': async ({
		handlers: {
			goToPath,
			removeNotification,
			getCurrentCompanyId,
			getCurrentShopId,
			getStoreNameById,
			getCompanyNameById,
			formatSdCard,
			getSdStatus,
		},
		params,
		extra,
	}) => {
		const {
			device_sn: deviceSn = null,
			shop_id: shopId = null,
			company_id: companyId = null,
		} = convertArrayPrams(params);
		const currentShopId = await getCurrentShopId();
		const targetShopId = parseInt(shopId, 0);
		if (currentShopId === targetShopId) {
			const status = await getSdStatus(deviceSn);
			if (status === 1) {
				formatSdCard(deviceSn);
			}
			goToPath('ipcManagement', { sn: deviceSn });
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
		} else {
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
			const modal = Modal.info({
				title: formatMessage({ id: 'notif-modal-title-info' }),
				content: (
					<div>
						<Spin spinning />
					</div>
				),
				okText: formatMessage({ id: 'notif-modal-known-text' }),
				onOk() {},
			});
			const targetCompanyId = parseInt(companyId, 0);
			const currentCompanyId = await getCurrentCompanyId();
			const currentCompanyName = await getCompanyNameById(currentCompanyId);
			const currentShopName = await getStoreNameById(currentShopId);
			const targetShopName = await getStoreNameById(targetShopId);
			const targetCompanyName = await getCompanyNameById(targetCompanyId);
			const templateValue = {
				messageId: 'notif-modal-content',
				valueList: [
					{
						key: '##currentCompanyName##',
						value: currentCompanyName,
					},
					{
						key: '##currentShopName##',
						value: currentShopName,
					},
					{
						key: '##targetCompanyName##',
						value: targetCompanyName,
					},
					{
						key: '##targetShopName##',
						value: targetShopName,
					},
				],
			};
			modal.update({
				content: (
					<div>
						<p>{replaceTemplateWithValue(templateValue)}</p>
					</div>
				),
			});
		}
	},
	// TF卡拔出
	'notif-device-ipc-tf-card-detect-tf-non-exist-btn1': async ({
		handlers: {
			goToPath,
			removeNotification,
			getCurrentCompanyId,
			getCurrentShopId,
			getStoreNameById,
			getCompanyNameById,
		},
		params,
		extra,
	}) => {
		const {
			device_sn: deviceSn = null,
			shop_id: shopId = null,
			company_id: companyId = null,
		} = convertArrayPrams(params);
		const currentShopId = await getCurrentShopId();
		const targetShopId = parseInt(shopId, 0);
		if (currentShopId === targetShopId) {
			goToPath('ipcManagement', { sn: deviceSn });
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
		} else {
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
			const modal = Modal.info({
				title: formatMessage({ id: 'notif-modal-title-info' }),
				content: (
					<div>
						<Spin spinning />
					</div>
				),
				okText: formatMessage({ id: 'notif-modal-known-text' }),
				onOk() {},
			});
			const targetCompanyId = parseInt(companyId, 0);
			const currentCompanyId = await getCurrentCompanyId();
			const currentCompanyName = await getCompanyNameById(currentCompanyId);
			const currentShopName = await getStoreNameById(currentShopId);
			const targetShopName = await getStoreNameById(targetShopId);
			const targetCompanyName = await getCompanyNameById(targetCompanyId);
			const templateValue = {
				messageId: 'notif-modal-content',
				valueList: [
					{
						key: '##currentCompanyName##',
						value: currentCompanyName,
					},
					{
						key: '##currentShopName##',
						value: currentShopName,
					},
					{
						key: '##targetCompanyName##',
						value: targetCompanyName,
					},
					{
						key: '##targetShopName##',
						value: targetShopName,
					},
				],
			};
			modal.update({
				content: (
					<div>
						<p>{replaceTemplateWithValue(templateValue)}</p>
					</div>
				),
			});
		}
	},
	// TF卡可用
	'notif-device-ipc-tf-card-detect-tf-capable-btn1': async ({
		handlers: {
			goToPath,
			removeNotification,
			getCurrentCompanyId,
			getCurrentShopId,
			getStoreNameById,
			getCompanyNameById,
		},
		params,
		extra,
	}) => {
		const {
			device_sn: deviceSn = null,
			shop_id: shopId = null,
			company_id: companyId = null,
		} = convertArrayPrams(params);
		const targetShopId = parseInt(shopId, 0);
		const currentShopId = await getCurrentShopId();
		if (currentShopId === targetShopId) {
			goToPath('ipcManagement', { sn: deviceSn });
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
		} else {
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
			const modal = Modal.info({
				title: formatMessage({ id: 'notif-modal-title-info' }),
				content: (
					<div>
						<Spin spinning />
					</div>
				),
				okText: formatMessage({ id: 'notif-modal-known-text' }),
				onOk() {},
			});
			const targetCompanyId = parseInt(companyId, 0);
			const currentCompanyId = await getCurrentCompanyId();
			const currentCompanyName = await getCompanyNameById(currentCompanyId);
			const currentShopName = await getStoreNameById(currentShopId);
			const targetShopName = await getStoreNameById(targetShopId);
			const targetCompanyName = await getCompanyNameById(targetCompanyId);
			const templateValue = {
				messageId: 'notif-modal-content',
				valueList: [
					{
						key: '##currentCompanyName##',
						value: currentCompanyName,
					},
					{
						key: '##currentShopName##',
						value: currentShopName,
					},
					{
						key: '##targetCompanyName##',
						value: targetCompanyName,
					},
					{
						key: '##targetShopName##',
						value: targetShopName,
					},
				],
			};
			modal.update({
				content: (
					<div>
						<p>{replaceTemplateWithValue(templateValue)}</p>
					</div>
				),
			});
		}
	},
	// TF卡不可用
	'notif-device-ipc-tf-card-detect-tf-non-capable-btn1': async ({
		handlers: {
			goToPath,
			removeNotification,
			getCurrentCompanyId,
			getCurrentShopId,
			getStoreNameById,
			getCompanyNameById,
		},
		params,
		extra,
	}) => {
		const {
			device_sn: deviceSn = null,
			shop_id: shopId = null,
			company_id: companyId = null,
		} = convertArrayPrams(params);
		const targetShopId = parseInt(shopId, 0);
		const currentShopId = await getCurrentShopId();
		if (currentShopId === targetShopId) {
			goToPath('ipcManagement', { sn: deviceSn });
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
		} else {
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
			const modal = Modal.info({
				title: formatMessage({ id: 'notif-modal-title-info' }),
				content: (
					<div>
						<Spin spinning />
					</div>
				),
				okText: formatMessage({ id: 'notif-modal-known-text' }),
				onOk() {},
			});
			const targetCompanyId = parseInt(companyId, 0);
			const currentCompanyId = await getCurrentCompanyId();
			const currentCompanyName = await getCompanyNameById(currentCompanyId);
			const currentShopName = await getStoreNameById(currentShopId);
			const targetShopName = await getStoreNameById(targetShopId);
			const targetCompanyName = await getCompanyNameById(targetCompanyId);
			const templateValue = {
				messageId: 'notif-modal-content',
				valueList: [
					{
						key: '##currentCompanyName##',
						value: currentCompanyName,
					},
					{
						key: '##currentShopName##',
						value: currentShopName,
					},
					{
						key: '##targetCompanyName##',
						value: targetCompanyName,
					},
					{
						key: '##targetShopName##',
						value: targetShopName,
					},
				],
			};
			modal.update({
				content: (
					<div>
						<p>{replaceTemplateWithValue(templateValue)}</p>
					</div>
				),
			});
		}
	},
	// OTA 版本更新提醒
	'notif-device-ipc-ota-btn1': async ({
		handlers: {
			goToPath,
			removeNotification,
			getCurrentCompanyId,
			getCurrentShopId,
			getStoreNameById,
			getCompanyNameById,
		},
		params,
		extra,
	}) => {
		const {
			device_sn: deviceSn = null,
			shop_id: shopId = null,
			company_id: companyId = null,
		} = convertArrayPrams(params);
		const targetShopId = parseInt(shopId, 0);
		const currentShopId = await getCurrentShopId();
		if (currentShopId === targetShopId) {
			goToPath('ipcManagement', { sn: deviceSn, showModal: true });
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
		} else {
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
			const modal = Modal.info({
				title: formatMessage({ id: 'notif-modal-title-info' }),
				content: (
					<div>
						<Spin spinning />
					</div>
				),
				okText: formatMessage({ id: 'notif-modal-known-text' }),
				onOk() {},
			});
			const targetCompanyId = parseInt(companyId, 0);
			const currentCompanyId = await getCurrentCompanyId();
			const currentCompanyName = await getCompanyNameById(currentCompanyId);
			const currentShopName = await getStoreNameById(currentShopId);
			const targetShopName = await getStoreNameById(targetShopId);
			const targetCompanyName = await getCompanyNameById(targetCompanyId);
			const templateValue = {
				messageId: 'notif-modal-content',
				valueList: [
					{
						key: '##currentCompanyName##',
						value: currentCompanyName,
					},
					{
						key: '##currentShopName##',
						value: currentShopName,
					},
					{
						key: '##targetCompanyName##',
						value: targetCompanyName,
					},
					{
						key: '##targetShopName##',
						value: targetShopName,
					},
				],
			};
			modal.update({
				content: (
					<div>
						<p>{replaceTemplateWithValue(templateValue)}</p>
					</div>
				),
			});
		}
	},
	// 设备离线
	'notif-device-ipc-on/offline-btn1': async ({
		handlers: {
			goToPath,
			removeNotification,
			getCurrentCompanyId,
			getCurrentShopId,
			getStoreNameById,
			getCompanyNameById,
		},
		params,
		extra,
	}) => {
		const {
			device_sn: deviceSn = null,
			shop_id: shopId = null,
			company_id: companyId = null,
		} = convertArrayPrams(params);
		const targetShopId = parseInt(shopId, 0);
		const currentShopId = await getCurrentShopId();
		if (currentShopId === targetShopId) {
			goToPath('deviceList', { sn: deviceSn });
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
		} else {
			if (removeNotification) {
				const { key } = extra;
				removeNotification(key);
			}
			const modal = Modal.info({
				title: formatMessage({ id: 'notif-modal-title-info' }),
				content: (
					<div>
						<Spin spinning />
					</div>
				),
				okText: formatMessage({ id: 'notif-modal-known-text' }),
				onOk() {},
			});
			const targetCompanyId = parseInt(companyId, 0);
			const currentCompanyId = await getCurrentCompanyId();
			const currentCompanyName = await getCompanyNameById(currentCompanyId);
			const currentShopName = await getStoreNameById(currentShopId);
			const targetShopName = await getStoreNameById(targetShopId);
			const targetCompanyName = await getCompanyNameById(targetCompanyId);
			const templateValue = {
				messageId: 'notif-modal-content',
				valueList: [
					{
						key: '##currentCompanyName##',
						value: currentCompanyName,
					},
					{
						key: '##currentShopName##',
						value: currentShopName,
					},
					{
						key: '##targetCompanyName##',
						value: targetCompanyName,
					},
					{
						key: '##targetShopName##',
						value: targetShopName,
					},
				],
			};
			modal.update({
				content: (
					<div>
						<p>{replaceTemplateWithValue(templateValue)}</p>
					</div>
				),
			});
		}
	},
};

const NotificationHandler = props => {
	const {
		buttonName = null,
		buttonParams = null,
		handlers = {},
		extra = {},
		type = null,
		style = {},
	} = props;

	const handleAction = () => {
		if (buttonName) {
			const hander = ACTION_MAP[buttonName] || (() => null);
			hander({ handlers, params: buttonParams, extra });
		}
	};

	return (
		<Button type={type} style={style} onClick={handleAction}>
			{formatMessageTemplate(buttonName)}
		</Button>
	);
};

export default NotificationHandler;
