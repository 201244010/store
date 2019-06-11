import React from 'react';
import { Input, Checkbox, Button, Form } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { MENU_PREFIX } from '@/constants';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
import { ERROR_OK } from '@/constants/errorCode';

import styles from './Role.less';

const CheckboxGroup = Checkbox.Group;

@connect(
	state => ({
		role: state.role,
		user: state.user,
	}),
	dispatch => ({
		getPermissionList: payload => dispatch({ type: 'role/getPermissionList', payload }),
		creatRole: payload => dispatch({ type: 'role/creatRole', payload }),
		updatePermissionList: payload => dispatch({ type: 'role/updatePermissionList', payload }),
	})
)
@Form.create()
class RoleCreate extends React.Component {
	componentDidMount() {
		const { getPermissionList } = this.props;
		getPermissionList();
	}

	editRole = () => {
		const {
			role: { permissionList },
			form: { validateFields, setFields },
			user: {
				currentUser: { username },
			},
			creatRole,
		} = this.props;
		let valueList = [];
		permissionList.map(item => {
			if (typeof item.valueList !== 'undefined') {
				valueList = [...valueList, ...item.valueList];
			}
		});
		validateFields(async (err, values) => {
			if (!err) {
				const response = await creatRole({
					name: values.name,
					permissionIdList:valueList,
					username
				});
				if (response && response.code !== ERROR_OK) {
					setFields({
						name: {
							value: values.name,
							errors: [],
						},
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
			form: { getFieldDecorator },
			role: { permissionList },
		} = this.props;
		return (
			<div className={styles.wrapper}>
				<Form {...FORM_ITEM_LAYOUT_BUSINESS}>
					<Form.Item label="角色名称">
						{getFieldDecorator('name', {
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: '角色名称不能为空',
								},
							],
						})(<Input maxLength={40} />)}
					</Form.Item>
					<Form.Item label="角色权限">
						{getFieldDecorator('content', {
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
							提交
						</Button>
						<Button onClick={this.cancel}>取消</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

export default RoleCreate;
