import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Form, Button } from 'antd';
import moment from 'moment';
import { getLocationParam } from '@/utils/utils';
import { FORM_ITEM_DETAIL } from '@/constants/form';

const GENDER_MAP = {
	1: formatMessage({ id: 'employee.gender.male' }),
	2: formatMessage({ id: 'employee.gender.female' }),
};

@connect(
	state => ({
		loading: state.loading,
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

	formatMappingList = mappingList => {
		if (mappingList.length === 0) {
			return mappingList;
		}

		const roleMap = new Map();
		mappingList.forEach(list => {
			const {
				companyId = null,
				shopId = null,
				companyName = '',
				shopName = '',
				roleName = '',
			} = list;

			if (roleMap.has(`${companyId}-${shopId}`)) {
				const { roleName: roleNames } = roleMap.get(`${companyId}-${shopId}`);
				roleMap.set(`${companyId}-${shopId}`, {
					companyName,
					shopName,
					roleName: [roleNames, roleName].join('、'),
				});
			} else {
				roleMap.set(`${companyId}-${shopId}`, { companyName, shopName, roleName });
			}
		});
		return [...roleMap.values()];
	};

	goToPath = target => {
		const { goToPath } = this.props;
		if (target === 'edit') {
			goToPath('employeeUpdate', {
				employeeId: this.employeeId,
				from: 'detail',
				action: 'edit',
			});
		} else if (target === 'back') {
			goToPath('employeeList');
		}
	};

	render() {
		const {
			loading,
			employee: {
				employeeInfo: {
					name = '--',
					number = '--',
					username = '--',
					gender = '--',
					ssoUsername = '--',
					mappingList = [],
					createTime = '--',
					modifiedTime = '--',
				} = {},
			} = {},
		} = this.props;

		const mappedList = this.formatMappingList(mappingList);
		// console.log(mappedList);

		return (
			<Card bordered={false} loading={loading.effects['employee/getEmployeeInfo']}>
				<h3>{formatMessage({ id: 'employee.info' })}</h3>
				<Form {...FORM_ITEM_DETAIL}>
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

					{mappedList.length === 0 && (
						<Form.Item label={formatMessage({ id: 'employee.orgnization' })}>
							<span>--</span>
						</Form.Item>
					)}

					{mappedList.map((item, index) => (
						<Form.Item
							key={index}
							label={
								index === 0 ? formatMessage({ id: 'employee.orgnization' }) : ' '
							}
							colon={index === 0}
						>
							<span>{item.companyName}</span>
							<span>{item.shopName ? `(${item.shopName})` : null}</span>
							<span> - </span>
							<span>{item.roleName}</span>
						</Form.Item>
					))}

					<Form.Item label={formatMessage({ id: 'employee.info.create.time' })}>
						<span>{moment.unix(createTime).format('YYYY-MM-DD HH:mm:ss') || '--'}</span>
					</Form.Item>

					<Form.Item label={formatMessage({ id: 'employee.info.update.time' })}>
						<span>
							{moment.unix(modifiedTime).format('YYYY-MM-DD HH:mm:ss') || '--'}
						</span>
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
