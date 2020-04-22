/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Input, Form, message, Spin, Modal, Tree, TreeSelect } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
// import { normalInput } from '@/constants/regexp';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';

import styles from './Role.less';

const { TreeNode } = Tree;

@connect(
	state => ({
		role: state.role,
		query: state.routing.location.query,
		user: state.user,
		loading: state.loading,
	}),
	dispatch => ({
		getRoleInfo: payload => dispatch({ type: 'role/getRoleInfo', payload }),
		updateRole: payload => dispatch({ type: 'role/updateRole', payload }),
		creatRole: payload => dispatch({ type: 'role/creatRole', payload }),
		updatePermissionList: payload => dispatch({ type: 'role/updatePermissionList', payload }),
		updateRoleInfo: payload => dispatch({ type: 'role/updateRoleInfo', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		getRoleList: payload => dispatch({ type: 'role/getRoleList', payload }),
	})
)
@Form.create()
class RoleModify extends React.Component {
	editRole = () => {
		const {
			updateRole,
			form: { validateFields, resetFields },
			user: {
				currentUser: { username },
			},
			creatRole,
			id,
			action,
			closeModal,
			getRoleList,
		} = this.props;

		validateFields(async (err, values) => {
			if (values.content.length === 0) {
				message.error(formatMessage({ id: 'roleManagement.role.roleRootEmpty' }));
				return;
			}
			if (!err) {
				if (action === 'modify') {
					const response = await updateRole({
						name: values.name,
						roleId: id,
						permissionIdList: values.content,
					});
					if (response && response.code === ERROR_OK) {
						message.success(formatMessage({ id: 'roleManagement.role.modifySuccess' }));
						resetFields();
						closeModal();
						// goToPath('roleList');
						// router.push(`${MENU_PREFIX.ROLE}/roleList`);
					} else {
						message.error(
							ALERT_NOTICE_MAP[response.code]
								? formatMessage({ id: ALERT_NOTICE_MAP[response.code] })
								: formatMessage({ id: 'roleManagement.role.modifyFail' })
						);
					}
				} else {
					const response = await creatRole({
						name: values.name,
						permissionIdList: values.content,
						username,
					});
					if (response && response.code === ERROR_OK) {
						message.success(formatMessage({ id: 'roleManagement.role.createSuccess' }));
						resetFields();
						closeModal();
						getRoleList();
						// goToPath('roleList');
						// router.push(`${MENU_PREFIX.ROLE}/roleList`);
					} else {
						message.error(
							ALERT_NOTICE_MAP[response.code]
								? formatMessage({ id: ALERT_NOTICE_MAP[response.code] })
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

	render() {
		const {
			role: {
				permissionList,
				roleInfo: { name, checkedList, isDefault },
			},
			loading,
			form: { getFieldDecorator },
			action,
			visible,
			closeModal,
		} = this.props;
		const disabled = isDefault === 1;
		return (
			<Modal
				title={formatMessage({ id: 'roleManagement.role.editRole' })}
				visible={visible}
				closable={false}
				width={600}
				okText={
					action === 'modify'
						? formatMessage({ id: 'btn.submit' })
						: formatMessage({ id: 'roleManagement.role.btn.create' })
				}
				onOk={() => this.editRole()}
				onCancel={closeModal}
				confirmLoading={
					action === 'modify'
						? loading.effects['role/updateRole']
						: loading.effects['role/creatRole']
				}
				destroyOnClose
				okButtonProps={{ disabled }}
			>
				{/* <Card> */}
				<Spin
					spinning={
						action === 'modify'
							? loading.effects['role/getRoleInfo']
							: loading.effects['role/getPermissionList']
					}
				>
					<div className={styles.wrapper}>
						<Form {...{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}>
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
												for (const word of value) {
													if (isNaN(word.charCodeAt(1)) === false) {
														illegalFlag = true;
														break;
													}
													if (
														(word.charCodeAt(0) >= 8203 &&
															word.charCodeAt(0) <= 8205) ||
														(word.charCodeAt(0) >= 8232 &&
															word.charCodeAt(0) <= 8238) ||
														(word.charCodeAt(0) >= 8 &&
															word.charCodeAt(0) <= 13) ||
														(word.charCodeAt(0) >= 8 &&
															word.charCodeAt(0) <= 13) ||
														word.charCodeAt(0) === 34 ||
														word.charCodeAt(0) === 39 ||
														word.charCodeAt(0) === 92 ||
														word.charCodeAt(0) === 160 ||
														(word.charCodeAt(0) === 65279 &&
															isNaN(word.charCodeAt(1)) === true)
													) {
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
											message: formatMessage({
												id: 'roleManagement.input.illegal',
											}),
										},
									],
								})(
									<Input
										maxLength={20}
										placeholder={formatMessage({
											id: 'roleManagement.modify.name.placeholder',
										})}
										disabled={disabled}
									/>
								)}
							</Form.Item>
							<Form.Item
								label={formatMessage({ id: 'roleManagement.role.roleRoot' })}
							>
								{getFieldDecorator('content', {
									initialValue: checkedList,
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'roleManagement.role.roleRootEmpty',
											}),
										},
									],
								})(
									<TreeSelect
										className={styles.tree}
										dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
										treeDefaultExpandAll
										allowClear
										multiple
										showSearch
										treeCheckable
										searchPlaceholder={formatMessage({
											id: 'roleManagement.permission.search.placeholder',
										})}
										filterTreeNode={(input, node) => {
											const { title } = node.props;
											return title.indexOf(input) > -1;
										}}
										disabled={disabled}
									>
										{permissionList.map((firstMenu, index) => (
											<TreeNode
												title={firstMenu.label}
												value={`0-${index}`}
												key={`0-${index}`}
											>
												{firstMenu.permissionList.map(secondMenu => (
													<TreeNode
														title={secondMenu.label}
														value={secondMenu.value}
														key={secondMenu.value}
													/>
												))}
											</TreeNode>
										))}
									</TreeSelect>
								)}
							</Form.Item>
						</Form>
					</div>
				</Spin>
				{/* </Card> */}
			</Modal>
		);
	}
}

export default RoleModify;
