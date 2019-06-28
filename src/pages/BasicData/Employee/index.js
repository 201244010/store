import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import SearchBar from './SearchBar';

@connect(
	state => ({
		employee: state.employee,
	}),
	dispatch => ({
		setSearchValue: payload => dispatch({ type: 'employee/setSearchValue', payload }),
		clearSearchValue: () => dispatch({ type: 'employee/clearSearchValue' }),
		getEmployeeList: () => dispatch({ type: 'employee/getEmployeeList' }),
	})
)
class EmployeeList extends Component {
	componentDidMount() {
		// const { getEmployeeList } = this.props;
		// getEmployeeList();
	}

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
	}

	render() {
		const { employee = {}, setSearchValue, clearSearchValue, getEmployeeList } = this.props;

		// TODO 等待接口联调渲染页面
		console.log(employee);

		return (
			<Card bordered={false}>
				<SearchBar
					{...{
						setSearchValue,
						clearSearchValue,
						getEmployeeList,
					}}
				/>
			</Card>
		);
	}
}

export default EmployeeList;
