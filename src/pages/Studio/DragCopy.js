import React, {Component} from 'react';
import {MAPS, SHAPE_TYPES} from '@/constants/studio';
import * as styles from './index.less';

export default class DragCopy extends Component {
	render() {
		const {dragCopy, dragName, refComponents, componentsDetail} = this.props;

		if (dragName.indexOf(SHAPE_TYPES.IMAGE) > -1) {
			const componentDetail = componentsDetail[dragName];
			const imgStyles = {
				width: MAPS.containerWidth[SHAPE_TYPES.IMAGE] * componentDetail.scaleX * componentDetail.zoomScale
			};

			if (componentsDetail[dragName].imgPath) {
				return (
					<div className={styles['drag-copy-container']} style={dragCopy}>
						<img src={componentsDetail[dragName].imgPath} style={imgStyles} />
					</div>
				);
			}
			return (
				<div className={styles['drag-copy-container']} style={dragCopy}>
					<img src={require('@/assets/studio/image.jpg')} style={imgStyles} />
				</div>
			);
		}

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
