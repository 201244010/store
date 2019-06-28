import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import { getLocationParam } from '@/utils/utils';

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
	componentDidMount() {
		const employeeId = getLocationParam('employeeId');
		if (employeeId) {
			const { getEmployeeInfo } = this.props;
			getEmployeeInfo({ employeeId });
		}
	}

	render() {
		return <Card bordered={false} />;
	}
}

export default EmployeeInfo;
