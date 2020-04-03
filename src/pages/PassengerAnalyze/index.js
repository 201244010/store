import React from 'react';
import * as CookieUtil from '@/utils/cookies';
import PassengerDataBoard from '@/pages/DataBoard/PassengerDataBoard';
import TopPassengerDataBoard from '@/pages/DataBoard/TopPassengerDataBoard';

class DashBoard extends React.Component {
	isTopView = () => {
		const shopId = CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY);
		return shopId === 0;
	};

	render() {
		const { isTopView } = this;
		let view = <PassengerDataBoard />;
		// 总部状态
		if (isTopView()) {
			console.log('======================总部视角');
			view = <TopPassengerDataBoard />;
		} else {
			console.log('======================单门店视角');
			// view = <TopPassengerDataBoard />;
			view = <PassengerDataBoard />;
		}
		return view;
	}
}

export default DashBoard;
