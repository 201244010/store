import React, { Component } from 'react';
import { Row, Col, TreeSelect, Select, Button } from 'antd';
import { formatMessage } from 'umi/locale';

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
		const { orgnizationTree = [], roleSelectList = [] } = this.props;

		return (
			<>
				{orgnizationRoleList.map((item, index) => (
					<Row gutter={16} key={index}>
						<Col span={12}>
							<TreeSelect
								treeDefaultExpandAll
								value={item.orgnization}
								treeData={orgnizationTree}
								onChange={value => this.handleTreeChange(item, index, value)}
							/>
						</Col>
						<Col span={orgnizationRoleList.length > 1 ? 10 : 12}>
							<Select
								mode="multiple"
								value={item.role}
								onChange={value => this.handleSelectChange(item, index, value)}
							>
								{roleSelectList.map((role, i) => (
									<Select.Option key={i} value={role.id}>
										{role.name}
									</Select.Option>
								))}
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
