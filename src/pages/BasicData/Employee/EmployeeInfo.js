import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Form, Button } from 'antd';
import { getLocationParam } from '@/utils/utils';

const GENDER_MAP = {
	1: formatMessage({ id: 'employee.gender.male' }),
	2: formatMessage({ id: 'employee.gender.female' }),
};

@connect(
	state => ({
		employee: state.employee,
	}),
	dispatch => ({
		getEmployeeInfo: ({ employeeId }) =>
			dispatch({ type: 'employee/getEmployeeInfo', payload: { employeeId } }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class EmployeeInfo extends Component {
	constructor(props) {
		super(props);
		this.employeeId = getLocationParam('employeeId');
	}

	componentDidMount() {
		if (this.employeeId) {
			const { getEmployeeInfo } = this.props;
			getEmployeeInfo({ employeeId: this.employeeId });
		}
	}

	goToPath = target => {
		const { goToPath } = this.props;
		if (target === 'edit') {
			goToPath('employeeUpdate', { employeeId: this.employeeId });
		} else if (target === 'back') {
			goToPath('employeeList');
		}
	};

	render() {
		const {
			employee: {
				employeeInfo: {
					name = '--',
					number = '--',
					username = '--',
					gender = '--',
					ssoUsername = '--',
					organizationRoleMappingList = [],
					createTime = '--',
					updateTime = '--',
				} = {},
			} = {},
		} = this.props;
		return (
			<Card bordered={false}>
				<h3>{formatMessage({ id: 'employee.info' })}</h3>
				<Form>
					<Form.Item label={formatMessage({ id: 'employee.number' })}>
						<span>{number || '--'}</span>
					</Form.Item>

					<Form.Item label={formatMessage({ id: 'employee.name' })}>
						<span>{name || '--'}</span>
					</Form.Item>

					<Form.Item label={formatMessage({ id: 'employee.gender' })}>
						<span>{GENDER_MAP[gender] || '--'}</span>
					</Form.Item>

					<Form.Item label={formatMessage({ id: 'employee.phone.or.email' })}>
						<span>{username || '--'}</span>
					</Form.Item>

					<Form.Item label={formatMessage({ id: 'employee.sso.account' })}>
						<span>{ssoUsername || '--'}</span>
					</Form.Item>

					{organizationRoleMappingList.map((info, index) => (
						<Form.Item
							label={index === 0 ? formatMessage({ id: 'employee.number' }) : ' '}
							colon={index === 0}
						>
							<span>{info || '--'}</span>
						</Form.Item>
					))}

					<Form.Item label={formatMessage({ id: 'employee.info.create.time' })}>
						<span>{createTime || '--'}</span>
					</Form.Item>

					<Form.Item label={formatMessage({ id: 'employee.info.update.time' })}>
						<span>{updateTime || '--'}</span>
					</Form.Item>

					<Form.Item label=" " colon={false}>
						<Button type="primary" onClick={() => this.goToPath('edit')}>
							{formatMessage({ id: 'btn.alter' })}
						</Button>
						<Button
							onClick={() => this.goToPath('back')}
							style={{ marginLeft: '20px' }}
						>
							{formatMessage({ id: 'btn.back' })}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}
}

export default EmployeeInfo;
