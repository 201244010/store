import React from 'react';
import { Checkbox, Button, Form, Spin, Card } from 'antd';
import { connect } from 'dva';
import { idDecode } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
import router from 'umi/router';
import { MENU_PREFIX } from '@/constants';

import styles from './Role.less';

const CheckboxGroup = Checkbox.Group;

@connect(
	state => ({
		role: state.role,
		loading: state.loading,
		query: state.routing.location.query,
	}),
	dispatch => ({
		getRoleInfo: payload => dispatch({ type: 'role/getRoleInfo', payload }),
	})
)
@Form.create()
class RoleView extends React.Component {
	componentDidMount() {
		const { getRoleInfo, query: {id}} = this.props;
		const roleId = idDecode(id);
		getRoleInfo({ roleId });
	}

	confirm = () => {
		const {query: {id}} = this.props;
		router.push(`${MENU_PREFIX.ROLE}/modify?action=modify&id=${id}`);
	};

	cancel = () => {
		router.push(`${MENU_PREFIX.ROLE}/roleList`);
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

							{
								isDefault ?
									'' :
									<Form.Item label=" " colon={false}>
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
									</Form.Item>
							}

						</Form>
					</div>
				</Spin>
			</Card>
		);
	}
}

export default RoleView;
