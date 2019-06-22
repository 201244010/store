import React, { Component } from 'react';
import { Spin } from 'antd';
import router from 'umi/router';

import { env } from '@/config';

class MenuCheck extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inChecking: true,
		};
	}

	componentWillMount() {
		const {
			location: { pathname },
		} = window;
		const { menuData } = this.props;

		if (pathname !== '/' && env !== 'dev') {
			const visitPath = pathname.slice(1).split('/')[0];
			const isAccessable = menuData.some(menu => menu.path.slice(1) === visitPath);
			if (!isAccessable) {
				router.goBack();
			}
		}
	}

	componentDidMount(){
		this.setState({
			inChecking: false,
		});
	}

	render() {
		const { inChecking } = this.state;
		const { children } = this.props;

		return <>{inChecking ? <Spin spinning /> : <>{children}</>}</>;
	}
}

export default MenuCheck;
