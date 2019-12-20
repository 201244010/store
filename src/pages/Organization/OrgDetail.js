import  React  from 'react';
import { Button, Card } from 'antd';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { format } from '@konata9/milk-shake';
import { formatMessage } from 'umi/locale';
import styles from './OrgDetail.less';
import { getLocationParam } from '@/utils/utils';
import { ERROR_OK } from '@/constants/errorCode';
import DeprecateModal from './DeprecateModal';
import SearchResult from '../BasicData/Employee/SerachResult';


@connect(
	state => ({
		loading: state.loading,
		companyInfo: state.companyInfo,
		employee: state.employee,
	}),
	dispatch => ({
		getOrganizationInfo: orgId => dispatch({ type: 'companyInfo/getOrganizationInfo', orgId }),
		getRegionList: () => dispatch({ type: 'companyInfo/getRegionList' }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		getCompanyIdFromStorage: () => dispatch({ type: 'global/getCompanyIdFromStorage' }),
		getShopListFromStorage: () => dispatch({ type: 'global/getShopListFromStorage' }),
		getCompanyListFromStorage: () => dispatch({ type: 'global/getCompanyListFromStorage' }),
		setSearchValue: payload => dispatch({ type: 'employee/setSearchValue', payload }),
		clearSearchValue: () => dispatch({ type: 'employee/clearSearchValue' }),
		getEmployeeList: ({ current = 1, pageSize = 10 }) =>
			dispatch({ type: 'employee/getEmployeeList', payload: { current, pageSize } }),
		deleteEmployee: ({ employeeIdList }) =>
			dispatch({ type: 'employee/deleteEmployee', payload: { employeeIdList } }),
		getAdmin: () =>
			dispatch({ type: 'employee/getAdmin' }),
		enable: async (orgId) => dispatch({ type: 'organization/enable', payload: { orgId } }),
		getOrgTreeByOrgId: orgId => dispatch({ type: 'companyInfo/getOrgTreeByOrgId', payload: { orgId } }),
	})
)


class OrgDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			orgId: undefined,
		};
		this.userId = null;
	}

	componentDidMount(){
		const orgId = Number(getLocationParam('orgId'));
		const { getRegionList, getOrganizationInfo } = this.props;
		// console.log(getOrganizationInfo);
		getOrganizationInfo(orgId);
		if (!Storage.get('__regionList__', 'local')) {
			getRegionList();
		}
		const { getEmployeeList} = this.props;
		getEmployeeList({
			current: 1,
			pageSize: 10,
		});
		this.getAdminUserId();
		this.setState({
			orgId,
		});
	}

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
	}

	handleDeprecate = async () => {
		const { orgId } = this.state;
		const { getOrgTreeByOrgId } = this.props;
		const obj = await getOrgTreeByOrgId(orgId);
		this.deprecateModal.handleDeprecate(obj);
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

	compareTimeFormatHHmm =  (timeStr1, timeStr2) => {
		const timeStr1Arr = timeStr1.split(':');
		const timeStr2Arr = timeStr2.split(':');
		if(timeStr1Arr[0] > timeStr2Arr[0]){
			return 1;
		}
		if(timeStr1Arr[0] < timeStr2Arr[0]){
			return -1;
		}
		if(timeStr1Arr[0] === timeStr2Arr[0]){
			if(timeStr1Arr[1] > timeStr2Arr[1]){
				return 1;
			}
			if(timeStr1Arr[1] < timeStr2Arr[1]){
				return -1;
			}
			if(timeStr1Arr[1] === timeStr2Arr[1]){
				return 0;
			}
		}
		return '';
	}

	format = (hourStr) => {
		if(hourStr && hourStr.indexOf('~') !== -1 && hourStr.indexOf(':') !== -1){
			const hourArr = hourStr.split('~');
			const result = this.compareTimeFormatHHmm(hourArr[0], hourArr[1]);
			if(result === 0 || result === 1){
				return `${hourStr}（次日）`;
			}
		}
		return hourStr;
	}

	handleEnable = async () => {
		const { orgId } = this.state;
		const { enable } = this.props;
		const result = await enable(orgId);
		if(result) {
			this.init();
			message.success(formatMessage({ id: 'organization.enable.result.success'}));
		} else {
			message.error(formatMessage({ id: 'organization.enable.result.error'}));
		}
	}

	init(){
		const { orgId } = this.state;
		getOrganizationInfo(orgId);
	}

	addressHandler(province, city, area, address){
		let detailAddress = '';
		const { companyInfo: { regionList }} = this.props;
		if(province && city && area){
			for(let i=0; i<regionList.length; i++){
				if(regionList[i].value === province){
					detailAddress += regionList[i].name;
					for(let j=0; j<regionList[i].children.length; j++){
						if(regionList[i].children[j].value === city){
							detailAddress += regionList[i].children[j].name;
							for(let k=0; k<regionList[i].children[j].children; k++){
								if(regionList[i].children[j].children[k].value === area){
									detailAddress += regionList[i].children[j].children[k].name;
									break;
								}
							}
							break;
						}
					}
					break;
				}
			}
		}
		if(address){
			detailAddress += address;
		}
		if(detailAddress === ''){
			return '--';
		}
		return detailAddress;
	}

	

	render() {
		const { goToPath } = this.props;
		const {
			loading,
			companyInfo: {
				orgInfo: {
					orgName = undefined,
					orgId = undefined,
					orgPname = undefined,
					orgTag = undefined,
					businessStatus,
					businessHours,
					province = null,
					city = null,
					area = null,
					address = null,
					contactPerson,
					contactTel,
					contactEmail,
					createdTime,
					typeName,
					modifiedTime,
					orgStatus,
					level
				},
			}
		} = this.props;

		const {
			employee: { employeeList = [], pagination } = {},
			getEmployeeList,
			deleteEmployee,
		} = this.props;

		const { orgId: locationOrgId } = this.state;
		return(
			<div className={styles['detail-container']}>
				<Card title='组织详情' className={styles['org-detail']} loading={loading.effects['companyInfo/getOrganizationInfo']}>
					<div className={styles['detail-body']}>
						<div className={styles.row}>
							<div className={`${styles.col} ${styles.orgId}`}>组织编号：{orgId || '--'}</div>
							<div className={`${styles.col} ${styles.orgName}`}>组织名称：{orgName || '--'}</div>
							<div className={`${styles.col} ${styles.orgPname}`}>上级组织：{orgPname || '--'}</div>
						</div>
						<div className={styles.row}>
							<div className={`${styles.col} ${styles.orgTag}`}>组织属性：{(orgTag === 0 && '门店' || orgTag === 1 && '部门') || '--'}</div>
							<div className={`${styles.col} ${styles.orgStatus}`}>组织状态：{(orgStatus === 0 && '使用中' || orgStatus === 1 && '停用') || '--'}</div>
							<div className={`${styles.col} ${styles.contactPerson}`}>联系人：{contactPerson || '--'}</div>
						</div>
						<div className={styles.row}>
							<div className={`${styles.col} ${styles.contactTel}`}>联系电话：{contactTel || '--'}</div>
							<div className={`${styles.col} ${styles.contactEmail}`}>联系邮箱：{contactEmail || '--'}</div>
							<div className={`${styles.col} ${styles.createdTime}`}>创建时间：{createdTime ? moment.unix(createdTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</div>
						</div>
						<div className={styles.row}>
							<div className={`${styles.col} ${styles.modifiedTime}`}>更新时间：{modifiedTime ? moment.unix(modifiedTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</div>
							<div className={styles.col} />
							<div className={styles.col} />
						</div>
						<div className={styles.row}>
							<div className={`${styles.col} ${styles.typeName}`}>经营品类：{typeName || '--'}</div>
							<div className={`${styles.col} ${styles.businessStatus}`}>营业状态：{(businessStatus === 0 && '营业' || businessStatus === 1 && '停业') || '--'}</div>
							<div className={`${styles.col} ${styles.businessHours}`}>营业时间：{businessHours ? this.format(businessHours) : '--'}</div>
						</div>
						<div className={styles.row}>
							<div className={`${styles.col} ${styles.address}`}>地址：{this.addressHandler(province, city, area, address)}</div>
						</div>
					</div>
					<div className={styles.footer}>
						<Button 
							className={styles.btn} 
							onClick={() => goToPath('editDetail',{
								action : 'edit',
								orgId: locationOrgId,
							})}
						>
							修改
						</Button>
						<Button
							onClick={() => orgStatus ? this.handleEnable() : this.handleDeprecate()}
							className={styles.btn}
						>
							{orgStatus ? formatMessage({ id: 'organization.action.enable'}) :formatMessage({ id: 'organization.action.disabled'})}
						</Button>
						<Button
							className={level === 6 ? styles.noShow: styles.btn}
							onClick={() => goToPath('newSubOrganization',{
								action: 'create',
								orgPid: locationOrgId,
							})}
						>
							新增下级组织
						</Button>
					</div>
				</Card>
				<Card title='员工信息' className={styles['employee-info']}>
					<Button
						className={styles['add-btn']}
						type="primary"
						icon="plus"
						onClick={() =>
							goToPath('employeeCreate', { action: 'create', from: 'list' })
						}
					>
						{formatMessage({ id: 'employee.create' })}
					</Button>
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
				<DeprecateModal onRef={modal => { this.deprecateModal = modal; }} init={this.init} />
			</div>
		);
	}
}

export default OrgDetail;