import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { checkAnchor } from '@/utils/utils';

function AnchorWrapper(WrapperedComponent) {
	@connect(state => ({
		routing: state.routing,
	}))
	class Anchor extends PureComponent {
		componentDidMount() {
			const {
				routing: { location: { hash = null } = {} },
			} = this.props;
			if (hash) {
				// console.log('hash is ', hash.slice(1));
				checkAnchor(hash.slice(1));
			}
		}

		render() {
			return <WrapperedComponent {...this.props} />;
		}
	}

	return Anchor;
}

export default AnchorWrapper;
