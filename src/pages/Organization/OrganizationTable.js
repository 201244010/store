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
			render: (item) => item || '--'
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
		},
		{
			title: formatMessage({ id: 'organization.org.action'}),
			key: 'action',
			render: (item) => {
				const { handleDeprecate, handleModify, handleViewInfo, handleEnable } = this.props;
				return (
					<span>
						<a href="javascript:;" onClick={()=>handleViewInfo(item)}>{formatMessage({ id: 'organization.action.check'})}</a>
						<Divider type="vertical" />
						<a href="javascript:;" onClick={() => handleModify(item)}>{formatMessage({ id: 'organization.action.modify'})}</a>
						<Divider type="vertical" />
						{/* <a href="javascript:;" className={`${styles['deprecate-btn']} ${item.orgStatus ? styles.disabled: ''}`} onClick={() => handleDeprecate(item)}>停用</a> */}
						<a href="javascript:;" onClick={() => item.orgStatus ? handleEnable(item) : handleDeprecate(item)}>
							{item.orgStatus ? formatMessage({ id: 'organization.action.enable'}) :formatMessage({ id: 'organization.action.disabled'})}
						</a>
					</span>
				);

			},
		}
	];

	rowSelection = {
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
		}
	};

	render() {
		const { dataSource, expandedRowKeys, loading } = this.props;
		return(
			<Table
				className={styles['org-table']}
				rowKey={record => record.orgId}
				columns={this.columns}
				dataSource={dataSource}
				rowSelection={this.rowSelection}
				pagination={false}
				defaultExpandedRowKeys={expandedRowKeys}
				loading={loading}
			/>
		);
	}
}

export default OrganizationTable;