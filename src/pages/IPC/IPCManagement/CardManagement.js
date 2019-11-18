import React, { Component } from 'react';
import { Card, Form, Button, Modal, Progress, message, Divider } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './CardManagement.less';
import { FORM_ITEM_LAYOUT_MANAGEMENT } from '@/constants/form';
import AnchorWrapper from '@/components/Anchor';
import NVRTitle from './NVRTitle';
import { ERROR_OK } from '@/constants/errorCode';
import ipcTypes from '@/constants/ipcTypes';
import { comperareVersion } from '@/utils/utils';

const statusCode = {
	opened: 1,
	nonactivated: 2,
	expired: 3
};

const mapStateToProps = (state) => {
	const { cardManagement, nvrManagement: {nvrState, loadState} } = state;
	return {
		cardManagement,
		nvrState,
		loadState
	};
};
const mapDispatchToProps = dispatch => ({
	getCurrentVersion: async(sn) => {
		const result = await dispatch({
			type: 'ipcList/getCurrentVersion',
			payload: {sn}
		});
		return result;
	},
	getDeviceType: async(sn) => {
		const result = await dispatch({
			type: 'ipcList/getDeviceType',
			payload: {sn}
		});
		return result;
	},
	read: (sn) => {
		dispatch({
			type: 'nvrManagement/read',
			payload: {
				sn
			}
		});
	},
	setNVRState: (sn, nvrState) => {
		dispatch({
			type:'nvrManagement/setNVRState',
			payload:{
				sn,
				nvrState
			}
		});
	},
	readCardInfo: sn => {
		dispatch({
			type: 'cardManagement/readCardInfo',
			payload: {
				sn,
			},
		});
	},
	async removeCard(sn) {
		const result = await dispatch({
			type: 'cardManagement/requestRemoveCard',
			payload: {
				sn,
			},
		});
		return result;
	},
	async formatCard(sn) {
		const result = await dispatch({
			type: 'cardManagement/requestFormatCard',
			payload: {
				sn,
			},
		});
		return result;
	},
	resetState: () => {
		dispatch({
			type: 'cardManagement/resetState',
		});
	},
	getDeviceInfo({ sn }) {
		return dispatch({
			type: 'ipcList/getDeviceInfo',
			payload: {
				sn,
			},
		}).then(info => info);
	},
	checkBind: async (sn) => {
		const result = await dispatch({
			type: 'ipcList/checkBind',
			payload: {
				sn
			}
		});
		return result;
	},
	navigateTo: (pathId, urlParams) => dispatch({
		type: 'menu/goToPath',
		payload: {
			pathId,
			urlParams
		}
	}),
	readCloudInfo: async (sn) => {
		const result = await dispatch({
			type: 'ipcList/readCloudInfo',
			payload: {
				sn
			}
		});
		const { code, data } = result;
		if(code === ERROR_OK) {
			return data;
		}
		message.error(formatMessage({ id: 'cardManagement.readCloudFaild'}));
		return {
			status: 0,
			validTime: ''
		};
	}
});

