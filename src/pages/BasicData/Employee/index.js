import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import { format } from '@konata9/milk-shake';
import SearchBar from './SearchBar';
import SearchResult from './SerachResult';
import { ERROR_OK } from '@/constants/errorCode';

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
		setGetInfoValue: payload => dispatch({ type: 'employee/setGetInfoValue', payload }),
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
		this.userId = null;
	}

	componentDidMount() {
		const { getEmployeeList} = this.props;
		getEmployeeList({
			current: 1,
			pageSize: 10,
		});
		this.createOrgnizationTree();
		this.getAdminUserId();
	}

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
	}

	getAdminUserId = async () => {
		const { getAdmin } = this.props;
		const response = await getAdmin();
		if (response && response.code === ERROR_OK) {
			const { data = {} } = response;
			const { userId } = format('toCamel')(data);
			this.userId = userId;
		}
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
					title: shop.shopName,
					value: `${companyInfo.companyId}-${shop.shopId}`,
					key: `${companyInfo.companyId}-${shop.shopId}`,
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
			employee: { searchValue = {}, employeeList = [], pagination } = {},
			setSearchValue,
			setGetInfoValue,
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
						setGetInfoValue,
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
						userId: this.userId
					}}
				/>
			</Card>
		);
	}
}

export default EmployeeList;
