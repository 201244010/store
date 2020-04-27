import React from 'react';
import { Card, Table, Popconfirm, Icon, message, Modal, Form, Input, Button, Divider } from 'antd';
// import { Link } from 'dva/router';
// import router from 'umi/router';

import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

import moment from 'moment';

import styles from './POSList.less';
// import AddPOS from './AddPOS';

const mapStateToProps = (state) => {
	const { posList } = state;
	return {
		posList
	};
};

const mapDispatchToProps = (dispatch) => ({
	getIPCList: () => {
		const result = dispatch({
			type: 'ipcList/read'
		});
		return result;
	},
	getPOSList: (startTime, endTime) => {
		dispatch({
			type: 'posList/read',
			payload: {
				startTime,
				endTime
			}
		});
	},
	delete: ({ ipcSN, posSN }) => {
		dispatch({
			type: 'posList/delete',
			payload: {
				ipcSN,
				posSN
			}
		}).then((result) => {
			if (result) {
				// message.success('删除成功！');
				message.success(formatMessage({ id: 'posList.deleteSuccess' }));
			} else {
				// message.error('删除失败，请检查网络连接并重试。');
				message.error(formatMessage({ id: 'posList.deleteFailed' }));
			}
		});
	},
	unbind: ({ ipcSN, posSN }) => {
		dispatch({
			type: 'posList/unbind',
			payload: {
				ipcSN,
				posSN
			}
		}).then((result) => {
			if (result) {
				// message.success('解绑成功！');
				message.success(formatMessage({ id: 'posList.unbindSuccess' }));
			} else {
				// message.error('解绑失败，请检查网络连接并重试。');
				message.error(formatMessage({ id: 'posList.unbindFailed' }));
			}
		});
	},
	checkSN: (ipcSN, posSN) => {
		const result = dispatch({
			type: 'bindingPosList/checkSN',
			payload: {
				ipcSN,
				posSN
			}
		});
		return result;
	},
	addPOS: ({ ipcSN, snList }) => {
		const result = dispatch({
			type: 'bindingPosList/addSN',
			payload: {
				ipcSN,
				snList
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



@connect(
	mapStateToProps,
	mapDispatchToProps,
)
class POSList extends React.Component {

	state = {
		inputVisible: false,
		snList: [
			{
				sn: ''
			}
		]
	}

	currentIpcSN = ''

	async componentDidMount() {
		const { getPOSList } = this.props;

		getPOSList(moment().set({
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		}).unix(), moment().set({
			hours: 23,
			minutes: 59,
			seconds: 59,
			milliseconds: 999
		}).unix());
	}

	// showAdd = (device) => {
	// 	// 添加收银设备页面
	// 	this.setState({
	// 		// isAdd: true,
	// 		chosenDevice: device,
	// 	});
	// }

	// hideAdd = () => {
	// 	// 返回ipc列表
	// 	this.setState({
	// 		isAdd: false
	// 	});
	// }

	deleteUnbindedPos = async (ipcSN, posSN) => {
		const { delete: removePos } = this.props;
		removePos({
			ipcSN,
			posSN
		});

	}

	toPath = (target, {sn, ipcId, ipcSN}) => {
		const {navigateTo} = this.props;
		const path = {
			videos:{
				pathId:'videos',
				urlParams:{
					posSN: sn,
					ipcId
				}
			},
			bindPOSDevice: {
				pathId: 'bindPOSDevice',
				urlParams:{
					sn: ipcSN,
					posList: sn,
					edit: 1
				}
			},
			rebindPOSDevice:{
				pathId: 'bindPOSDevice',
				urlParams:{
					sn: ipcSN,
					posList: sn,
				}
			}
		};

		const {pathId, urlParams = {}} = path[target] || {};
		// console.log('topath', pathId);
		navigateTo(pathId, urlParams);

	}

	generateColumns = (ipcSN, ipcId) => {
		const columns = [
			{
				title: formatMessage({ id: 'posList.monitorBlock' }),
				dataIndex: 'src',
				key: 'image',
				render: src => (
					src ?
						<div className={styles.shortcut}>
							<img className={styles.image} src={src} alt={formatMessage({ id: 'posList.monitorBlock' })} />
						</div>
						: ''
				)
			},
			{
				title: formatMessage({ id: 'posList.alias' }),
				dataIndex: 'alias',
				key: 'alias'
			},
			{
				title: formatMessage({ id: 'posList.posDevice' }),
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: formatMessage({ id: 'posList.deviceSN' }),
				dataIndex: 'sn',
				key: 'sn',
			},
			{
				title: formatMessage({ id: 'posList.deviceStatus' }),
				dataIndex: 'status',
				key: 'status',
				render: status => (
					<div className={styles['status-block']}>
						<span
							className={
								`${styles.icon} ${
									(() => {
										switch (status) {
											case 0:
												return styles['success-icon'];
											case 1:
											default:
												return styles['error-icon'];
										}
									})()
								}`
							}
						/>
						<span
							className={styles.text}
						>
							{
								(() => {
									switch (status) {
										case 0:
											return formatMessage({ id: 'posList.unbindSucceed' }); // '绑定成功';
										case 1:
										default:
											return formatMessage({ id: 'posList.unbindFail' }); // '绑定失败';
									}
								})()
							}
						</span>
					</div>
				),
			},
			{
				title: formatMessage({ id: 'posList.todayAmount' }),
				dataIndex: 'amount',
				key: 'amount',
				// render: (amount, record) => `${amount} (${record.count})`
			},
			{
				title: formatMessage({ id: 'posList.todayCount' }),
				dataIndex: 'count',
				key: 'count',
				// render: (amount, record) => `${amount} (${record.count})`
			},
			{
				title: formatMessage({ id: 'posList.operation' }),
				dataIndex: 'sn',
				key: 'operation',
				render: (sn, record) => {
					// console.log(record);
					if (record.status === 0) {
						return (
							<div>
								{/* <Link
									className={styles['row-operation']}
									// href="javascript:void(0);"
									to={`/cashVerify/videos?posSN=${sn}&ipcId=${ipcId}`}
						>
									{formatMessage({ id: 'posList.video' })}
								</Link> */}
								<a href="javascript:void(0)" onClick={() => this.toPath('videos', {sn, ipcId})}>
									{formatMessage({ id: 'posList.records' })}
								</a>
								{/* <Divider type="veritcal" /> */}
								{/* <Link
									className={styles['row-operation']}
									to={`/cashVerify/bindPOSDevice?sn=${ipcSN}&posList=${sn}&edit=1`}
								>
									{formatMessage({ id: 'posList.adjustScreen' })}
								</Link> */}
								{/* <a href="javascript:void(0)" onClick={() => this.toPath('bindPOSDevice', {ipcSN, sn})}>
									{formatMessage({ id: 'posList.adjustScreen' })}
								</a> */}
								{/* <a
									className={styles['row-operation']}
									href="javascript:void(0);"
								>
									{ formatMessage({id: 'posList.adjustScreen'}) }
								</a> */}
								{/* <Divider type="veritcal" /> */}
								{/* <Popconfirm
									icon={
										<Icon type="close-circle" theme="filled" style={{ color: 'red' }} />
									}
									title={
										<div>
											<span>{formatMessage({ id: 'posList.unbindConfirm' })}</span>
											<p>
												{formatMessage({ id: 'posList.unbindMsg' })}
											</p>
										</div>
									}
									onConfirm={() => {
										this.onUnbind({
											ipcSN,
											posSN: sn
										});
									}}
								>
									<a
										className={styles['row-operation']}
										href="javascript:void(0);"
									// onClick={this.showPopover}
									>
										{formatMessage({ id: 'posList.unbind' })}
									</a>
								</Popconfirm> */}
							</div>
						);
					}
					return (
						<div>
							{/* <a
								href="javascript:void(0);"
								className={styles['row-operation']}
							>
								重新绑定
							</a> */}

							{/* <Link
								className={styles['row-operation']}
								// href="javascript:void(0);"
								to={`/cashVerify/bindPOSDevice?sn=${ipcSN}&posList=${sn}`}
							>
								{/* 重新绑定 */}
							{/* {formatMessage({ id: 'posList.rebind' })}
							</Link> */}

							<a href="javascript:void(0);" onClick={() => this.toPath('rebindPOSDevice', {ipcSN, sn})}>
								{formatMessage({ id: 'posList.rebind' })}
							</a>
							<Divider type="veritcal" />
							<Popconfirm
								icon={
									<Icon type="close-circle" theme="filled" style={{ color: 'red' }} />
								}
								title={
									<div>
										<span>{formatMessage({ id: 'posList.deleteConfirm' })}</span>
										<p>
											{formatMessage({ id: 'posList.deleteMsg' })}
										</p>
									</div>
								}
								okText={formatMessage({ id: 'posList.delete' })}
								okType='danger'
								onConfirm={() => {
									this.deleteUnbindedPos(ipcSN, sn);
								}}
							>
								<a
									href="javascript:void(0);"
									className={styles['row-operation']}
								// onClick={() => {
								// 	this.deleteUnbindedPos(ipcSN, sn);
								// }}
								>
									{/* 删除设备 */}
									{formatMessage({ id: 'posList.removeDevice' })}
								</a>
							</Popconfirm>


						</div>
					);

				},
			}
		];

		return columns;
	}

	onUnbind = ({ ipcSN, posSN }) => {
		// 解绑
		const { unbind } = this.props;
		unbind({
			ipcSN,
			posSN
		});
	}

	validateSN = async (posSN, ipcSN) => {
		// const posSN = value;
		const { checkSN } = this.props;

		const target = {
			sn: posSN
		}; // snList[index]; // snList.filter((item) => item.sn === posSN)[0];

		if (posSN === '') {
			target.error = true;
			target.message = formatMessage({ id: 'posList.enterSN' }); // '请输入需要绑定设备的SN码。';
		} else {
			const code = await checkSN(ipcSN, posSN);
			if (code !== 1) {
				target.error = true;

				switch (code) {
					case 5510:
						target.message = formatMessage({ id: 'posList.posBinded' }); // '该收银设备已绑定其它IPC设备，请重新输入。';
						break;
					case 5509:
						target.message = formatMessage({ id: 'posList.posNotBelong' }); // '该收银设备不属于当前店铺，请重新输入。';
						break;
					case 5508:
					default:
						target.message = formatMessage({ id: 'posList.posNoSN' }); // '无法查询到该SN号，请重新输入。';
						break;
				}

			} else {
				target.error = false;
			}
		}


		const { snList } = this.state;
		const o = [];
		snList.forEach((item) => {
			if (item.sn === posSN) {
				item = target;
			}
			o.push(item);
		});

		this.setState({
			snList: o
		});

		return target.error;
	}


	onAddPos = async () => {
		// 添加收银设备
		const { addPOS, navigateTo } = this.props;
		const { snList } = this.state;
		const ipcSN = this.currentIpcSN;

		let flag = false;

		await Promise.all(snList.map(async (item) => {
			if (item.error === true) {
				flag = true;
			}

			if (item.error === undefined) {
				const result = await this.validateSN(item.sn, ipcSN);
				// console.log('result: ', result);
				if (result === true) {
					flag = true;
				}
			}
		}));
		// console.log('flag: ', flag);
		if (flag) {
			return;
		}

		const list = snList.map(item => item.sn);
		const result = await addPOS({
			ipcSN,
			snList: list
		});

		if (result) {
			// this.setState({
			// 	inputVisible: false,
			// });
			navigateTo('bindPOSDevice', {
				sn: ipcSN,
				posList: list.join('|')
			});
			// router.push(`/cashVerify/bindPOSDevice?sn=${ipcSN}&posList=${list.join('|')}`);

		} else {
			// message.error('设备添加失败。');
			message.error(formatMessage({ id: 'posList.addFailed' }));
		};
		// console.log('done',device);
		// this.setState({
		// 	// isClick: !this.state.isClick,
		// 	// deviceList: [...this.state.deviceList, ...device],
		// 	inputVisible: false,
		// 	sn:''
		// });

	};

	render() {
		const { posList: list } = this.props;
		const { snList, inputVisible } = this.state;

		const posList = [
			...list
		];

		posList.sort((a, b) => {
			// console.log(a, b);
			let compareResult;
			let nameCompare;
			if (a.name.localeCompare) {
				nameCompare = a.name.localeCompare(b.name);
			}else{
				nameCompare = a.name - b.name;
			}
			if(nameCompare === 0){
				if (a.sn.localeCompare) {
					compareResult = a.sn.localeCompare(b.sn);
				}else{
					compareResult = a.sn - b.sn;
				}
			}else{
				compareResult = nameCompare;
			}
			return compareResult;
		});

		return (
			<>
				{
					posList.length === 0 ?
						<Card className={styles['no-ipc']} bordered={false}>
							{formatMessage({ id: 'posList.noCamera' })}
						</Card>
						: ''
				}
				{
					posList.map((item) => (
						<Card
							className={styles['pos-list-block']}
							key={item.sn}
							bordered={false}
						>
							<h3>{item.name ? item.name :  formatMessage({ id: 'posList.myCamera'})}</h3>

							{
								item.posList.length === 0 ?
									'' :
									<Table
										key={item.sn}
										rowKey={record => `${item.id}-${record.sn}`}
										columns={this.generateColumns(item.sn, item.id)}
										dataSource={item.posList}
										pagination={false}
									/>
							}


							<div
								className={
									styles['add-reactangle']
								}
							>
								<a
									href='javascript:void(0);'
									// onClick={() => {
									// 	this.currentIpcSN = item.sn;
									// 	this.setState({
									// 		snList: [
									// 			{
									// 				sn: ''
									// 			}
									// 		],
									// 		inputVisible: true,
									// 	});
									// }}
								>
									{formatMessage({ id: 'posList.addPOS.tips' })}
								</a>
								{/* <Link
									to={`/cashVerify/bindPOSDevice?sn=${item.sn}`}
									onClick={() => {
										this.showAdd(item.ipc);
									}}
								>
									{ `+${formatMessage({id: 'posList.addPOS'})}` }
								</Link> */}
							</div>
						</Card>
					))
				}

				<Modal
					visible={inputVisible}
					maskClosable={false}
					title={formatMessage({ id: 'posList.modalTitle' })}
					onOk={this.onAddPos}
					onCancel={() => {
						this.setState({
							inputVisible: false
						});
					}}

					footer={[
						<Button
							key="back"
							onClick={() => {
								this.setState({
									inputVisible: false
								});
							}}
						>
							{formatMessage({ id: 'posList.cancel' })}
						</Button>,
						<Button
							key="add"
							onClick={
								() => {
									this.setState({
										snList: [
											...snList,
											{
												sn: ''
											}
										]
									});
								}
							}
						>
							{formatMessage({ id: 'posList.continueAdd' })}
						</Button>,
						<Button
							key="submit"
							type="primary"
							onClick={this.onAddPos}
						>
							{formatMessage({ id: 'posList.confirm' })}
						</Button>,
					]}
				>
					<Form>
						{
							snList.map((item, index) => (
								<div key={index}>
									<Form.Item
										// labelCol={{
										// 	span: 8
										// }}
										// label={formatMessage({id: 'posList.inputLabel'})}

										validateStatus={
											item.error ? 'error' : 'success'
										}

										help={
											item.error ? item.message : ''
										}
									>
										<div className={styles['input-line-block']}>
											<Input
												className={styles['info-input']}
												placeholder={formatMessage({ id: 'posList.inputMsg' })}
												onChange={
													(e) => {
														snList[index].sn = e.target.value;
														snList[index].error = undefined;

														this.setState({
															snList
														});
													}
												}
												onBlur={
													(e) => {
														// console.log('blur')
														const { value } = e.target;
														this.validateSN(value, this.currentIpcSN);
													}
												}
												value={item.sn}
											/>
											<>
												{
													// index === snList.length - 1 ?
													// 	<a
													// 		className={`${styles['btn-sn']} ${styles['btn-add']}`}
													// 		href='javascript:void(0);'
													// 		onClick={
													// 			() => {
													// 				this.setState({
													// 					snList: [
													// 						...snList,
													// 						{
													// 							sn: ''
													// 						}
													// 					]
													// 				});
													// 			}
													// 		}
													// 	>
													// 		+
													// 	</a>
													snList.length === 1 ?
														'' :
														<a
															className={`${styles['btn-sn']} ${styles['btn-remove']}`}
															href='javascript:void(0);'
															onClick={
																() => {
																	snList.splice(index, 1);

																	this.setState({
																		snList: [
																			...snList
																		]
																	});
																}
															}
														>
															-
														</a>
												}
											</>
										</div>
									</Form.Item>
								</div>
							))
						}

					</Form>
				</Modal>

			</>
		);
	}
}
export default POSList;