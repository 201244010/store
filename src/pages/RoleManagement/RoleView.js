import React from 'react';
import { Checkbox, Button, Form, Spin, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { idDecode } from '@/utils/utils';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';

import styles from './Role.less';

const CheckboxGroup = Checkbox.Group;

@connect(
	state => ({
		role: state.role,
		loading: state.loading,
		query: state.routing.location.query,
	}),
	dispatch => ({
		getPermissionList: payload => dispatch({ type: 'role/getPermissionList', payload }),
		getRoleInfo: payload => dispatch({ type: 'role/getRoleInfo', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
@Form.create()
class RoleView extends React.Component {
	async componentDidMount() {
		const {
			getRoleInfo,
			getPermissionList,
			query: { id },
		} = this.props;
		const roleId = idDecode(id);
		await getPermissionList();
		await getRoleInfo({ roleId });
	}

	confirm = () => {
		const {
			query: { id },
			goToPath,
		} = this.props;

		goToPath('roleModify', { action: 'modify', id });
		// router.push(`${MENU_PREFIX.ROLE}/modify?action=modify&id=${id}`);
	};

	cancel = () => {
		const { goToPath } = this.props;
		goToPath('roleList');
		// router.push(`${MENU_PREFIX.ROLE}/roleList`);
	};

	render() {
		const {
			role: {
				roleInfo: { name, isDefault, permissionList },
			},
			loading,
		} = this.props;

		return (
			<Card>
				<Spin spinning={loading.effects['role/getRoleInfo']}>
					<div className={styles.wrapper}>
						<Form {...FORM_ITEM_LAYOUT_BUSINESS}>
							<Form.Item
								label={formatMessage({ id: 'roleManagement.role.roleName' })}
							>
								<span>{name}</span>
							</Form.Item>
							<Form.Item
								label={formatMessage({ id: 'roleManagement.role.roleRoot' })}
							>
								<div>
									{permissionList.map((item, key) => (
										<div key={key} style={{ marginBottom: '30px' }}>
											<Checkbox
												indeterminate={item.indeterminate}
												defaultChecked={item.checkAll}
												checked={item.checkAll}
												disabled
											>
												{item.checkedList.label}
											</Checkbox>
											<div>
												{item.checkedList.permissionList && (
													<CheckboxGroup
														disabled
														options={item.checkedList.permissionList}
														value={item.valueList}
													/>
												)}
											</div>
										</div>
									))}
								</div>
							</Form.Item>
							<Form.Item label=" " colon={false}>
								{isDefault ? (
									<Button onClick={this.cancel}>
										{formatMessage({ id: 'btn.back' })}
									</Button>
								) : (
									<div>
										<Button
											className={styles.submit}
											type="primary"
											onClick={this.confirm}
										>
											{formatMessage({ id: 'btn.alter' })}
										</Button>
										<Button onClick={this.cancel}>
											{formatMessage({ id: 'btn.cancel' })}
										</Button>
									</div>
								)}
							</Form.Item>
						</Form>
					</div>
				</Spin>
			</Card>
		);
	}
}

export default RoleView;
