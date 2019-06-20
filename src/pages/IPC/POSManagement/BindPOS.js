import React, { Component } from 'react';
import { Card, Form, Input, Table, Button, message, Icon } from 'antd';
// import { Exception } from 'ant-design-pro';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
// import router from 'umi/router';
// import { Link } from 'dva/router';

import POSBinder from '@/components/POSBinder/POSBinder';

import styles from './BindPOS.less';


const mapStateToProps = (state) => {
	const { routing: { location }, bindingPosList: POSList, loading, bindedPosList, ipcList } = state;
	const { query: { sn, posList: posSNList, edit }} = location;


	const poses = posSNList ? posSNList.split('|') : [];
	const isEdit = edit === '1';

	const target = ipcList.filter(item => item.sn === sn);

	const ipcInfo = {
		...target[0]
	};

	return {
		loading,
		isEdit,
		sn,
		poses,
		ipcInfo,
		POSList,
		bindedPosList
	};
};
const mapDispatchToProps = (dispatch) => ({
	getList: (sn) => {
		const list = dispatch({
			type: 'bindingPosList/getPosListByIpcSN',
			payload: {
				ipcSN: sn
			}
		});
		return list;
	},
	getBindedList: (sn) => {
		const list = dispatch({
			type: 'bindedPosList/read',
			payload: {
				ipcSN: sn
			}
		});
		return list;
	},
	sendCode: (posSN) => {
		dispatch({
			type: 'bindingPosList/sendCode',
			payload: {
				posSN
			}
		}).then((result) => {
			if (result) {
				// message.success('验证码发送成功！');
				message.success(formatMessage({id: 'posList.codeSuccess'}));
				return true;
			}
			// message.error('验证码发送失败，请检查网络连接并重试');
			message.error(formatMessage({id: 'posList.codeFailed'}));
			return false;
		});
	},
	verifyCode: (code, posSN) => {
		const result = dispatch({
			type: 'bindingPosList/verifyCode',
			payload: {
				posSN,
				code
			}
		});
		return result;
	},
	bind: (sn, posList) => {
		// console.log(posList);
		const result = dispatch({
			type: 'bindingPosList/bind',
			payload: {
				ipcSN: sn,
				posList
			}
		});
		return result;
	},
	adjust: (sn, posList) => {
		// console.log(posList);
		const result = dispatch({
			type: 'bindingPosList/adjust',
			payload: {
				ipcSN: sn,
				posList
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
	})
});

@connect(mapStateToProps, mapDispatchToProps)
class AddPOS extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isClick: false,
			// deviceList: [],
			chooseList: [],
			selectedRowKeys: [],

			// searchList: [],
			// isSearch: false,
			// infoVisible: false,

			codeStatus: {}

		};

		this.action = (
			<Button type='primary' onClick={()=>{this.showModal();}}>
				{formatMessage({id: 'posList.addButton'})}
			</Button>
		);

		this.columns = [
			{
				title: formatMessage({ id: 'posList.deviceImage'}),
				dataIndex: 'src',
				key:'image',
				render: src => (
					<div className={styles.shortcut}>
						<img className={styles.image} alt={formatMessage({ id: 'posList.deviceImage'})} src={src} />
					</div>
				),
			},
			{
				title: formatMessage({ id: 'posList.deviceName'}),
				dataIndex: 'name',
				key:'name',
				// onFilter: (value) => {console.log(value);}
			},
			{
				title: formatMessage({ id: 'posList.deviceSN'}),
				dataIndex: 'sn',
				key:'sn',
				render: item => (
					<span>{`SN:${item}`}</span>
				),
			},
			{
				title: formatMessage({ id: 'posList.deviceStatus'}),
				dataIndex: 'verified',
				key:'verified',
				render: verified => {

					let text = '';
					let icon = '';

					switch (verified) {
						case 0:
							text = formatMessage({id: 'posList.verified'}); // '已验证';
							icon = 'success';
							break;
						default:
							text = formatMessage({id: 'posList.unVerified'}); // '未验证';
							icon = 'failed';
							break;
					};

					return (
						<div>
							<span className={`${styles.icon} ${styles[icon]}`} />
							<span className={styles.text}>{ text }</span>
						</div>
					);
				}
			},
			{
				title: formatMessage({id: 'posList.verifyCode'}), // '验证码',
				dataIndex: 'sn',
				key: 'code',
				// width: 300,
				render: (sn, record) => {
					const { loading } = this.props;
					const { codeStatus } = this.state;
					const { message: errorMessage, error } = codeStatus[sn] || '';

					return (
						<div className={styles['code-field']}>
							{
								record.verified !== 0 ?
									<Form.Item
										validateStatus={
											error ? 'error' : 'success'
										}

										help={
											errorMessage
										}
									>
										<Input
											className={styles['code-input']}
											maxLength={4}
											onChange={(e) => {
												const { value } = e.target;
												if (value.length >= 4) {
													this.verifyCode(value, sn);
												}
											}}
										/>
										{
											loading.effects['bindingPosList/verifyCode'] ?
												<Icon type="loading" className={styles['code-loading']} />
												: ''
										}
									</Form.Item>
									: ''
							}
						</div>
					);
				}
			},
			{
				title: formatMessage({id: 'posList.operation'}), // '操作',
				dataIndex: 'verified',
				key: 'operataion',
				// width: 150,
				render: (verified, record) => {
					// console.log(record);
					const { codeStatus } = this.state;
					const statusObj = codeStatus[record.sn];

					const time = statusObj ? statusObj.time : 0;

					return (
						<div>
							{
								(() => {
									// console.log('status: ', verified);
									if (verified !== 0) {
										if (time && time > 0) {
											return (
												<span className={styles.disabled}>{`${time}${formatMessage({id: 'posList.resend'})}` /* 秒后重新发送 */ }</span>
											);
										}
										return (
											<a
												href='javascript:void(0);'
												onClick={() => {
													const temp = {};
													temp[record.sn] = {
														time: 120
													};

													this.setState({
														codeStatus: {
															...codeStatus,
															...temp
														}
													});

													// console.log(temp, codeStatus, {
													// 	...codeStatus,
													// 	...temp
													// },  this.state.codeStatus);

													if (!this.running) {
														this.running = true;
														this.startClock();
													}

													this.sendCode(record.sn);
												}}
											>
												{/* 发送验证码 */}
												{formatMessage({id: 'posList.sendCode'})}
											</a>
										);
									}
									return '';
								})()

							}
						</div>
					);
				}
			}
		];

		this.interval = 0;
		this.running = false;
	}

	async componentDidMount() {
		const { sn, getList, isEdit, poses, getBindedList } = this.props;
		const list = await getList(sn);

		const verifiedArray = [];
		list.forEach((item) => {
			if (item.verified === 0) {
				verifiedArray.push(item.sn);
			}
		});

		this.setState({
			selectedRowKeys: verifiedArray
		});

		const bindedList = await getBindedList(sn);
		// console.log(bindedList);
		let chooseList = [];
		if (poses.length > 0) {
			if (isEdit) {
				// 当为编辑状态时，只需要验证sn是否已经处于绑定状态，无需验证是否已经验证；
				chooseList = list.filter((item) => {
					const hasQueried = poses.includes(item.sn);
					// const hasVerified = verifiedArray.includes(item.sn);
					const t = bindedList.filter((target) => item.sn === target.sn);
					const hasBinded = t.length > 0;
					return hasQueried && hasBinded;
				});
			}else{
				chooseList = list.filter((item) => {
					const hasQueried = poses.includes(item.sn);
					const hasVerified = verifiedArray.includes(item.sn);
					return hasQueried && hasVerified;
				});
			}

		}else{
			chooseList = list.filter((item) => {
				const hasVerified = verifiedArray.includes(item.sn);
				return hasVerified;
			});
		}
		// console.log(chooseList);
		if (isEdit) {
			this.setState({
				chooseList,
				isClick: true
			});
		}else{
			this.setState({
				chooseList
			});
		}
	}

	// componentWillReceiveProps (props) {
	// 	const { POSList } = props;

	// 	// const codeStatus = {};
	// 	const list = [];
	// 	POSList.forEach(item => {
	// 		list.push(item.sn);
	// 	});

	// 	this.setState({
	// 		selectedRowKeys: list
	// 	});
	// }

	startClock = () => {

		clearInterval(this.interval);
		this.interval = setInterval(() => {
			const { codeStatus } = this.state;
			const keys = Object.keys(codeStatus);

			keys.forEach((key) => {
				if (codeStatus[key].time >= 0) {
					codeStatus[key].time -= 1;
				}
			});

			this.setState({
				codeStatus
			});

		}, 1000);
	}

	sendCode = (sn) => {
		// console.log('sendCode', sn);
		const { sendCode } = this.props;
		sendCode(sn);
	}

	verifyCode = async (code, sn) => {
		const { verifyCode, POSList } = this.props;
		const result = await verifyCode(code, sn);
		const { codeStatus, selectedRowKeys, chooseList } = this.state;

		if (result === 1) {
			// 选择对应的复选框
			selectedRowKeys.push(sn);

			const list = POSList.filter(item => {
				// console.log(item.sn === sn);
				if (item.sn === sn) {
					return true;
				}
				return false;
			});

			// console.log(chooseList, list);

			this.setState({
				selectedRowKeys: [
					...new Set([...selectedRowKeys, sn])
				],
				chooseList: [
					...new Set([...chooseList, ...list])
				]
			});
		}else{
			let errorMessage = '';
			switch (result) {
				case '5507':
				default:
					errorMessage = formatMessage({id: 'posList.codeWrong'}); // '验证码输入错误，请确认后重新输入';
			}

			const temp = {};
			temp[sn] = {
				time: codeStatus[sn] ? codeStatus[sn].time : 0,
				error : true,
				message : errorMessage
			};

			this.setState({
				codeStatus: {
					...codeStatus,
					...temp
				}
			});
		}
	}

	onClick = () => {
		const { isClick } = this.state;
		// 控制上一步下一步
		this.setState({
			isClick: !isClick,
		});
	};


	getPosition = (list) => {
		const { chooseList } = this.state;
		// 获取框选的位置
		// console.log(list, chooseList);
		const modlist = chooseList.map(item => {
			const f = list.filter(target => target.sn === item.sn)[0];
			return {
				...item,
				...f
			};
		});

		// todo 在这里更新数据
		this.setState({
			chooseList: modlist
		});

	}

	bindDevice = async () => {
		const { bind, sn } = this.props;
		const { chooseList } = this.state;

		const result = await bind(sn, chooseList);
		// console.log(result);
		if (result === 1) {
			// this.showInfoModal();
			// message.success('绑定成功！');
			message.success(formatMessage({id: 'posList.bindSuccess'}));

			setTimeout(() => {
				this.goToPosList();
			}, 500);

		}else{
			// message.error('绑定失败，请重试！');
			switch (result) {
				case 5511:
					message.error(formatMessage({id: 'posList.notVerified'}));
					break;
				default:
					message.error(formatMessage({id: 'posList.bindFailed'}));
			}

		}
	}

	adjustDevice = async () => {
		const { adjust, sn } = this.props;
		const { chooseList } = this.state;

		// todo 需要调整为ajust接口
		const result = await adjust(sn, chooseList);
		// console.log(result);
		if (result === 1) {
			// message.success('修改成功！');
			message.success(formatMessage({id: 'posList.modifySuccess'}));

			setTimeout(() => {
				this.goToPosList();
			}, 500);
		}else{
			// message.error('修改失败，请检查网络连接并重试。');
			switch (result){
				// case 5511:
				// 	message.error(formatMessage({id: 'posList.notVerified'}));
				// 	break;
				default:
					message.error(formatMessage({id: 'posList.modifyFailed'}));
			}
		}
	}

	complete = async () => {
		const { isEdit } = this.props;

		if (isEdit) {
			// 编辑的逻辑
			this.adjustDevice();
		}else {
			// 首次绑定逻辑
			this.bindDevice();
		}
	}

	// showInfoModal = () => {
	// 	this.setState({
	// 		infoVisible: true
	// 	});
	// }

	// hideInfoModal = () => {
	// 	// const { hideAdd } = this.props;
	// 	this.setState({
	// 		infoVisible: false
	// 	});

	// 	// router.push('/cashVerify/posList');
	// 	this.goToPosList();
	// }

	goToPosList = () => {
		const {navigateTo} = this.props;
		navigateTo('posList');
		// router.push('/cashVerify/posList');
	}

	render() {
		const {  POSList, ipcInfo, poses, isEdit, bindedPosList } = this.props;
		const { isClick, chooseList, selectedRowKeys } = this.state;
		const { img, type } = ipcInfo;

		const list = poses.length === 0 ? POSList : POSList.filter(item => poses.includes(item.sn));

		const rowSelection = {
			selectedRowKeys,
			getCheckboxProps: (record) => {
				const {verified} = record;
				return {
					disabled: verified !== 0
				};
			},
			onChange: (keys, rows) => {
				this.setState({
					selectedRowKeys: [...keys],
					chooseList: [...rows]
				});
			},
		};

		// console.log('bindedPosList: ', bindedPosList);

		// const bindedList = bindedPosList.map((item) => {
		// 	const target = POSList.filter((o) => o.sn === item.sn);

		// 	return {
		// 		...item,
		// 		...target[0]
		// 	};
		// });

		const sns = chooseList.map((item) => item.sn);
		// console.log(chooseList, sns);
		const toAddList = [];
		let addColCount = 0;
		let addRowCount = 0;
		sns.map((sn => {
			const target = bindedPosList.filter((o) => o.sn === sn);
			if (target.length === 0) {
				// 该设备还没绑定
				toAddList.push({
					sn,
					width: 320,
					height: 180,
					top: 96 + (180+24)*addColCount,
					left: 1080 - 320 - (320+24)*addRowCount - 24
				});

				if (addColCount >= 3) {
					addColCount = 0;
					addRowCount += 1;
				}else{
					addColCount += 1;
				}
			}
			// 该设备已经绑定过了，需要修改；
		}));

		// 已绑定list和待绑定list的合集；
		const bindedList = [
			...bindedPosList,
			...toAddList
		];

		// console.log(bindedPosList);

		return (
			<>
				<Card bordered={false}>
					{!isClick ? (
						<div className={styles['device-list-block']}>

							<Table
								rowKey={record => record.sn}
								columns={this.columns}
								dataSource={list}
								rowSelection={rowSelection}
								pagination={false}
							/>

							<div className={`${styles['button-block']} ${styles['under-table']}`}>
								<Button
									className={styles.button}
									onClick={
										this.goToPosList
									}
									// size="large"
								>
									{formatMessage({id: 'posList.cancel'})}
								</Button>

								<Button
									type="primary"
									disabled={
										chooseList.length === 0
									}
									onClick={() => {
										if (bindedList.length > 8) {
											// message.error('每台摄像机只能添加8台收银设备，请重新选择！');
											message.error(formatMessage({id: 'posList.maxBindNumber'}));
											return;
										}
										this.onClick();
									}}
									className={styles.button}
									// size="large"
								>
									{formatMessage({id: 'posList.next'})}
								</Button>
							</div>
						</div>
					) : (
						<div>
							<POSBinder
								editing={sns}
								posList={bindedList}
								getPosition={this.getPosition}
								background={img}
								pixelRatio={type === 'FS1' ? '16:9' : '1:1'}
							/>
							<div className={styles['button-block']}>
								{
									isEdit ?
										'' :
										<Button
											onClick={this.onClick}
											// size="large"
											className={styles.button}
										>
											{formatMessage({id: 'posList.forward'})}
										</Button>
								}

								<Button
									className={styles.button}
									type="primary"
									onClick={this.complete}
									// size="large"
								>
									{ formatMessage({id: 'posList.complete' }) }
								</Button>
							</div>
						</div>
					)}
				</Card>

				{/* <Modal
					visible={infoVisible}
					title={null}
					footer={null}
					className={styles['info-modal']}
					onCancel={this.hideInfoModal}
				>
					<span className={styles['success-icon']} />
					<h1>操作成功</h1>
					<p className={styles['info-text']}>注意：为避免输入错误导致错误绑定的风险，系统已发送一条
						<span className={styles['warning-text']}>双向确认信息</span>到对应收银设备，请在收银设备端进行双向确认
					</p>
				</Modal> */}
			</>
		);
	}
}
export default AddPOS;
