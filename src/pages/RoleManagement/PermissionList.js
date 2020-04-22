import React from 'react';
import { Input, Button, Modal, Tree } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './Role.less';

const { TreeNode } = Tree;

export default class PermissionList extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			searchValue: null,
		};
	}

	filterList = data => {
		const { searchValue } = this.state;
		if (!searchValue) return data;
		return data.reduce((pList, firstMenu) => {
			const {
				checkedList: { label, permissionList },
			} = firstMenu;
			const list = permissionList.filter(item => item.label.indexOf(searchValue) > -1);
			list.length > 0 &&
				pList.push({
					checkedList: {
						label,
						permissionList: list,
					},
				});
			return pList;
		}, []);
	};

	render() {
		const { visible, closeModal, data } = this.props;
		const dataFormat = this.filterList(data);
		return (
			<Modal
				title={formatMessage({ id: 'roleManagement.role.allPermission' })}
				visible={visible}
				closable={false}
				footer={
					<Button type="primary" onClick={closeModal}>
						{formatMessage({ id: 'btn.close' })}
					</Button>
				}
				className={styles['permission-list']}
				destroyOnClose
			>
				<Input
					placeholder={formatMessage({
						id: 'roleManagement.permission.search.placeholder',
					})}
					onChange={e => {
						this.setState({ searchValue: e.target.value });
					}}
					className={styles['search-input']}
				/>
				<Tree
					className={styles.content}
					defaultExpandAll
					// filterTreeNode={node => {
					// 	console.log(node);
					// }}
				>
					{dataFormat.map(subMenu => (
						<TreeNode title={subMenu.label} key={`0-${subMenu.label}`}>
							{subMenu.permissionList.map(secondMenu => (
								<TreeNode title={secondMenu.label} key={secondMenu.value} />
							))}
						</TreeNode>
					))}
				</Tree>
			</Modal>
		);
	}
}
