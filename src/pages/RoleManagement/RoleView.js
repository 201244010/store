import React from 'react';
import { Checkbox, Button, Form, Spin, Card } from 'antd';
import { connect } from 'dva';
import { getLocationParam, idDecode, idEncode } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
import router from 'umi/router';
import { MENU_PREFIX } from '@/constants';

import styles from './Role.less';

const CheckboxGroup = Checkbox.Group;

@connect(
	state => ({
		role: state.role,
		loading: state.loading.models.role,
	}),
	dispatch => ({
		getRoleInfo: payload => dispatch({ type: 'role/getRoleInfo', payload }),
	})
)
@Form.create()
class RoleView extends React.Component {
	componentDidMount() {
		const roleId = idDecode(getLocationParam('id'));
		const { getRoleInfo } = this.props;
		getRoleInfo({ roleId });
	}

	confirm = () => {
		const roleId = idDecode(getLocationParam('id'));
		const encodeID = idEncode(roleId);
		router.push(`${MENU_PREFIX.ROLE}/modify?action=modify&id=${encodeID}`);
	};

	cancel = () => {
		router.push(`${MENU_PREFIX.ROLE}/roleList`);
	};

	render() {
		const {
			role: {
				roleInfo: { name, permission_list: checkIdList },
			},
			loading,
		} = this.props;
		return (
			<Card>
				<Spin spinning={loading}>
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
									{checkIdList.map((item, key) => (
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
												{item.checkedList.permission_list && (
													<CheckboxGroup
														disabled
														options={item.checkedList.permission_list}
														value={item.valueList}
													/>
												)}
											</div>
										</div>
									))}
								</div>
							</Form.Item>
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
						</Form>
					</div>
				</Spin>
			</Card>
		);
	}
}

export default RoleView;
