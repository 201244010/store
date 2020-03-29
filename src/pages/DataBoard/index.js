import React from 'react';
import * as CookieUtil from '@/utils/cookies';
import TopDataBoard from './TopDataBoard';
import RTDataBoard from './RTDataBoard';

class DashBoard extends React.Component {
	isTopView = () => {
		const shopId = CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY);
		return shopId === 0;
	};

	render() {
		const { isTopView } = this;
		let view = <div />;
		// 总部状态
		if (isTopView()) {
			console.log('======================总部视角');
			view = <TopDataBoard />;
		} else {
			console.log('======================单门店视角');
			// view = <TopDataBoard />;
			view = <RTDataBoard />;
		}
		return view;
	}
}

export default DashBoard;
