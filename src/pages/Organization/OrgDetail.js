import  React  from 'react';
import { Button, Card, message } from 'antd';
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
import AuthKey from '@/pages/AuthKey';


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
		getEmployeeList: ({ current = 1, pageSize = 10, shopIdList = [] }) =>
			dispatch({ type: 'employee/getEmployeeList', payload: { current, pageSize, shopIdList } }),
		deleteEmployee: ({ employeeIdList }) =>
			dispatch({ type: 'employee/deleteEmployee', payload: { employeeIdList } }),
		getAdmin: () =>
			dispatch({ type: 'employee/getAdmin' }),
		enable: async (orgId) => dispatch({ type: 'organization/enable', payload: { orgId } }),
		getOrgTreeByOrgId: orgId => dispatch({ type: 'companyInfo/getOrgTreeByOrgId', payload: { orgId } }),
		initLayerTree: () => dispatch({ type: 'organization/initLayerTree' }),
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
		const { getRegionList } = this.props;
		if (!Storage.get('__regionList__', 'local')) {
			getRegionList();
		}
		const { getEmployeeList} = this.props;
		getEmployeeList({
			current: 1,
			pageSize: 10,
			shopIdList: [orgId]
		});
		this.getAdminUserId();
		this.setState({
			orgId,
		}, () => {
			this.init();
		});
	}

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
	}

	handleDeprecate = async () => {
		const { orgId } = this.state;
		const { getOrgTreeByOrgId } = this.props;
		const { orgLayer } = await getOrgTreeByOrgId(orgId);
		if(orgLayer && orgLayer.length > 0 && orgLayer[0].orgId === orgId){
			const obj = orgLayer[0];
			this.deprecateModal.handleDeprecate(obj);
		}
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
				return `${hourStr}${formatMessage({id: 'activeDetection.nextDay'})}`;
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

	init = async() => {
		const { orgId } = this.state;
		const { initLayerTree, getOrganizationInfo } = this.props;
		await initLayerTree();
		await getOrganizationInfo(orgId);
	}

	addressHandler(province, city, area, address){
		let detailAddress = '';
		const { companyInfo: { regionList }} = this.props;
		if(province && city && area){
			for(let i=0; i<regionList.length; i++){
				if(Number(regionList[i].value) === province){
					detailAddress += `${regionList[i].name} `;
					for(let j=0; j<regionList[i].children.length; j++){
						if(Number(regionList[i].children[j].value) === city){
							detailAddress += `${regionList[i].children[j].name} `;
							for(let k=0; k<regionList[i].children[j].children.length; k++){
								if(Number(regionList[i].children[j].children[k].value) === area){
									detailAddress += `${regionList[i].children[j].children[k].name} `;
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
					sunmiShopNo = undefined,
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
					// contactEmail,
					createdTime,
					typeName,
					modifiedTime,
					orgStatus,
					level,
					businessArea,
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
				<Card title={formatMessage({id: 'orgDetail.org.detail'})} className={styles['org-detail']} loading={loading.effects['companyInfo/getOrganizationInfo']}>
					<div className={styles['detail-body']}>
						<div className={styles.row}>
							<div className={`${styles.col} ${styles.orgId}`}>
								<div className={styles.label}>{formatMessage({id: 'orgDetail.org.id'})}</div>
								<div>{sunmiShopNo || '--'}</div>
							</div>
							<div className={`${styles.col} ${styles.orgName}`}>
								<div className={styles.label}>{formatMessage({id: 'orgDetail.org.name'})}</div>
								<div>{orgName || '--'}</div>
							</div>
							<div className={`${styles.col} ${styles.orgPname}`}>
								<div className={styles.label}>{formatMessage({id: 'orgDetail.org.parent'})}</div>
								<div>{orgPname || '--'}</div>
							</div>
						</div>
						<div className={styles.row}>
							<div className={`${styles.col} ${styles.orgTag}`}>
								<div className={styles.label}>{formatMessage({id: 'orgDetail.org.tag'})}</div>
								<div>{(orgTag === 0 && formatMessage({id: 'orgDetail.shop'}) ||
								orgTag === 1 && formatMessage({id: 'orgDetail.department'})) || '--'}
								</div>
							</div>
							<div className={`${styles.col} ${styles.orgStatus}`}>
								<div className={styles.label}>{formatMessage({id: 'orgDetail.org.status'})}</div>
								<div>{(orgStatus === 0 && formatMessage({id: 'orgDetail.org.status.using'}) ||
								orgStatus === 1 && formatMessage({id: 'orgDetail.org.status.stop.use'})) || '--'}
								</div>
							</div>
							<div className={`${styles.col} ${styles.contactPerson}`}>
								<div className={styles.label}>{formatMessage({id: 'orgDetail.contactPerson'})}</div>
								<div>{contactPerson || '--'}</div>
							</div>
						</div>
						<div className={styles.row}>
							<div className={`${styles.col} ${styles.contactTel}`}>
								<div className={styles.label}>{formatMessage({id: 'orgDetail.contactTel'})}</div>
								<div>{contactTel || '--'}</div>
							</div>
							{/* <div className={`${styles.col} ${styles.contactEmail}`}>{formatMessage({id: 'orgDetail.contactEmail'})}{contactEmail || '--'}</div> */}
							<div className={`${styles.col} ${styles.createdTime}`}>
								<div className={styles.label}>{formatMessage({id: 'orgDetail.createdTime'})}</div>
								<div>{createdTime ? moment.unix(createdTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</div>
							</div>
							<div className={`${styles.col} ${styles.modifiedTime}`}>
								<div className={styles.label}>{formatMessage({id: 'orgDetail.modifiedTime'})}</div>
								<div>{modifiedTime ? moment.unix(modifiedTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</div>
							</div>
						</div>
						{/* <div className={styles.row}>
							<div className={`${styles.col} ${styles.modifiedTime}`}>{formatMessage({id: 'orgDetail.modifiedTime'})}{modifiedTime ? moment.unix(modifiedTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</div>
							<div className={styles.col} />
							<div className={styles.col} />
						</div> */}
						{
							orgTag === 0 &&
							<div>
								<div className={styles.row}>
									<div className={`${styles.col} ${styles.typeName}`}>
										<div className={styles.label}>{formatMessage({id: 'orgDetail.typeName'})}</div>
										<div>{typeName ? typeName.replace(',','-') : '--'}</div>
									</div>
									<div className={`${styles.col} ${styles.businessStatus}`}>
										<div className={styles.label}>{formatMessage({id: 'orgDetail.businessStatus'})}</div>
										<div>{(businessStatus === 0 && formatMessage({id: 'orgDetail.businessStatus.open'}) ||
								businessStatus === 1 && formatMessage({id: 'orgDetail.businessStatus.close'})) || '--'}
										</div>
									</div>
									<div className={`${styles.col} ${styles.businessHours}`}>
										<div className={styles.label}>{formatMessage({id: 'orgDetail.businessHours'})}</div>
										<div>{businessHours ? this.format(businessHours) : '--'}</div>
									</div>
								</div>
								<div className={styles.row}>
									<div className={`${styles.col} ${styles.businessArea}`}>
										<div className={styles.label}>{formatMessage({id: 'orgDetail.businessArea'})}</div>
										<div>{businessArea ? `${businessArea}㎡` : '--'}</div>
									</div>
									<div className={`${styles.col} ${styles.address}`}>
										<div className={styles.label}>{formatMessage({id: 'orgDetail.address'})}</div>
										<div>{this.addressHandler(province, city, area, address)}</div>
									</div>
									<div className={styles.col} />
								</div>
							</div>
						}

					</div>
					<div className={styles.footer}>
						<Button
							className={styles.btn}
							onClick={() => goToPath('editDetail',{
								action : 'edit',
								orgId: locationOrgId,
							})}
						>
							{formatMessage({id: 'orgDetail.modify'})}
						</Button>
						{/* <Button
							onClick={() => orgStatus ? this.handleEnable() : this.handleDeprecate()}
							className={styles.btn}
						>
							{orgStatus ? formatMessage({ id: 'organization.action.enable'}) :formatMessage({ id: 'organization.action.disabled'})}
						</Button> */}
						<Button
							className={(level >= 5 || orgStatus === 1 ) ? styles.noShow: styles.btn}
							loading={!!(loading.effects['companyInfo/createOrganization'] ||
								loading.effects['companyInfo/updateOrganization'])}
							onClick={() => goToPath('newSubOrganization',{
								action: 'create',
								orgPid: locationOrgId,
							})}
						>
							{formatMessage({id: 'orgDetail.new.sub.org'})}
						</Button>
						{/* <div className={styles['auth-btn']}> */}
						<AuthKey type="link" shopId={locationOrgId} />
						{/* </div> */}
					</div>
				</Card>
				{orgStatus === 0 ?
					<Card title={formatMessage({id: 'orgDetail.employee.info'})} className={styles['employee-info']}>
						<Button
							className={styles['add-btn']}
							type="primary"
							icon="plus"
							onClick={() =>
								goToPath('employeeCreate', { action: 'create', from: 'list', orgId: locationOrgId })
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
								shopIdList: [locationOrgId],
								userId: this.userId
							}}
						/>
					</Card>: ''
				}
				<DeprecateModal onRef={modal => { this.deprecateModal = modal; }} init={this.init} />
			</div>
		);
	}
}

export default OrgDetail;