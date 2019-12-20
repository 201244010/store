import  React  from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Card, Button, Modal, Tree, message } from 'antd';
import OrganizationTable from './OrganizationTable';
import DeprecateModal from './DeprecateModal';
// import OrganizationSearchBar from './OrganizationSearchBar';
import styles from './Organization.less';

const mapStateToProps = (state) => {
	const { organization, loading } = state;
	return {
		organization,
		loading
	};
};
const mapDispatchToProps = (dispatch) => ({
	// 根据选项更新层级树
	updateTreeData: async (params) => {
		const result = await dispatch({
			type: 'organization/setTreeData',
			payload: params
		});

		return result;
	},
	// 初始化数据
	initOrgList: () => {
		dispatch({
			type: 'organization/initOrgList',
		});
	},
	initLayerTree: () => {
		dispatch({
			type: 'organization/initLayerTree',
		});
	},
	move: async (params) => {
		const result = await dispatch({
			type: 'organization/move',
			payload: params
		});
		if(result) {
			message.success(formatMessage({ id: 'organization.move.result.success'}));
		} else {
			message.error(formatMessage({ id: 'organization.move.result.error'}));
		}
	},
	enable: async (orgId) => {
		const result = await dispatch({
			type: 'organization/enable',
			payload: {
				orgId
			}
		});
		if(result) {
			message.success(formatMessage({ id: 'organization.enable.result.success'}));
		} else {
			message.error(formatMessage({ id: 'organization.enable.result.error'}));
		}
	},
	navigateTo: (pathId, urlParams) => dispatch({
		type: 'menu/goToPath',
		payload: {
			pathId,
			urlParams
		}
	})
});

@connect(mapStateToProps, mapDispatchToProps)
class OrganizationList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			moveModalVisible: false,
			// deprecateModalVisible: false,
			selectedList: [], // 被选择的子树集合
			selectedIdList: [], // 被选择的id集合
			targetPId: '', // 目标父节点
			// selectedOrgId: '' // 停用的目标结点
		};
	}

	componentDidMount = () => {
		const { initOrgList, initLayerTree } = this.props;
		initOrgList();
		initLayerTree();
	}

	// 根据搜索条件获取列表
	getOrgList = () => {
		const { form } = this.searchForm.props;
		const { getOrgList } = this.props;
		const { keyword, orgTag, orgStatus } = form.getFieldsValue();
		getOrgList({
			keyword,
			orgTag,
			orgStatus
		});
	}

	// 搜索
	handleSearch = () => {
		// const { form: { validateFields, getFieldsValue } } = this.searchForm;
		this.getOrgList();
	}

	// 重置
	handleReset = () => {
		const { form: { setFieldsValue } } = this.searchForm.props;
		setFieldsValue({
			keyword: '',
			orgTag: -1,
			orgStatus: -1
		});
		this.getOrgList();
	}

	// 打开移动的选框
	handleMove = async () => {
		const { selectedList } = this.state;
		const { updateTreeData } = this.props;
		console.log('-----open move -----', selectedList);
		// 根据选项重新计算disbled的树结点
		await updateTreeData({
			selectedList,
			type: 'move'
		});
		this.setState({
			moveModalVisible: true
		});
	}

	// 确认移动
	handleMoveOk = () => {
		this.setState({
			moveModalVisible: false
		});

		const { selectedIdList, targetPId } = this.state;
		const { move } = this.props;
		console.log('-----确认移动-----', selectedIdList, targetPId);
		move({
			selectedIdList, targetPId
		});
	}

	// 取消移动
	handleMoveCancel = () => {
		this.setState({
			moveModalVisible: false,
		});
	}

	// 停用
	handleDeprecate = async (target) => {
		console.log('------disenable-----', target, this.deprecateModal);

		this.deprecateModal.handleDeprecate(target);
	}

	handleEnable = (target) => {
		console.log('-----enable----', target);
		const { orgId } = target;
		const { enable } = this.props;
		enable(orgId);
	}

	// 获取要移动的子树列表
	setSelectedList = (seletedRecord, selected) => {
		const { selectedList } = this.state;
		if(selected) {
			selectedList.push(seletedRecord);
		} else {
			const list = selectedList.filter(item => item.orgId !== seletedRecord.orgId);
			this.setState({
				selectedList: list
			});
		}

	}

	// 全选是想要移动的子树是整个列表
	onSelectAll = (selected) => {
		if(selected) {
			const { orgList } = this.props;
			this.setState({
				selectedList: [...orgList]
			});
		} else {
			this.setState({
				selectedList: []
			});
		}
	}

	// 获取被选项的id列表
	setSelectedKeys = (idList) => {

		console.log('----selected item id----', idList);
		this.setState({
			selectedIdList: [...idList]
		});
	}

	// 选择父组织
	handleSelectTree = (selectedKeys) => {
		console.log('----selected tree----', selectedKeys);
		this.setState({
			targetPId: selectedKeys[0],
		});
	}

	// 修改
	handleModify = (target) => {
		console.log('------modify-----', target);
		const { navigateTo } = this.props;
		const { orgId } = target;
		navigateTo('companyInfo',{ type: 'edit', orgId });

	}

	// 查看
	handleViewInfo = (target) => {
		console.log('------check-----', target);
		// const { navigateTo } = this.props;
	}

	render() {
		const { moveModalVisible, /* modalInfoVisible, */ selectedIdList } = this.state;
		const { organization: { orgList, treeData, expandedRowKeys }, loading } = this.props;
		return (
			<div>
				<Card bordered={false}>
					{/* <OrganizationSearchBar
						wrappedComponentRef={form => {
							this.searchForm = form;
						}}
						handleReset={this.handleReset}
						handleSearch={this.handleSearch}
					/> */}
					<div className={styles['action-container']}>
						<Button className={styles['action-btn-left']} type="primary">
							{formatMessage({id: 'organization.action.btn.add'})}
						</Button>
						<Button onClick={this.handleMove} disabled={selectedIdList.length === 0}>
							{formatMessage({id: 'organization.action.btn.move'})}
						</Button>
					</div>
					<OrganizationTable
						handleDeprecate={this.handleDeprecate}
						handleModify={this.handleModify}
						handleViewInfo={this.handleViewInfo}
						dataSource={orgList}
						setSelectedKeys={this.setSelectedKeys}
						setSelectedList={this.setSelectedList}
						expandedRowKeys={expandedRowKeys}
						onSelectAll={this.onSelectAll}
						handleEnable={this.handleEnable}
						loading={loading.effects['organization/initOrgList']}
					/>
				</Card>
				<Modal
					title={formatMessage({id: 'organization.tree.modal.title.move'})}
					destroyOnClose
					visible={moveModalVisible}
					onOk={this.handleMoveOk}
					onCancel={this.handleMoveCancel}
					className={styles['tree-modal']}
				>
					<span className={styles['tree-modal-info']}>
						{formatMessage({id: 'organization.tree.modal.info'})}
					</span>
					<Tree
						treeData={treeData}
						onSelect={this.handleSelectTree}
						className={styles['layer-tree']}
						blockNode
					/>
				</Modal>
				<DeprecateModal onRef={modal => { this.deprecateModal = modal; }} />
			</div>

		);
	};
}

export default OrganizationList;