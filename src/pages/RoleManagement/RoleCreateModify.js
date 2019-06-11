import React from 'react';
import { Input, Checkbox, Button, Form, message } from 'antd';
import { connect } from 'dva';
import { getLocationParam, idDecode } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
// import { ERROR_OK } from '@/constants/errorCode';
import { MENU_PREFIX } from '@/constants';

import styles from './Role.less';

const CheckboxGroup = Checkbox.Group;

@connect(
	state => ({
		role: state.role,
		user: state.user,
	}),
	dispatch => ({
		getPermissionList: payload => dispatch({ type: 'role/getPermissionList', payload }),
		getRoleInfo: payload => dispatch({ type: 'role/getRoleInfo', payload }),
		updateRole: payload => dispatch({ type: 'role/updateRole', payload }),
		creatRole: payload => dispatch({ type: 'role/creatRole', payload }),
		updatePermissionList: payload => dispatch({ type: 'role/updatePermissionList', payload }),
	})
)
@Form.create()
class RoleModify extends React.Component {
	componentDidMount() {
		const action = getLocationParam('action');
		const { getRoleInfo, getPermissionList } = this.props;
		if (action === 'modify') {
			const roleId = idDecode(getLocationParam('id'));
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
		} = this.props;
		const action = getLocationParam('action');
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
					const roleId = idDecode(getLocationParam('id'));
					await updateRole({
						name: values.name,
						roleId,
						permissionIdList: valueList,
					});
				} else {
					await creatRole({
						name: values.name,
						permissionIdList: valueList,
						username,
					});
				}
			}
		});
	};

	cancel = () => {
		router.push(`${MENU_PREFIX.ROLE}/roleList`);
	};

	handleGroupChange = (checklist, group) => {
		const {
			role: { permissionList },
			updatePermissionList,
		} = this.props;

		const tmpList = permissionList.map(item => {
			if (item.group === group) {
				const plainLength = item.checkedList.permission_list.length;
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
				const permission = item.checkedList.permission_list;
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
			form: { getFieldDecorator },
		} = this.props;
		const action = getLocationParam('action');
		return (
			<div className={styles.wrapper}>
				<Form {...FORM_ITEM_LAYOUT_BUSINESS}>
					<Form.Item label={formatMessage({ id: 'roleManagement.role.roleName' })}>
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
					<Form.Item label={formatMessage({ id: 'roleManagement.role.roleRoot' })}>
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
											onChange={e => this.onCheckAllChange(e, item.group)}
											indeterminate={item.indeterminate}
											defaultChecked={item.checkAll}
											checked={item.checkAll}
										>
											{item.checkedList.label}
										</Checkbox>
										<div>
											{item.checkedList.permission_list && (
												<CheckboxGroup
													onChange={e =>
														this.handleGroupChange(e, item.group)
													}
													options={item.checkedList.permission_list}
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
						<Button type="primary" onClick={this.editRole} className={styles.submit}>
							{formatMessage({ id: 'btn.submit' })}
						</Button>
						<Button onClick={this.cancel}>{formatMessage({ id: 'btn.cancel' })}</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

export default RoleModify;
