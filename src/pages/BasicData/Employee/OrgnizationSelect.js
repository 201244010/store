import React, { Component } from 'react';
import { Row, Col, TreeSelect, Select, Button } from 'antd';
import { formatMessage } from 'umi/locale';

const treeData = [
	{
		title: 'Node1',
		value: '0-0',
		key: '0-0',
		children: [
			{
				title: 'Child Node1',
				value: '0-0-1',
				key: '0-0-1',
			},
			{
				title: 'Child Node2',
				value: '0-0-2',
				key: '0-0-2',
			},
		],
	},
	{
		title: 'Node2',
		value: '0-1',
		key: '0-1',
	},
];

class OrgnizationSelect extends Component {
	constructor(props) {
		super(props);
		const value = props.value || [];
		this.state = {
			orgnizationRoleList: value.length > 0 ? value : [{ orgnization: null, role: [] }],
		};
	}

	handleOnchange = () => {
		const { orgnizationRoleList } = this.state;
		const { onChange } = this.props;
		if (onChange) {
			onChange({ ...orgnizationRoleList });
		}
	};

	handleTreeChange = (item, index, value) => {
		const { orgnizationRoleList } = this.state;
		item.orgnization = value;
		orgnizationRoleList.splice(index, 1, item);
		this.setState({
			orgnizationRoleList,
		});
		this.handleOnchange();
	};

	handleSelectChange = (item, index, value) => {
		const { orgnizationRoleList } = this.state;
		item.role = value;
		orgnizationRoleList.splice(index, 1, item);
		this.setState({
			orgnizationRoleList,
		});
		this.handleOnchange();
	};

	addItem = () => {
		const { orgnizationRoleList } = this.state;
		this.setState({
			orgnizationRoleList: [...orgnizationRoleList, { orgnization: null, role: [] }],
		});
	};

	removeItem = index => {
		const { orgnizationRoleList } = this.state;
		orgnizationRoleList.splice(index, 1);
		this.setState({
			orgnizationRoleList,
		});
		this.handleOnchange();
	};

	render() {
		const { orgnizationRoleList } = this.state;

		return (
			<>
				{orgnizationRoleList.map((item, index) => (
					<Row gutter={16} key={index}>
						<Col span={12}>
							<TreeSelect
								value={item.orgnization}
								treeData={treeData}
								onChange={value => this.handleTreeChange(item, index, value)}
							/>
						</Col>
						<Col span={orgnizationRoleList.length > 1 ? 10 : 12}>
							<Select
								mode="multiple"
								value={item.role}
								onChange={value => this.handleSelectChange(item, index, value)}
							>
								<Select.Option value="jack">Jack</Select.Option>
								<Select.Option value="lucy">Lucy</Select.Option>
							</Select>
						</Col>
						{orgnizationRoleList.length > 1 && (
							<Col span={2}>
								<Button icon="delete" onClick={() => this.removeItem(index)} />
							</Col>
						)}
					</Row>
				))}
				<a href="javascript:void(0);" onClick={this.addItem}>
					{formatMessage({ id: 'employee.orgnization.add' })}
				</a>
			</>
		);
	}
}

export default OrgnizationSelect;
