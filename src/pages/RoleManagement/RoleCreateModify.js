/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Input, Checkbox, Button, Form, message, Spin, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { idDecode } from '@/utils/utils';
// import { normalInput } from '@/constants/regexp';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';

import styles from './Role.less';

const CheckboxGroup = Checkbox.Group;

@connect(
	state => ({
		role: state.role,
		query: state.routing.location.query,
		user: state.user,
		loading: state.loading,
	}),
	dispatch => ({
		getPermissionList: payload => dispatch({ type: 'role/getPermissionList', payload }),
		getRoleInfo: payload => dispatch({ type: 'role/getRoleInfo', payload }),
		updateRole: payload => dispatch({ type: 'role/updateRole', payload }),
		creatRole: payload => dispatch({ type: 'role/creatRole', payload }),
		updatePermissionList: payload => dispatch({ type: 'role/updatePermissionList', payload }),
		updateRoleInfo: payload => dispatch({ type: 'role/updateRoleInfo', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
@Form.create()
class RoleModify extends React.Component {
	async componentDidMount() {
		const {
			getRoleInfo,
			getPermissionList,
			query: { id },
		} = this.props;

		if (id) {
			const roleId = idDecode(id);
			await getRoleInfo({ roleId });
		}
		await getPermissionList();
	}

	editRole = () => {
		const {
			updateRole,
			form: { validateFields },
			role: { permissionList: pList, roleInfo: { permissionList: rpList } },
			user: {
				currentUser: { username },
			},
			creatRole,
			query: { action, id },
			goToPath,
		} = this.props;
		let valueList = [];
		const permissionList = action === 'modify' ? rpList : pList;
		permissionList.map(item => {
			if (typeof item.valueList !== 'undefined') {
				valueList = [...new Set([...valueList, ...item.valueList])];
			}
		});

		if (valueList.length === 0) {
			message.error(formatMessage({ id: 'roleManagement.role.roleRootEmpty' }));
			return;
		}
		validateFields(async (err, values) => {
			if (!err) {
				if (action === 'modify') {
					const roleId = idDecode(id);
					const response = await updateRole({
						name: values.name,
						roleId,
						permissionIdList: valueList,
					});
					if (response && response.code === ERROR_OK) {
						message.success(formatMessage({ id: 'roleManagement.role.modifySuccess' }));
						goToPath('roleList');
						// router.push(`${MENU_PREFIX.ROLE}/roleList`);
					} else {
						message.error(
							ALERT_NOTICE_MAP.hasOwnProperty(response.code) ? formatMessage({ id: ALERT_NOTICE_MAP[response.code] })
								: formatMessage({ id: 'roleManagement.role.modifyFail' })
						);
					}
				} else {
					const response = await creatRole({
						name: values.name,
						permissionIdList: valueList,
						username,
					});
					if (response && response.code === ERROR_OK) {
						message.success(formatMessage({ id: 'roleManagement.role.createSuccess' }));
						goToPath('roleList');
						// router.push(`${MENU_PREFIX.ROLE}/roleList`);
					} else {
						message.error(
							ALERT_NOTICE_MAP.hasOwnProperty(response.code) ? formatMessage({ id: ALERT_NOTICE_MAP[response.code] })
								: formatMessage({ id: 'roleManagement.role.createFail' })
						);
					}
				}
			}
		});
	};

	cancel = () => {
		const { goToPath } = this.props;
		goToPath('roleList');
		// router.push(`${MENU_PREFIX.ROLE}/roleList`);
	};

	handleGroupChange = (checklist, item) => {
		const {
			role: { permissionList, roleInfo },
			updateRoleInfo,
		} = this.props;

		const per = permissionList.find(permission => permission.group === item.group);
		const myPer = roleInfo.permissionList.find(permission => permission.group === item.group);

		if (myPer) {
			myPer.valueList = checklist;
			myPer.checkAll = checklist.length === per.valueList.length;
			myPer.indeterminate = checklist.length === 0 ? false : checklist.length < per.valueList.length;
		} else {
			roleInfo.permissionList.push({
				group: item.group,
				valueList: checklist,
				checkAll: checklist.length === per.valueList.length,
				indeterminate: checklist.length === 0 ? false : checklist.length < per.valueList.length
			});
		}

		updateRoleInfo({
			roleInfo
		});
	};

	onCheckAllChange = (e, item) => {
		const {
			role: { permissionList, roleInfo },
			updateRoleInfo,
		} = this.props;

		if (!roleInfo.permissionList) {
			roleInfo.permissionList = [];
		}
		const per = permissionList.find(permission => permission.group === item.group);
		const myPer = roleInfo.permissionList.find(permission => permission.group === item.group);
		if (myPer) {
			myPer.checkAll = e.target.checked;
			myPer.indeterminate = false;
			myPer.valueList = e.target.checked ? per.valueList : [];
		} else {
			e.target.checked && roleInfo.permissionList.push({
				...per,
				checkAll: true,
				indeterminate: false
			});
		}
		updateRoleInfo({
			roleInfo
		});
	};

	render() {
		const {
			role: {
				permissionList,
				roleInfo: {
					name,
					// permissionList: pList
				},
			},
			loading,
			form: { getFieldDecorator },
			query: { action },
		} = this.props;
		return (
			<Card>
				<Spin
					spinning={
						action === 'modify'
							? loading.effects['role/getRoleInfo']
							: loading.effects['role/getPermissionList']
					}
				>
					<div className={styles.wrapper}>
						<Form {...FORM_ITEM_LAYOUT_BUSINESS}>
							<Form.Item
								label={formatMessage({ id: 'roleManagement.role.roleName' })}
							>
								{getFieldDecorator('name', {
									initialValue: action === 'modify' ? name : '',
									validateTrigger: 'onBlur',
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'roleManagement.role.roleNameEmpty',
											}),
										},
										{
											validator: (rule, value, callback) => {
												let illegalFlag = false;
												for(const word of value){
													if(isNaN(word.charCodeAt(1)) === false){
														illegalFlag = true;
														break;
													}
													if((word.charCodeAt(0) >= 8203 && word.charCodeAt(0) <= 8205) ||
													(word.charCodeAt(0) >= 8232 && word.charCodeAt(0) <= 8238) ||
													(word.charCodeAt(0) >= 8 && word.charCodeAt(0) <= 13) ||
													(word.charCodeAt(0) >= 8 && word.charCodeAt(0) <= 13) ||
													word.charCodeAt(0) === 34 || word.charCodeAt(0) === 39 ||
													word.charCodeAt(0) === 92 || word.charCodeAt(0) === 160 ||
													word.charCodeAt(0) === 65279 && isNaN(word.charCodeAt(1)) === true){
														illegalFlag = true;
														break;
													}
												}

												if (illegalFlag) {
													callback('name-illegal');
												} else {
													callback();
												}
											},
											message: formatMessage({ id: 'roleManagement.input.illegal' }),
										},
									],
								})(<Input maxLength={20} />)}
							</Form.Item>
							<Form.Item
								label={formatMessage({ id: 'roleManagement.role.roleRoot' })}
							>
								{getFieldDecorator('content', {
									initialValue: ['content'],
									rules: [
										{
											required: true,
										},
									],
								})(
									<div>
										{permissionList.map((item, key) => {
											// const finalList = action === 'modify' ? pList : permissionList;
											const finalList = permissionList;
											const mappedItem = finalList.find(p => p.group === item.group) || {};
											return (
												<div key={key} style={{ marginBottom: '30px' }}>
													<Checkbox
														onChange={e =>
															this.onCheckAllChange(e, item)
														}
														indeterminate={action === 'create' ? false : mappedItem.indeterminate}
														checked={action === 'create' ? true : mappedItem.checkAll}
														disabled
													>
														{item.checkedList.label}
													</Checkbox>
													<div>
														{item.checkedList.permissionList && (
															<CheckboxGroup
																onChange={e =>
																	this.handleGroupChange(
																		e,
																		item
																	)
																}
																options={
																	item.checkedList.permissionList
																}
																value={mappedItem.valueList}
																disabled
															/>
														)}
													</div>
												</div>
											);
										})}
									</div>
								)}
							</Form.Item>
							<Form.Item label=" " colon={false}>
								<Button
									type="primary"
									onClick={this.editRole}
									className={styles.submit}
									loading={
										action === 'modify'
											? loading.effects['role/updateRole']
											: loading.effects['role/creatRole']
									}
								>
									{formatMessage({ id: 'btn.submit' })}
								</Button>
								<Button onClick={this.cancel}>
									{formatMessage({ id: 'btn.cancel' })}
								</Button>
							</Form.Item>
						</Form>
					</div>
				</Spin>
			</Card>
		);
	}
}

export default RoleModify;
