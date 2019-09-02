import React, { Component } from 'react';
import { Card, Button, Modal, Progress, Icon, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './InitialSetting.less';

const mapStateToProps = (state) => {
	const { initialSetting } = state;
	return {
		initialSetting
	};
};
const mapDispatchToProps = (dispatch) => ({
	reboot: (sn) => {
		dispatch({
			type: 'initialSetting/reboot',
			payload: {
				sn
			}
		});
	},
	reset: (sn) => {
		dispatch({
			type: 'initialSetting/reset',
			payload: {
				sn
			}
		});
	},
	setStatus: (sn, status) => {
		dispatch({
			type: 'initialSetting/setStatus',
			payload: {
				sn,
				status
			}
		});
	},
	init: (sn) => {
		dispatch({
			type:'initialSetting/init',
			payload: {
				sn
			}
		});
	},
	navigateTo: (pathId, urlParams) => dispatch({
		type: 'menu/goToPath',
		payload: {
			pathId,
			urlParams
		}
	}),
	getDeviceInfo({ sn }) {
		return dispatch({
			type: 'ipcList/getDeviceInfo',
			payload: {
				sn
			}
		}).then(info => info);
	},
});
@connect(mapStateToProps, mapDispatchToProps)
class InitialSetting extends Component {

	state = {
		percent: 0,
		rebootVisible: false,
		resetVisible: false,
		// deviceInfo:{
		// 	hasFaceid: false
		// }
	}

	interval = 0;

	interval2 = 0;

	componentDidMount = () => {
		const { init, sn, /* getDeviceInfo */ } = this.props;
		if(sn){
			// const deviceInfo = await getDeviceInfo({ sn });
			// this.setState({
			// 	deviceInfo
			// });
			init(sn);
		}

	}

	componentDidUpdate = () => {
		const { initialSetting: { status, visible }, navigateTo} = this.props;
		console.log('update',status, visible);
		switch(status) {
			case 'rebootFailed':
				message.error(formatMessage({ id: 'initialSetting.rebootFailed'}));
				break;
			case 'resetFailed':
				message.error(formatMessage({ id: 'initialSetting.resetFailed'}));
				break;
			case 'startReboot':
				this.progressHandle('reboot');
				this.setStatus('rebooting');
				break;
			case 'startReset':
				this.progressHandle('reset');
				this.setStatus('reseting');
				break;
			case 'rebootSuccess':
				message.success(formatMessage({ id: 'initialSetting.rebootSuccess'}));
				navigateTo('deviceList');
				break;
			case 'resetSuccess':
				message.success(formatMessage({ id: 'initialSetting.resetSuccess'}));
				navigateTo('deviceList');
				break;
			default: break;
		}
	}

	progressHandle = (msg) => {

		// 进度条缓慢前进
		const time = 100*1000;
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			const { percent } = this.state;
			const { initialSetting: { status }} = this.props;
			if (percent < 90 ) {
				this.setState({
					percent: percent+1
				});
			}
			if(status === 'success') {
				clearInterval(this.interval);
				this.interval2 = setInterval(() => {
					const { percent: p } = this.state;
					// console.log('success', p);
					this.setState({
						percent: p+1
					});
					if(p === 100 ){
						clearInterval(this.interval2);
						this.setStatus('success',msg);
					}
				}, 1000/10);
			}
		}, time/100);

		// 超时10秒报错
		setTimeout(() => {
			const { initialSetting: { status } } = this.props;

			if(status === 'rebooting' || status === 'reseting') {

				// message.info({})
				clearInterval(this.interval);
				this.interval2 = setInterval(() => {
					const { percent } = this.state;
					this.setState({
						percent: percent+1
					});
					if(percent === 100 ){
						clearInterval(this.interval2);
						this.setStatus('success',msg);
					}
				}, 1000/10);
				// this.setStatus('success', msg);

			}
		}, time+ 10*1000);
	}

	setStatus = ( status, msg ) => {
		const { setStatus, sn} = this.props;
		if(status === 'success'){
			let s = '';
			if(msg === 'reboot') {
				s = 'rebootSuccess';
			} else if(msg === 'reset') {
				s = 'resetSuccess';
			}
			setStatus(sn, s);
		} else if (status === 'failed') {
			let s = '';
			if(msg === 'reboot') {
				s = 'rebootFailed';
			} else if(msg === 'reset') {
				s = 'resetFailed';
			}
			setStatus(sn, s);
		} else {
			setStatus(sn, status);
		}
	}

	rebootHandle = () => {

		const { reboot, sn } = this.props;
		reboot(sn);
		setTimeout(() => {
			// console.log(status);
			const { initialSetting: { status: s } } =this.props;
			// console.log(s);
			if(s === 'waiting'){
				this.setState({
					rebootVisible: false
				});
				this.setStatus('overTime');
				message.error(formatMessage({ id: 'initialSetting.error'}));
			}
		},10000);
	}

	resetHandle = () => {
		const { reset, sn } = this.props;
		reset(sn);
		setTimeout(() => {
			const { initialSetting: { status: s } } =this.props;
			if(s === 'waiting'){
				this.setState({
					resetVisible: false
				});
				this.setStatus('overTime');
				message.error(formatMessage({ id: 'initialSetting.error'}));
			}
		},10000);
	}

	showRebootModal = () => {
		this.setStatus('normal');
		this.setState({
			rebootVisible: true,
			resetVisible: false,
			percent: 0
		});
	}

	showResetModal = () => {
		this.setStatus('normal');
		this.setState({
			resetVisible: true,
			rebootVisible: false,
			percent: 0
		});
	}

	hideRebootModal = () => {
		this.setState({
			rebootVisible: false,
		});
	}

	hideResetModal = () => {
		this.setState({
			resetVisible: false
		});
	}

	render() {
		const { initialSetting: { status, visible } } = this.props;
		const { percent, rebootVisible,  resetVisible,  /* deviceInfo: { hasFaceid } */ } = this.state;
		const hasFaceid = false;
		return (
			<div>
				<Card
					bordered={false}
					className={styles['main-card']}
					title={formatMessage({ id: 'initialSetting.title'})}
				>
					{
						hasFaceid ?
							<div className={styles['warning-span']}><span>{formatMessage({ id: 'initialSetting.warningInfo'})}</span></div>
							:
							<div className={styles['main-block']}>
								<div className={styles['btn-block']}>
									<Button className={styles['reboot-btn']} onClick={this.showRebootModal}>
										{formatMessage({ id: 'initialSetting.reboot'})}
									</Button>
									<span className={styles['info-span']}>
										{formatMessage({ id: 'initialSetting.rebootWarning'})}
									</span>
								</div>
								<div className={styles['btn-block']}>
									<Button className={styles['reset-btn']} onClick={this.showResetModal}>
										{formatMessage({ id: 'initialSetting.reset'})}
									</Button>
									<span className={styles['info-span']}>
										{formatMessage({ id: 'initialSetting.resetWarning'})}
									</span>
								</div>
							</div>
					}

				</Card>
				<Modal
					visible={rebootVisible && visible}
					maskClosable={false}
					closable={status !== 'rebooting'}
					destroyOnClose
					onCancel={this.hideRebootModal}
					footer={
						(
							() => {
								if(status !== 'rebooting' && status !== 'success') {
									return (
										<div>
											<Button onClick={this.hideRebootModal}>
												{formatMessage({ id: 'initialSetting.cancel'})}
											</Button>
											<Button onClick={this.rebootHandle} type="primary" loading={status === 'waiting'}>
												{formatMessage({ id: 'initialSetting.confirm'})}
											</Button>

										</div>

									);
								}
								return '';
							}
						)()
					}
				>
					{
						(() => {
							if(rebootVisible) {
								if(status === 'rebooting' || status === 'success') {
									return (
										<div className={styles.info}>
											<p>
												{ formatMessage({id: 'initialSetting.rebooting'})}
											</p>
											<Progress
												className={styles.progress}
												// percent={status === 'rebooting' || status === 'success'? percent: 100}
												percent={percent}
												status='active'
											/>
											<p>
												{ formatMessage({id: 'initialSetting.rebootingInfo'})}
											</p>
										</div>
									);
								}
								return (
									<div className={styles.info}>
										<h3>
											<Icon className={`${styles.icon} ${styles.warning}`} type="info-circle" />
											<span className={styles.text}>{formatMessage({ id: 'initialSetting.rebootConfirm' })}</span>
										</h3>
										<p>
											{formatMessage({ id: 'initialSetting.rebootInfo'})}
										</p>
									</div>
								);
							}
							return null;
						})()
					}
				</Modal>
				<Modal
					visible={resetVisible && visible}
					maskClosable={false}
					closable={status !== 'reseting'}
					destroyOnClose
					onCancel={this.hideResetModal}
					footer={
						(
							() => {
								if(status !== 'reseting' && status !== 'success') {
									return (
										<div>
											<Button onClick={this.hideResetModal}>
												{formatMessage({ id: 'initialSetting.cancel'})}
											</Button>
											<Button onClick={this.resetHandle} type="primary" loading={status === 'waiting'}>
												{formatMessage({ id: 'initialSetting.confirm'})}
											</Button>
										</div>

									);
								}
								return '';
							}
						)()
					}
				>
					{
						(() => {
							if(resetVisible) {
								if(status === 'reseting' || status === 'success') {
									return (
										<div className={styles.info}>
											<p>
												{ formatMessage({id: 'initialSetting.reseting'})}
											</p>
											<Progress
												className={styles.progress}
												percent={percent}
												status='active'
											/>
											<p>
												{ formatMessage({id: 'initialSetting.resetingInfo'})}
											</p>
										</div>
									);
								}
								return (
									<div className={styles.info}>
										<h3>
											<Icon className={`${styles.icon} ${styles.warning}`} type="info-circle" />
											<span className={styles.text}>{formatMessage({ id: 'initialSetting.resetConfirm' })}</span>
										</h3>
										<p>
											{formatMessage({ id: 'initialSetting.resetInfo'})}
										</p>
									</div>
								);
							}
							return null;
						})()
					}
				</Modal>
			</div>
		);
	}
}
export default InitialSetting;