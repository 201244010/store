import  React  from 'react';
import { formatMessage } from 'umi/locale';
import { Table, Divider, Badge } from 'antd';
import styles from './Organization.less';

class OrganizationTable extends React.Component {

	columns = [
		{
			title: formatMessage({ id: 'organization.org.name'}),
			dataIndex: 'orgName',
			key: 'orgName',
			className: styles['org-name-column'],
			render: (item) => <div className={styles['org-name']}>{item || '--'}</div>
		},
		{
			title: formatMessage({ id: 'organization.org.tag'}),
			dataIndex: 'orgTag',
			key: 'orgTag',
			render: (item) => item ? formatMessage({ id: 'organization.department'}) : formatMessage({ id: 'organization.store'})
		},
		{
			title: formatMessage({ id: 'organization.org.status'}),
			dataIndex: 'orgStatus',
			key: 'orgStatus',
			render: (item) => (
				<Badge
					status={item ? 'default' : 'success'}
					text={item ? formatMessage({ id: 'organization.disabled'}) : formatMessage({ id: 'organization.enable'})}
				/>
			)
		},
		{
			title: formatMessage({ id: 'organization.org.address'}),
			dataIndex: 'address',
			key: 'address',
			render: (text, record) => {
				const { province, city, area, address } = record;
				return <span>{this.addressHandler(province, city, area, address)}</span>;
			},
		},
		// {
		// 	title: '员工',
		// 	dataIndex: 'province',
		// 	key: 'province',
		// },
		{
			title: formatMessage({ id: 'organization.org.contact.person'}),
			dataIndex: 'contactPerson',
			key: 'contactPerson',
			render: (item) => item || '--'
		},
		{
			title: formatMessage({ id: 'organization.org.action'}),
			key: 'action',
			render: (item) => {
				const { /* handleDeprecate, */ handleModify, handleViewInfo, /* handleEnable */ } = this.props;
				return (
					<span>
						<a href="javascript:;" onClick={()=>handleViewInfo(item)}>{formatMessage({ id: 'organization.action.check'})}</a>
						<Divider type="vertical" />
						<a href="javascript:;" onClick={() => handleModify(item)}>{formatMessage({ id: 'organization.action.modify'})}</a>
						{/* <Divider type="vertical" />
						<a href="javascript:;" onClick={() => item.orgStatus ? handleEnable(item) : handleDeprecate(item)}>
							{item.orgStatus ? formatMessage({ id: 'organization.action.enable'}) :formatMessage({ id: 'organization.action.disabled'})}
						</a> */}
					</span>
				);

			},
		}
	];


	addressHandler(province, city, area, address){
		let detailAddress = '';
		const { regionList } = this.props;
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
		const { dataSource, expandedRowKeys, loading, selectedIdList } = this.props;
		const rowSelection = {
			selectedRowKeys: selectedIdList,
			onChange: (selectedRowKeys) => {
				const { setSelectedKeys } = this.props;
				setSelectedKeys(selectedRowKeys);
			},
			onSelect: (record, selected) => {
				const { setSelectedList } = this.props;
				setSelectedList(record, selected);
			},
			onSelectAll: (selected) => {
				const { onSelectAll } = this.props;
				onSelectAll(selected);
			},
			getCheckboxProps: (record) => {
				const { orgPid } = record;
				if(selectedIdList.includes(orgPid)) {
					return {
						disabled: true,
					};
				}
				return {};
			}
		};
		return(
			<Table
				className={styles['org-table']}
				rowKey={record => record.orgId}
				columns={this.columns}
				dataSource={dataSource}
				rowSelection={rowSelection}
				pagination={false}
				defaultExpandedRowKeys={expandedRowKeys}
				loading={loading}
			/>
		);
	}
}

export default OrganizationTable;