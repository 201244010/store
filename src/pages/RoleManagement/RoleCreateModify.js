import React from 'react';
import { Input, Checkbox, Button, Form, message, Spin, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { idDecode } from '@/utils/utils';
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
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
@Form.create()
class RoleModify extends React.Component {
	componentDidMount() {
		const {
			getRoleInfo,
			getPermissionList,
			query: { action, id },
		} = this.props;
		if (action === 'modify') {
			const roleId = idDecode(id);
			getRoleInfo({ roleId });
		} else {
			getPermissionList();
		}
	}

	editRole = () => {
		const {
			updateRole,
			form: { validateFields },
			role: { permissionList },
			user: {
				currentUser: { username },
			},
			creatRole,
			query: { action, id },
			goToPath,
		} = this.props;
		let valueList = [];
		permissionList.map(item => {
			if (typeof item.valueList !== 'undefined') {
				valueList = [...valueList, ...item.valueList];
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
							formatMessage({ id: ALERT_NOTICE_MAP[response.code] }) ||
								formatMessage({ id: 'roleManagement.role.modifyFail' })
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
							formatMessage({ id: ALERT_NOTICE_MAP[response.code] }) ||
								formatMessage({ id: 'roleManagement.role.createFail' })
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

	handleGroupChange = (checklist, group) => {
		const {
			role: { permissionList },
			updatePermissionList,
		} = this.props;

		const tmpList = permissionList.map(item => {
			if (item.group === group) {
				const plainLength = item.checkedList.permissionList.length;
				item.checkAll = checklist.length === plainLength;
				item.indeterminate = !!checklist.length && checklist.length < plainLength;
				item.valueList = checklist;
			}
			return item;
		});

		updatePermissionList(tmpList);
	};

	onCheckAllChange = (e, group) => {
		const {
			role: { permissionList },
			updatePermissionList,
		} = this.props;
		const tmpList = permissionList.map(item => {
			if (item.group === group) {
				const permission = item.checkedList.permissionList;
				const totalList = permission
					? permission.map(items => items.value)
					: [item.checkedList.value];
				item.checkAll = e.target.checked;
				item.indeterminate = false;
				item.valueList = e.target.checked ? totalList : [];
			}
			return item;
		});

		updatePermissionList(tmpList);
	};

	render() {
		const {
			role: {
				permissionList,
				roleInfo: { name },
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
									],
								})(<Input maxLength={40} />)}
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
										{permissionList.map((item, key) => (
											<div key={key} style={{ marginBottom: '30px' }}>
												<Checkbox
													onChange={e =>
														this.onCheckAllChange(e, item.group)
													}
													indeterminate={item.indeterminate}
													defaultChecked={item.checkAll}
													checked={item.checkAll}
												>
													{item.checkedList.label}
												</Checkbox>
												<div>
													{item.checkedList.permissionList && (
														<CheckboxGroup
															onChange={e =>
																this.handleGroupChange(
																	e,
																	item.group
																)
															}
															options={
																item.checkedList.permissionList
															}
															value={item.valueList}
														/>
													)}
												</div>
											</div>
										))}
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