@AnchorWrapper
@connect(
	mapStateToProps,
	mapDispatchToProps
)
class CardManagement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formattingModalVisible: false, // 格式化进度弹框
			timer: null, // 进度条定时器
			formatProgress: 0, // 格式化进度
			formatTimeout: null, // 格式化超时
			removeTimeout: null, // 移除超时
			deviceInfo: {
				hasTFCard: true,
				hasCloud: false
			},
			cloudService: {
				status: 0,
				validTime: '',
			},
			isPay: false,
			hasNVR: false,
		};
	}

	componentDidMount = async () => {
		const { sn, readCardInfo, getDeviceInfo, readCloudInfo, read, getDeviceType, getCurrentVersion } = this.props;
		if(sn){
			const ipcType = await getDeviceType(sn) || 'FM020';
			const { leastVersion } = ipcTypes[ipcType].hasNVR;
			const currentVersion = await getCurrentVersion(sn);
			const hasNVR = comperareVersion(currentVersion, leastVersion) >= 0;
			if(hasNVR){
				await read(sn);
			}
			let cloudService = {
				status: 0,
				validTime: ''
			};
			let isPay = false;
			readCardInfo(sn);
			const deviceInfo = await getDeviceInfo({ sn });
			const { hasCloud } = deviceInfo;
			if(hasCloud) {
				cloudService = await readCloudInfo(sn);
				const { validTime } = cloudService;
				if(validTime) {
					isPay = validTime/3600/24 < 3;
				} else {
					isPay = true;
				}
			}
			this.setState({
				deviceInfo,
				cloudService,
				isPay,
				hasNVR
			});
		}
	};

	componentWillReceiveProps(nextProps) {
		const {
			cardManagement: { removeStatus, formatStatus },
		} = nextProps;

		const { formattingModalVisible, removeTimeout, formatTimeout, timer } = this.state;

		if (removeStatus === 'success' && this.removeConfirmInstance) {
			clearTimeout(removeTimeout);

			this.removeConfirmInstance.destroy();
			this.operateSuccess(formatMessage({ id: 'cardManagement.removeSuccess' }));
		} else if (removeStatus === 'fail' && this.removeConfirmInstance) {
			clearTimeout(removeTimeout);

			this.removeConfirmInstance.destroy();
			this.operateFail(formatMessage({ id: 'cardManagement.removeFail' }));
		}

		if (formatStatus === 'success' && formattingModalVisible === true) {
			clearTimeout(formatTimeout);

			clearInterval(timer);
			this.setState({
				formatProgress: 100,
			});
			this.setState({
				formattingModalVisible: false,
			});
			this.operateSuccess(formatMessage({ id: 'cardManagement.formatSuccess' }));
		} else if (formatStatus === 'fail' && formattingModalVisible === true) {
			clearTimeout(formatTimeout);

			clearInterval(timer);
			this.setState({
				formattingModalVisible: false,
			});
			this.operateFail(formatMessage({ id: 'cardManagement.formatFail' }));
		}
	}

	componentWillUnmount() {
		const { resetState } = this.props;
		const { timer, formatTimeout, removeTimeout } = this.state;
		resetState();

		clearInterval(timer);
		clearTimeout(formatTimeout);
		clearTimeout(removeTimeout);

		this.removeConfirmInstance = null;
		this.formatConfirmInstance = null;
	}

	nvrCheckedHandler = async (checked) => {
		const { sn, setNVRState, checkBind } = this.props;
		const isBind = await checkBind(sn);
		if(isBind) {
			setNVRState(sn, checked);
		} else {
			message.warning(formatMessage({ id: 'ipcList.noSetting'}));
		}
	}

	/**
	 * 取百分数
	 * */
	percentage = (num, sum) => {
		try {
			if (!num || !sum) {
				return 0;
			}
			return (100 * num) / sum;
		} catch (err) {
			console.error(err);
			return 0;
		}
	};

	/**
	 * 移除卡
	 * */
	Removing = async () => {
		const that = this;
		const { sn, removeCard } = this.props;
		try {
			await removeCard(sn);

			// 响应超过15s则认为失败
			const timer = setTimeout(() => {
				if (this.removeConfirmInstance) {
					this.removeConfirmInstance.destroy();
					this.operateFail(formatMessage({ id: 'cardManagement.removeFail' }));
				}
			}, 15000);

			this.setState({
				removeTimeout: timer,
			});
		} catch (err) {
			// 移除失败
			that.operateFail(formatMessage({ id: 'cardManagement.removeFail' }));
		}
	};

	/**
	 * 格式化中
	 * */
	formatting = async () => {
		try {
			const { sn, formatCard } = this.props;

			this.setState({
				formatProgress: 0, // 格式化之前先置空进度条
			});

			this.setState({
				formattingModalVisible: true,
			});
			this.runProgressBar();
			await formatCard(sn);

			// 响应超过15s则认为失败
			const timer = setTimeout(() => {
				const { formattingModalVisible, timer: thisTimer } = this.state;
				if (formattingModalVisible === true) {
					clearInterval(thisTimer);
					this.setState({
						formattingModalVisible: false,
					});
					this.operateFail(formatMessage({ id: 'cardManagement.formatFail' }));
				}
			}, 15000);

			this.setState({
				formatTimeout: timer,
			});
		} catch (err) {
			console.log(err);

			// 弹窗格式化失败
			this.setState({
				formattingModalVisible: false,
			});
			this.operateFail(formatMessage({ id: 'cardManagement.formatFail' }));
		}
	};

	/**
	 * 跑格式化进度条
	 * */
	runProgressBar = () => {
		const timer = setInterval(() => {
			const { formatProgress } = this.state;
			if (formatProgress >= 99) {
				const { timer: thisTimer } = this.state;
				clearInterval(thisTimer);
				console.log('进度条跑完了');
			} else {
				const percent = formatProgress + 1;
				this.setState({
					formatProgress: percent,
				});
			}
		}, 150);

		this.setState({
			timer,
		});
	};

	/**
	 * 格式化确认弹框
	 * */
	formatConfirm = async () => {
		const { checkBind, sn } = this.props;
		const isBind = await checkBind(sn);
		if(isBind) {
			const that = this;
			this.formatConfirmInstance = Modal.confirm({
				icon: 'info-circle',
				title: formatMessage({ id: 'cardManagement.formatTipTitle' }),
				content: formatMessage({ id: 'cardManagement.formatTipContent' }),
				okText: formatMessage({ id: 'cardManagement.modalOk' }),
				cancelText: formatMessage({ id: 'cardManagement.modalCancel' }),
				// centered: true,
				onOk() {
					console.log('formatConfirm ok');
					that.formatting();
				},
				onCancel() {
					console.log('formatConfirm cancel');
				},
			});
		} else {
			message.warning(formatMessage({ id: 'ipcList.noSetting'}));
		}

	}

	/**
	 * 移除确认弹框
	 * */
	removeConfirm = async () => {
		const { checkBind, sn } = this.props;
		const isBind = await checkBind(sn);
		if(isBind){
			const that = this;
			this.removeConfirmInstance = Modal.confirm({
				icon: 'info-circle',
				title: formatMessage({ id: 'cardManagement.removeTipTitle' }),
				content: formatMessage({ id: 'cardManagement.removeTipContent' }),
				okText: formatMessage({ id: 'cardManagement.modalOk' }),
				cancelText: formatMessage({ id: 'cardManagement.modalCancel' }),
				// centered: true,
				onOk() {
					console.log('removeConfirm ok');
					that.removeConfirmInstance.update({
						cancelButtonProps: { disabled: true } // 点击确定后，禁止点取消
					});

					return new Promise(() => {
						that.Removing();
					}).catch((err) => console.log(err));
				},
				onCancel() {
					console.log('confirm cancel');
				},
			});
		} else {
			message.warning(formatMessage({ id: 'ipcList.noSetting'}));
		}
	}

	/**
	 * 操作成功弹框
	 * */
	operateSuccess = content => {
		const modal = Modal.success({
			content,
			// centered: true,
		});
		setTimeout(() => {
			modal.destroy();
		}, 1000);
	};

	/**
	 * 操作失败弹框
	 * */
	operateFail = content => {
		Modal.error({
			content,
			// centered: true,
		});
		// setTimeout(() => {
		// 	modal.destroy();
		// }, 1000);
	};

	/**
	 * sd状态码转文字信息
	 * */
	sdStatus2text = code => {
		switch (code) {
			case 0:
				return formatMessage({ id: 'cardManagement.sdStatus0' });
			case 1:
				return formatMessage({ id: 'cardManagement.sdStatus1' });
			case 2:
				return formatMessage({ id: 'cardManagement.sdStatus2' });
			case 3:
				return formatMessage({ id: 'cardManagement.sdStatus3' });
			case 4:
				return formatMessage({ id: 'cardManagement.sdStatus4' });
			default:
				return '';
		}
	};

	/**
	 * sd存储信息
	 * */
	cardSizeInfo = num => {
		if (num >= 1024) {
			const size = Math.floor(num / 1024);
			return `${size}GB`;
		}
		return `${num}MB`;
	};

	/**
	 * 小时转天
	 * */
	hour2day = h => {
		if (h >= 24) {
			return `${Math.floor(h / 24)} ${formatMessage({ id: 'cardManagement.day' })}`;
		}
		if (h > 0) {
			return `0.5 ${formatMessage({ id: 'cardManagement.day' })}`;
		}
		return `0 ${formatMessage({ id: 'cardManagement.day' })}`;
	};


	dateToDuration = (time) => {
		if(!time) return `${formatMessage({ id: 'cardManagement.unknown'})}`;
		const duration = Math.floor(time/3600);
		const days = Math.floor(duration/24);
		const hours = duration%24;
		// if(hours === 0) {
		// 	return `${days} ${formatMessage({ id : 'cardManagement.day'})}`;
		// } if (days === 0) {
		// 	return `${hours} ${formatMessage({ id: 'cardManagement.hour'})}`;
		// }
		return `${days} ${formatMessage({ id : 'cardManagement.day'})} ${hours} ${formatMessage({ id: 'cardManagement.hour'})}`;
	}

	render() {
		const {
			cardManagement: {
				// isLoading,
				hasCard,
				used, // 已用存储空间MB
				total, // 总存储空间MB
				available_time, // 可用时长h
				sd_status_code, // sd卡状态码
				// isOldDevice // 老款设备
				// cloudStatus,
				// expireTime,
			},
			navigateTo,
			sn,
			nvrState,
			loadState,
			isOnline
		} = this.props;

		const { formattingModalVisible, formatProgress, deviceInfo: { hasTFCard, hasCloud }, cloudService: { status: cloudStatus, validTime }, isPay, hasNVR } = this.state;

		return (

			<Card title={formatMessage({ id: 'cardManagement.title' })} id='tfCard'>
				{
					hasNVR? 
						<div>
							<div className={styles['storage-title']}><NVRTitle onChange={this.nvrCheckedHandler} checked={nvrState} loading={loadState} isOnline={isOnline} /></div>
							<Divider />
						</div>:
						''
				}
				{
					hasCloud ?
						<div>
							<div className={styles['storage-title']}>{formatMessage({ id: 'cardManagement.cloudStorage'})}</div>
							{
								cloudStatus !==statusCode.nonactivated ?
									<Form {...FORM_ITEM_LAYOUT_MANAGEMENT}>
										<Form.Item label={formatMessage({id: 'cardManagement.status'})}>
											<span>{cloudStatus === statusCode.expired ? formatMessage({ id: 'cardManagement.expired'}) :formatMessage({ id: 'cardManagement.activated'})}</span>
											<Button
												onClick={() => navigateTo('cloudStorage',{ sn, type: 'repay' })}
												className={styles['subscribe-button']}
												disabled={!isPay || !isOnline}
											>
												{formatMessage({ id: 'cardManagement.repay'})}
											</Button>
										</Form.Item>
										<Form.Item label={formatMessage({ id: 'cardManagement.validityPeriod'})}>
											<span>{this.dateToDuration(validTime)}</span>
										</Form.Item>
									</Form>
									:
									<Form {...FORM_ITEM_LAYOUT_MANAGEMENT}>
										<Form.Item label={formatMessage({id: 'cardManagement.status'})}>
											<span>{formatMessage({ id: 'cardManagement.nonactivated'})}</span>
											<Button
												onClick={() => navigateTo('cloudStorage',{ sn, type: 'subscribe' })}
												className={styles['subscribe-button']}
												disabled={!isOnline}
											>
												{formatMessage({id: 'cardManagement.subscribeCloudService'})}
											</Button>
										</Form.Item>
									</Form>
							}
							<Divider />
						</div>
						: ''
				}
				{
					hasTFCard ?
						<div>
							<div className={styles['storage-title']}>{formatMessage({ id: 'cardManagement.localStorage'})}</div>
							<Form {...FORM_ITEM_LAYOUT_MANAGEMENT}>
								<Form.Item label={formatMessage({ id: 'cardManagement.sizeLeft' })}>
									{
										isOnline ?
											(hasCard && sd_status_code === 2 ?
												<div>
													<p className={`${styles['text-align-right']  } ${  styles['form-progress']  } ${  styles['no-margin']}`}>{formatMessage({ id: 'cardManagement.hasUsed' })}{this.cardSizeInfo(used)}/{this.cardSizeInfo(total)}</p>
													<Progress
														className={styles['form-progress']}
														percent={this.percentage(used, total)}
														showInfo={false}
													/>
												</div>
												: <p>{ this.sdStatus2text(sd_status_code) }</p>)
											:<span className={styles['offline-info']}>{formatMessage({id: 'cardManagement.unknown'})}</span>
									}

								</Form.Item>

								<Form.Item label={formatMessage({ id: 'cardManagement.daysCanUse' })}>
									{
										isOnline ?
											(hasCard && sd_status_code === 2 ?
												<p>
													{this.hour2day(available_time)}<br />
													{formatMessage({ id: 'cardManagement.daysUseTip' })}
												</p>
												: <p>{this.sdStatus2text(sd_status_code)}</p>)
											:<span className={styles['offline-info']}>{formatMessage({id: 'cardManagement.unknown'})}</span>
									}
								</Form.Item>

								<Form.Item label={formatMessage({ id: 'cardManagement.removeSafely' })}>
									{/* 未格式化的卡不能点移除 */}
									<Button
										disabled={!hasCard || (hasCard && sd_status_code === 1) || !isOnline}
										onClick={(e) => {
											e.target.blur();
											this.removeConfirm();
										}}
									>{formatMessage({ id: 'cardManagement.removeImmediately' })}
									</Button>
								</Form.Item>

								<Form.Item label={formatMessage({ id: 'cardManagement.format' })}>
									<Button
										disabled={!hasCard || !isOnline}
										onClick={(e) => {
											e.target.blur();
											this.formatConfirm();
										}}
									>{formatMessage({ id: 'cardManagement.formatImmediately' })}
									</Button>
								</Form.Item>

								{/* 格式化中弹框 */}
								<Modal
									title={formatMessage({ id: 'cardManagement.formattingTitle' })}
									visible={formattingModalVisible}
									closable={false}
									footer={null}
									maskClosable={false}
								>
									<Progress
										className={styles['form-progress']}
										percent={formatProgress}
										showInfo
									/>
									<p>{formatMessage({ id: 'cardManagement.formattingContent' })}</p>
								</Modal>
							</Form>
						</div>
						:''
				}
			</Card>
		);
	}
}
export default CardManagement;
