import React from 'react';
import { Modal, Checkbox, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { getLocale } from 'umi-plugin-locale';
import styles from './AgreementModal.less';
import { ERROR_OK } from '@/constants/errorCode';

const AGREEMENT_TYPE = 'face';

@connect(
	(state) => {
		const { agreementModal:{agreementInfo}, loading } = state;
		return {
			agreementInfo,
			loading
		};
	},
	(dispatch) => ({
		navigateTo: (pathId, urlParams) => dispatch({
			type: 'menu/goToPath',
			payload: {
				pathId,
				urlParams
			}
		}),
		getLatestAgreement:(type, lang) => dispatch({
			type:'agreementModal/getLatestAgreement',
			payload: {
				type,
				lang
			}
		}),
		acceptAgreement:(agreementId) => dispatch({
			type:'agreementModal/acceptAgreement',
			payload: {
				agreementId
			}
		})

	}))
class AgreementModal extends React.Component{

	constructor(props) {
		super(props);
		const { visible } = this.props;
		this.state = {
			isSelected: false,
			visible
		};
	}

	async componentDidMount(){
		const { getLatestAgreement } = this.props;
		const locale = getLocale();
		await getLatestAgreement(AGREEMENT_TYPE, locale);
	}

	componentWillReceiveProps(nextProps){
		const { visible } = nextProps;
		this.state = {
			visible
		};
	}

	selectedHandler = (e) =>{
		const isSelected = e.target.checked;
		this.setState({
			isSelected
		});
	}

	handleOk = async() => {
		const { agreementInfo:{ id: agreementId }, acceptAgreement, refreshHandler } = this.props;
		const response = await acceptAgreement(agreementId);
		const { code } = response;
		if(code === ERROR_OK){
			message.success(formatMessage({id: 'agreement.success'}));
			await refreshHandler();
			this.setState({
				visible:false
			});
		}else{
			message.error(formatMessage({id: 'agreement.fail'}));
			this.handleCancel();
			
		}
	}

	handleCancel = () => {
		const { path = 'faceidLibrary' , navigateTo} = this.props;
		navigateTo(path);
	}

	render(){
		const { loading } = this.props;
		const { isSelected, visible } = this.state;
		return(
			<Modal
				title={formatMessage({id: 'agreement.title'})}
				className={styles['agreement-modal']}
				width={640}
				visible={visible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				okButtonProps={{
					disabled: !isSelected,
					loading: loading.effects['agreementModal/acceptAgreement']
				}}
			>
				<div className={styles.tips}>
					<p>{formatMessage({id: 'agreement.tips'})}</p>
					<div className={styles['agree-tips']}>
						<Checkbox onChange={this.selectedHandler}>
							<span className={styles.agree}>{formatMessage({id: 'agreement.agree'})}</span>
							<a className={styles.agreement}>{formatMessage({id: 'agreement.agreement'})}</a>
						</Checkbox>
					</div>
				</div>
			</Modal>
		);
	}
}

export default AgreementModal;