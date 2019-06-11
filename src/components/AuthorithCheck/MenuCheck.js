import React, { Component } from 'react';
import router from 'umi/router';

class MenuCheck extends Component {
	componentDidMount() {
		const {
			location: { pathname },
		} = window;
		const { menuData } = this.props;

		if (pathname !== '/') {
			const visitPath = pathname.slice(1).split('/')[0];
			const isAccessable = menuData.some(menu => menu.path.slice(1) === visitPath);
			if (!isAccessable) {
				router.goBack();
			}
		}
	}

	render() {
		return <></>;
	}
}

export default MenuCheck;
