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

export default class ToolItem extends Component {
	componentDidMount() {
		const { id, type, addComponent } = this.props;
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
			document.onmousemove = evt => {
				this.newLeft = evt.clientX - disX;
				this.newTop = evt.clientY - disY;
				element.style.position = 'absolute';
				element.style.left = `${this.newLeft}px`;
				element.style.top = `${this.newTop}px`;
			};
			document.onmouseup = () => {
				document.onmouseup = null;
				document.onmousemove = null;
				element.style.left = originInfo.left;
				element.style.top = originInfo.top;
				element.style.zIndex = 'auto';

				if (this.newLeft > SIZES.TOOL_BOX_WIDTH) {
					const x = this.newLeft - SIZES.TOOL_BOX_WIDTH;
					const y = this.newTop;

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
				<div className={className} id={id}>
					{children}
				</div>
			</Fragment>
		);
	}
}
