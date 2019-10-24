import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { SIZES, SHAPE_TYPES, IMAGE_TYPES, MAPS } from '@/constants/studio';

const contentMap = {
	[SHAPE_TYPES.TEXT]: formatMessage({ id: 'studio.action.text.db.click' }),
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: '99.00',
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: '99.00',
	[SHAPE_TYPES.PRICE_SUB_WHITE]: '99.00',
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: '99.00',
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: '99.00',
	[SHAPE_TYPES.PRICE_SUB_BLACK]: '99.00',
};

const imgMap = {
	rect: require('@/assets/studio/rect.jpg'),
	text: require('@/assets/studio/text.jpg'),
	'line@h': require('@/assets/studio/line@h.jpg'),
	'line@v': require('@/assets/studio/line@v.jpg'),
	image: require('@/assets/studio/image.jpg'),
	'price@normal@white': require('@/assets/studio/price@normal@white.jpg'),
	'price@sub@white': require('@/assets/studio/price@sub@white.jpg'),
	'price@sup@white': require('@/assets/studio/price@sup@white.jpg'),
	'price@normal@black': require('@/assets/studio/price@normal@black.jpg'),
	'price@sub@black': require('@/assets/studio/price@sub@black.jpg'),
	'price@sup@black': require('@/assets/studio/price@sup@black.jpg'),
	'barcode@h': require('@/assets/studio/barcode@h.jpg'),
	'barcode@v': require('@/assets/studio/barcode@v.jpg'),
	'barcode@qr': require('@/assets/studio/barcode@qr.jpg'),
};

export default class ToolItem extends Component {
	componentDidMount() {
		const { id, type, addComponent }  = this.props;
		const element = document.getElementById(id);

		element.onmousedown = ev => {
			ev.preventDefault();

			const { clientX, clientY } = ev;
			const disX = clientX - element.offsetLeft;
			const disY = clientY - element.offsetTop;
			const elementInfo = getComputedStyle(element);
			element.style.zIndex = '1';
			const originInfo = {
				left: elementInfo.left,
				top: elementInfo.top,
				zIndex: elementInfo.zIndex,
			};
			const showShape = document.createElement('img');
			const zoomScaleIcon = document.getElementById('zoomScale');
			const zoomScale = parseInt(zoomScaleIcon.innerText, 10) / 100;
			showShape.src = imgMap[type];
			showShape.style.width = `${MAPS.containerWidth[type] * zoomScale}px`;
			showShape.style.height = `${MAPS.containerHeight[type] * zoomScale}px`;
			showShape.style.position = 'absolute';
			document.documentElement.appendChild(showShape);
			document.onmousemove = evt => {
				this.newLeft = evt.clientX - disX;
				this.newTop = evt.clientY - disY;
				element.style.position = 'absolute';
				element.style.left = `${this.newLeft}px`;
				element.style.top = `${this.newTop}px`;
				showShape.style.left = `${evt.clientX}px`;
				showShape.style.top = `${evt.clientY}px`;
			};
			document.onmouseup = evt => {
				document.documentElement.removeChild(showShape);
				document.onmouseup = null;
				document.onmousemove = null;
				element.style.left = originInfo.left;
				element.style.top = originInfo.top;
				element.style.zIndex = 'auto';

				if (this.newLeft > SIZES.TOOL_BOX_WIDTH) {
					const x = evt.clientX - SIZES.TOOL_BOX_WIDTH;
					const y = evt.clientY - SIZES.HEADER_HEIGHT - 20;

					if (IMAGE_TYPES.includes(type)) {
						const image = new Image();
						image.onload = () => {
							addComponent({
								x,
								y,
								type,
								image,
								scaleX: 1,
								scaleY: 1,
								rotation: 0,
								codec: 'code128',
							});
						};
						image.src = MAPS.imgPath[type];
					} else {
						addComponent({
							x,
							y,
							type,
							backgroundColor: MAPS.background[type],
							content: contentMap[type],
							width: MAPS.width[type],
							cornerRadius: MAPS.cornerRadius[type],
							fontSize: MAPS.fontSize[type],
							smallFontSize: MAPS.smallFontSize[type],
							bold: 0,
							italic: 0,
							underline: 0,
							strikethrough: 0,
							strokeWidth: MAPS.strokeWidth[type],
							strokeColor: MAPS.strokeColor[type],
							letterSpacing: MAPS.letterSpacing[type],
							lineSpacing: MAPS.lineSpacing[type],
							align: MAPS.align[type],
							fontFamily: MAPS.fontFamily[type],
							fontColor: MAPS.fontColor[type],
							scaleX: 1,
							scaleY: 1,
							rotation: 0,
							precision: 2
						});
					}
					this.newLeft = 0;
					this.newTop = 0;
				}
			};
		};
	}

	render() {
		const { id, className, children } = this.props;

		return (
			<Fragment>
				<div className={className}>{children}</div>
				<div className={className} id={id} style={{opacity: 0}}>
					{children}
				</div>
			</Fragment>
		);
	}
}
