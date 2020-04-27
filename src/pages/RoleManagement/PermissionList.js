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

	filterList = list => {
		const { searchValue } = this.state;
		if (!searchValue) return list;
		return list.reduce((result, child) => {
			if (this.showItem(child, searchValue)) {
				// 如果有子节点
				if (child.permissionList) {
					const { label, path, permissionList } = child;
					return [
						...result,
						{ label, path, permissionList: this.filterList(permissionList) },
					];
				}
				return [...result, child];
			}
			return result;
		}, []);
	};

	/** 筛选时判断当前节点是否显示
	 * item为Object
	 * 返回值 boolean
	 */
	showItem = (item, value) => {
		const hasVal = item.label.indexOf(value) > -1;
		if (hasVal) {
			return hasVal;
		}
		// 当前节点没有value，则向子节点查找
		if (item.permissionList) {
			return item.permissionList.some(child => this.showItem(child, value));
		}
		return hasVal;
	};

	renderChildNode = list =>
		list.map(menu => {
			if (!menu.permissionList) {
				return <TreeNode title={menu.label} key={menu.value} />;
			}
			return (
				<TreeNode title={menu.label} key={`0-${menu.label}`}>
					{this.renderChildNode(menu.permissionList)}
				</TreeNode>
			);
		});

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
				<Tree className={styles.content} defaultExpandAll>
					{this.renderChildNode(dataFormat)}
				</Tree>
			</Modal>
		);
	}
}
