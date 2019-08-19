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
});
@connect(mapStateToProps, mapDispatchToProps)
class InitialSetting extends Component {

	state = {
		percent: 0,
		rebootVisible: false,
		resetVisible: false,
	}

	interval = 0;


	componentDidMount = () => {
		const { init, sn } = this.props;
		init(sn);
	}

	componentDidUpdate = () => {
		const { initialSetting: { status, visible }, navigateTo} = this.props;
		console.log(status, visible);
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
				this.setStatus('success',msg);
			}
		}, time/100);

		// 超时10秒报错
		setTimeout(() => {
			const { initialSetting: { status } } = this.props;
			if(status === 'rebooting' || status === 'reseting') {
				// message.info({})
				this.setStatus('failed', msg);
				clearInterval(this.interval);
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
		// const { rebootVisible, resetVisible } = this.state;
		// // const { wait } =  this.props;
		// if(rebootVisible) {
		// 	const { reboot, sn } = this.props;
		// 	reboot(sn);
		// } else if(resetVisible){
		// 	const { reset, sn } = this.props;
		// 	reset(sn);
		// }

	}

	resetHandle = () => {
		const { reset, sn } = this.props;
		reset(sn);
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
		const { percent, rebootVisible,  resetVisible } = this.state;
		return (
			<div>
				<Card
					bordered={false}
					className={styles['main-card']}
					title={formatMessage({ id: 'initialSetting.title'})}
				>
					<div className={styles['main-block']}>
						<div className={styles['btn-block']}>
							<Button className={styles['reboot-btn']} onClick={this.showRebootModal}>
								{formatMessage({ id: 'initialSetting.reboot'})}
							</Button>
							<span className={styles['info-span']}>
								{ `(${formatMessage({ id: 'initialSetting.rebootWarning'})})`}
							</span>
						</div>
						<div className={styles['btn-block']}>
							<Button className={styles['reset-btn']} onClick={this.showResetModal}>
								{formatMessage({ id: 'initialSetting.reset'})}
							</Button>
							<span className={styles['info-span']}>
								{ `(${formatMessage({ id: 'initialSetting.resetWarning'})})`}
							</span>
						</div>

					</div>
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
												percent={status === 'rebooting'? percent: 100}
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
										<p className={styles.caveat}>
											{formatMessage({ id: 'initialSetting.rebootInfo'})}
										</p>
									</div>
								);
							}

							if(resetVisible) {
								if(status === 'reseting' || status === 'success') {
									return (
										<div className={styles.info}>
											<p>
												{ formatMessage({id: 'initialSetting.reseting'})}
											</p>
											<Progress
												className={styles.progress}
												percent={status === 'reseting'? percent: 100}
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
										<p className={styles.caveat}>
											{formatMessage({ id: 'initialSetting.resetInfo'})}
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
												percent={status === 'reseting'? percent: 100}
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
										<p className={styles.caveat}>
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