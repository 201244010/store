import React, {Component} from 'react';
import {MAPS, SHAPE_TYPES, SIZES} from '@/constants/studio';
import {getTypeByName} from '@/utils/studio';
import * as styles from './index.less';

export default class DragCopy extends Component {
	render() {
		const {dragCopy, dragName, componentsDetail, zoomScale} = this.props;
		const componentDetail = componentsDetail[dragName] || {};
		const type = getTypeByName(dragName);

		const rectStyle = {
			width: MAPS.containerWidth[componentDetail.type] * componentDetail.scaleX * zoomScale,
			height: MAPS.containerHeight[componentDetail.type] * componentDetail.scaleY * zoomScale,
		};
		const style = {
			...dragCopy,
			...rectStyle,
			backgroundColor: componentDetail.backgroundColor,
			fontFamily: componentDetail.fontFamily,
			fontSize: componentDetail.fontSize * zoomScale,
			color: componentDetail.fontColor
		};
		const smallFontSize = componentDetail.smallFontSize * zoomScale;

		if (dragName.indexOf(SHAPE_TYPES.TEXT) > -1 || dragName.indexOf(SHAPE_TYPES.PRICE_NORMAL) > -1) {
			return (
				<div className={styles['drag-copy-container']} style={style}>
					<span>{componentDetail.content}</span>
				</div>
			);
		}
		if (dragName.indexOf(SHAPE_TYPES.RECT) > -1 || dragName.indexOf(SHAPE_TYPES.LINE) > -1) {
			return (
				<div className={styles['drag-copy-container']} style={style} />
			);
		}
		if (dragName.indexOf(SHAPE_TYPES.IMAGE) > -1) {
			if (componentDetail.imgPath) {
				rectStyle.height = rectStyle.width * componentDetail.ratio;
				return (
					<div className={styles['drag-copy-container']} style={style}>
						<img src={componentDetail.image.src} style={rectStyle} />
					</div>
				);
			}

			style.backgroundColor = '#d9d9d9';
			rectStyle.width = SIZES.DEFAULT_IMAGE_WIDTH * zoomScale;
			rectStyle.height = SIZES.DEFAULT_IMAGE_HEIGHT * zoomScale;
			rectStyle.transform = `translateX(${(style.width - rectStyle.width) / 2}px)`;
			return (
				<div className={styles['drag-copy-container']} style={style}>
					<img src={componentDetail.image.src} style={rectStyle} />
				</div>
			);
		}
		if (dragName.indexOf(SHAPE_TYPES.PRICE_SUB) > -1 || dragName.indexOf(SHAPE_TYPES.PRICE_SUPER) > -1) {
			const integer = parseInt(componentDetail.content, 10);
			const contentStr = (componentDetail.content || '').toString();
			const small = contentStr.substring(contentStr.indexOf('.') + 1);
			return (
				<div className={styles['drag-copy-container']} style={style}>
					<span>{integer}.{type.indexOf('sup') > -1 ? <sup style={{fontSize: smallFontSize}}>{small}</sup> : <sub style={{fontSize: smallFontSize}}>{small}</sub>}</span>
				</div>
			);
		}
		if (dragName.indexOf(SHAPE_TYPES.CODE) > -1) {
			return (
				<div className={styles['drag-copy-container']} style={style}>
					<img src={componentDetail.image.src} style={rectStyle} />
				</div>
			);
		}
		return null;
	}
}
