import React, {Component} from 'react';
import * as styles from './index.less';

export default class DragCopy extends Component {
	render() {
		const {dragCopy, dragName, refComponents} = this.props;

		if (refComponents[dragName]) {
			return (
				<div className={styles['drag-copy-container']} style={dragCopy}>
					<img src={refComponents[dragName].toDataURL()} />
				</div>
			);
		}
		return null;
	}
}
