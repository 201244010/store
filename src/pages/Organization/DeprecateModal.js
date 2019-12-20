import  React  from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Modal, Tree, message   } from 'antd';
import { ERROR_OK, ORGANIZATION_NO_DESABLED } from '@/constants/errorCode';
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
	check: async (orgId) => {
		const result = await dispatch({
			type: 'organization/check',
			payload: {
				orgId
			}
		});
		return result;
	},
	deprecate: async (params) => {
		const result = await dispatch({
			type: 'organization/deprecate',
			payload: params
		});
		return result;
	},
});

@connect(mapStateToProps, mapDispatchToProps)
class DeprecateModal extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			deprecateModalVisible: false,
			targetPId: '', // 目标父节点
			selectedOrgId: '' // 停用的目标结点
		};
	}

	componentDidMount = () => {
		const { onRef } = this.props;
		onRef(this);
	}

	// 停用
	handleDeprecate = async (target) => {
		console.log('------deprecate-----', target);

		const { check } = this.props;
		const { orgId } = target;
		const result = await check(orgId);
		const { code } = result;
		if(code === ERROR_OK) {
			const selectedList = [target];
			const { updateTreeData } = this.props;
			await updateTreeData({
				selectedList,
				type: 'deprecate'
			});
			this.setState({
				deprecateModalVisible: true,
				selectedOrgId: orgId
			});
		} else if(code === ORGANIZATION_NO_DESABLED){
			Modal.info({
				title: formatMessage({ id: 'organization.confirm.modal.title'}),
				content: formatMessage({ id: 'organization.info.modal.content'}),
				onOk() {},
			});
		} else {
			message.error(formatMessage({ id: 'organizetion.action.error'}));
		}
	}

	// 确认停用
	handleDeprecateOk = async () => {
		this.setState({
			deprecateModalVisible: false,
		});
		Modal.confirm({
			title: formatMessage({ id: 'organization.confirm.modal.title'}),
			content: formatMessage({ id: 'organization.confirm.modal.content'}),
			cancelText: formatMessage({ id: 'organization.confirm.modal.cancel'}),
			okText: formatMessage({ id: 'organization.confirm.modal.ok'}),
			okType: 'danger',
			// className: styles['confirm-modal'],
			// icon: <Icon type="exclamation-circle" />,
			onOk: async () =>  {
				const { deprecate } = this.props;
				const { selectedOrgId, targetPId } = this.state;
				const result = await deprecate({
					selectedOrgId,
					targetPId
				});
				if(result) {
					const { init } = this.props;
					init();
					message.success(formatMessage({ id: 'organization.deprecate.result.success'}));
				} else {
					message.error(formatMessage({ id: 'organization.deprecate.result.error'}));
				}
				this.setState({
					deprecateModalVisible: false,
					targetPId: ''
				});
			},
		});

	}

	// 取消停用
	handleDeprecateCancel = () => {
		this.setState({
			deprecateModalVisible: false
		});
	}

	handleSelectTree = (selectedKeys) => {
		console.log('----selected tree----', selectedKeys);
		this.setState({
			targetPId: selectedKeys[0],
		});
	}

	render() {

		const { deprecateModalVisible } = this.state;
		const { organization: {  treeData } } = this.props;
		return(
			<Modal
				title={formatMessage({id: 'organization.tree.modal.title.deprecate'})}
				destroyOnClose
				visible={deprecateModalVisible}
				onOk={this.handleDeprecateOk}
				onCancel={this.handleDeprecateCancel}
				className={styles['tree-modal']}
			>
				<span className={styles['tree-modal-info']}>
					{formatMessage({id: 'organization.tree.modal.disable.info'})}
				</span>
				<Tree
					treeData={treeData}
					onSelect={this.handleSelectTree}
					className={styles['layer-tree']}
					blockNode
				/>
			</Modal>
		);
	}

}
export default DeprecateModal;