import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Spin } from 'antd';

@connect(
	state => ({ menu: state.menu }),
	dispatch => ({
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class Index extends Component {
	componentDidMount() {
		const {
			menu: { menuData = [] },
			goToPath,
		} = this.props;

		const { path } = menuData[0] || {};
		if (!path) {
			goToPath('account');
		} else {
			router.push(path);
		}
	}

	render() {
		return <Spin spinning />;
	}
}

export default Index;
