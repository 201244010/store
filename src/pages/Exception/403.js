import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import Exception from '@/components/Exception';

@connect(
	state => ({ menu: state.menu }),
	dispatch => ({
		getMenuData: payload => dispatch({ type: 'menu/getMenuData', payload }),
	})
)
class Exception403 extends Component {
	componentDidMount() {
		const {
			getMenuData,
			menu: { routes },
		} = this.props;

		getMenuData({ routes });
	}

	render() {
		return (
			<Exception
				type="403"
				desc={formatMessage({ id: 'app.exception.description.403' })}
				linkElement={Link}
				backText={formatMessage({ id: 'app.exception.back' })}
			/>
		);
	}
}

export default Exception403;
