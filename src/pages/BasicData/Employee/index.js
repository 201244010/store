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
		getEmployeeList: ({ current, pageSize }) =>
			dispatch({ type: 'employee/getEmployeeList', payload: { current, pageSize } }),
		deleteEmployee: ({ employeeIdList }) =>
			dispatch({ type: 'employee/deleteEmployee', payload: { employeeIdList } }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class EmployeeList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orgnizationTree: [],
		};
	}

	componentDidMount() {
		this.createOrgnizationTree();
		const { getEmployeeList } = this.props;
		getEmployeeList({
			current: 1,
			pageSize: 10,
		});
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
			companyList.find(company => company.company_id === currentCompanyId) || {};

		const orgnizationTree = [
			{
				title: companyInfo.company_name,
				value: companyInfo.company_id,
				key: companyInfo.company_id,
				children: shopList.map(shop => ({
					title: shop.shop_name,
					value: `${companyInfo.company_id}-${shop.shop_id}`,
					key: `${companyInfo.company_id}-${shop.shop_id}`,
				})),
			},
		];
		this.setState({
			orgnizationTree,
		});
	};

	render() {
		const {
			loading,
			employee: { searchValue = {}, employeeList = [], pagination } = {},
			setSearchValue,
			clearSearchValue,
			getEmployeeList,
			deleteEmployee,
			goToPath,
		} = this.props;

		const { orgnizationTree } = this.state;
		return (
			<Card bordered={false}>
				<SearchBar
					{...{
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
					}}
				/>
			</Card>
		);
	}
}

export default EmployeeList;
