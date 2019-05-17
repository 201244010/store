import React from 'react';
import { connect } from 'dva';
import SDCardChild from './SDCardChild';

class SDCard extends React.Component {
	
	async componentDidMount() {
		const { init, getList } = this.props;
		await getList();
		init();
	}

	render() {
		const { children, sdcard, formatSdCard,resetformatResponse,resetStatus } = this.props;
		return (
			<div className='sdcard-wrapper'>
				{children}
				{
					sdcard.map((item, index) => {
						if(item.isOnline){
							return (
								<SDCardChild key={index} sdcardItem={item} formatSdCard={formatSdCard} resetformatResponse={resetformatResponse} resetStatus={resetStatus} />
							);
						}
						return '';
					})
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { sdcard} = state;
	return { sdcard};
};

const mapDispatchToProps = (dispatch) => ({
		getList:() => dispatch({
			type:'ipcList/read'
		}),
		init:()=>{
			dispatch({
				type:'sdcard/read'
			});
		},
		formatSdCard: (sn) => {
			dispatch({
				type: 'sdcard/formatSdCard',
				sn
			});
		},
		resetformatResponse:(sn) =>{
			dispatch({
				type: 'sdcard/resetformatResponse',
				sn
			});
		},
		resetStatus:(sn) =>{
			dispatch({
				type: 'sdcard/resetStatus',
				sn
			});
		}
	});

export default connect(mapStateToProps, mapDispatchToProps)(SDCard);