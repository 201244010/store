import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import SearchBar from './SearchBar';
import SearchResult from './SerachResult';

@connect(
	state => ({
		loading: state.loading,
		employee: state.employee,
	}),
	dispatch => ({
		getCompanyIdFromStorage: () => dispatch({ type: 'global/getCompanyIdFromStorage' }),
		getShopListFromStorage: () => dispatch({ type: 'global/getShopListFromStorage' }),
		getCompanyListFromStorage: () => dispatch({ type: 'global/getCompanyListFromStorage' }),
		setSearchValue: payload => dispatch({ type: 'employee/setSearchValue', payload }),
		clearSearchValue: () => dispatch({ type: 'employee/clearSearchValue' }),
		getEmployeeList: ({ current = 1, pageSize = 10 }) =>
			dispatch({ type: 'employee/getEmployeeList', payload: { current, pageSize } }),
		deleteEmployee: ({ employeeIdList }) =>
			dispatch({ type: 'employee/deleteEmployee', payload: { employeeIdList } }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		getAdmin: () =>
			dispatch({ type: 'employee/getAdmin' }),
	})
)
class EmployeeList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orgnizationTree: [],
			currentCompanyId: null,
		};
	}

	componentDidMount() {
		this.createOrgnizationTree();
		const { getEmployeeList, getAdmin} = this.props;
		getEmployeeList({
			current: 1,
			pageSize: 10,
		});
		getAdmin();
	}

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
	}

	createOrgnizationTree = async () => {
		const {
			getCompanyIdFromStorage,
			getShopListFromStorage,
			getCompanyListFromStorage,
		} = this.props;
		const currentCompanyId = await getCompanyIdFromStorage();
		const companyList = await getCompanyListFromStorage();
		const shopList = await getShopListFromStorage();
		const companyInfo =
			companyList.find(company => company.companyId === currentCompanyId) || {};

		const orgnizationTree = [
			{
				title: companyInfo.companyName,
				value: companyInfo.companyId,
				key: companyInfo.companyId,
				children: shopList.map(shop => ({
					title: shop.shop_name,
					value: `${companyInfo.companyId}-${shop.shop_id}`,
					key: `${companyInfo.companyId}-${shop.shop_id}`,
				})),
			},
		];
		this.setState({
			orgnizationTree,
			currentCompanyId,
		});
	};

	render() {
		const {
			loading,
			employee: { searchValue = {}, employeeList = [], pagination, userId } = {},
			setSearchValue,
			clearSearchValue,
			getEmployeeList,
			deleteEmployee,
			goToPath,
		} = this.props;

		const { orgnizationTree, currentCompanyId } = this.state;
		return (
			<Card bordered={false}>
				<SearchBar
					{...{
						currentCompanyId,
						orgnizationTree,
						searchValue,
						setSearchValue,
						clearSearchValue,
						getEmployeeList,
						goToPath,
					}}
				/>
				<SearchResult
					{...{
						loading,
						data: employeeList,
						pagination,
						deleteEmployee,
						goToPath,
						getEmployeeList,
						userId
					}}
				/>
			</Card>
		);
	}
}

export default EmployeeList;
