import React, { Component } from 'react';
import {Card,Button} from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './CloudService.less';


const mapStateToProps = (state) => {
	const { cloudService } = state;
	return {
		cloudService
	};
};
const mapDispatchToProps = (dispatch) => ({
	load: () => {
		dispatch({
			type: 'cloudService/read'
		});
	}
});

@connect(mapStateToProps, mapDispatchToProps)
class CloudService extends Component {
	state={

	}

	render() {
		// console.log(this.props)
		const { cloudService } = this.props;
		const { isOpen, isExpired, deadline } = cloudService;
		return (
			<Card className={styles.card} title={<FormattedMessage id='cloudService.title' />}>
				<div className="tips" style={{fontSize:18,fontWeight:400,marginTop:40,marginLeft:100}}>
					{isOpen && isExpired ? <FormattedMessage id='cloudService.renewalMsg' />:''}
					{isOpen && !isExpired ? <span><FormattedMessage id='cloudService.openMsg' />{deadline}</span>:''}
					{!isOpen ? <FormattedMessage id='cloudService.closeMsg' />:''}
				</div>
				<Button type="default">
					{isOpen ? <FormattedMessage id='cloudService.renewal' />
						: <FormattedMessage id='cloudService.open' />}
				</Button>
			</Card>
		);
	}
}
export default CloudService;