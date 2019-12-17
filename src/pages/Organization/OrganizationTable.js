import  React  from 'react';
// import { formatMessage } from 'umi/locale';
import { Table, Divider } from 'antd';


class OrganizationTable extends React.Component {

	columns = [
		{
			title: '组织',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: '组织属性',
			dataIndex: 'attribute',
			key: 'attribute',
		},
		{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
		},
		{
			title: '地址',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: '员工',
			dataIndex: 'employee',
			key: 'employee',
		},
		{
			title: '联系人',
			dataIndex: 'contactPerson',
			key: 'contactPerson',
		},
		{
			title: '操作',
			key: 'action',
			render: () => (
				<span>
					<a href="javascript:;">查看</a>
					<Divider type="vertical" />
					<a href="javascript:;">修改</a>
					<Divider type="vertical" />
					<a href="javascript:;">停用</a>
				</span>
			),
		}
	];

	dataSource = [{
		name: 'tea',
		attribute: '门店',
		status: '营业',
		address: '深圳南山区',
		employee: '2',
		contactPerson: '张三',
		children: [{
			name: 'hea tea',
			attribute: '门店',
			status: '营业',
			address: '深圳南山区',
			employee: '2',
			contactPerson: '李四',
		}]
	}];

	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		onSelect: (record, selected, selectedRows) => {
			console.log(record, selected, selectedRows);
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
			console.log(selected, selectedRows, changeRows);
		},
	};

	expandedRowRender = (record) => {
		console.log('-------record------',record);
		return (<Table columns={this.columns} dataSource={record} />);
	}

	render() {
		return(
			<div>
				<Table
					columns={this.columns}
					dataSource={this.dataSource}
					expandedRowRender={(record) => {this.expandedRowRender(record.children);}}
					rowSelection={this.rowSelection}
				/>
			</div>
		);
	}
}

export default OrganizationTable;