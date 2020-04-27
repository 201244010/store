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
	'line@h': require('@/assets/studio/line@h.jpg'),
	'line@v': require('@/assets/studio/line@v.jpg'),
	image: require('@/assets/studio/image.jpg'),
	'barcode@h': require('@/assets/studio/code_h.jpg'),
	'barcode@v': require('@/assets/studio/code_v.jpg'),
	'barcode@qr': require('@/assets/studio/barcode@qr.jpg'),
};

export default class ToolItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0,
			left: -9999,
			top: -9999
		};
	}

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
			const zoomScaleIcon = document.getElementById('zoomScale');
			this.zoomScale = parseInt(zoomScaleIcon.innerText, 10) / 100;

			this.setState({
				width: MAPS.containerWidth[type] * this.zoomScale,
				height: MAPS.containerHeight[type] * this.zoomScale
			});

			document.onmousemove = evt => {
				this.newLeft = evt.clientX - disX;
				this.newTop = evt.clientY - disY;
				element.style.position = 'absolute';
				element.style.left = `${this.newLeft}px`;
				element.style.top = `${this.newTop}px`;

				this.setState({
					left: evt.clientX,
					top: evt.clientY
				});
			};
			document.onmouseup = evt => {
				this.setState({
					width: 0,
					height: 0,
					left: -9999,
					top: -9999
				});

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
							precision: 2,
							bindField: 'no'
						});
					}
					this.newLeft = 0;
					this.newTop = 0;
				}
			};
		};
	}

	render() {
		const { id, type, className, children } = this.props;
		const {width, height, left, top} = this.state;
		let dragShape = null;
		let backgroundColor = 'transparent';
		if (imgMap[type]) {
			let genStyle = {};
			if (type === SHAPE_TYPES.CODE_H) {
				genStyle = {width: 'auto', height};
			} else if (type === SHAPE_TYPES.CODE_V) {
				genStyle = {width, height: 'auto'};
			} else {
				genStyle = {width, height};
			}
			dragShape = <img src={imgMap[type]} alt="" style={genStyle} />;
		}
		if ([SHAPE_TYPES.TEXT].includes(type)) {
			const textStyle = {
				position: 'relative',
				top: `${-3 * this.zoomScale}px`,
				fontSize: MAPS.fontSize[type] * this.zoomScale,
				fontFamily: 'Zfull-GB',
				color: '#000',
			};

			dragShape = (
				<span style={textStyle}>{contentMap[type]}</span>
			);
		}
		if ([SHAPE_TYPES.PRICE_NORMAL_WHITE, SHAPE_TYPES.PRICE_NORMAL_BLACK].includes(type)) {
			const textStyle = {
				fontSize: `${MAPS.fontSize[type] * this.zoomScale}px`,
				fontFamily: 'Zfull-GB',
				color: SHAPE_TYPES.PRICE_NORMAL_WHITE === type ? '#000' : '#fff',
				lineHeight: `${height}px`,
			};
			backgroundColor = SHAPE_TYPES.PRICE_NORMAL_WHITE === type ? '#fff' : '#000';

			dragShape = (
				<span style={textStyle}>{contentMap[type]}</span>
			);
		}
		if ([SHAPE_TYPES.PRICE_SUPER_WHITE, SHAPE_TYPES.PRICE_SUPER_BLACK].includes(type)) {
			const textStyle = {
				position: 'relative',
				top: `${-1 * this.zoomScale}px`,
				fontSize: `${MAPS.fontSize[type] * this.zoomScale}px`,
				fontFamily: 'Zfull-GB',
				color: SHAPE_TYPES.PRICE_SUPER_WHITE === type ? '#000' : '#fff',
				lineHeight: `${height}px`,
			};
			const smallTextStyle = {
				position: 'relative',
				top: `${-4 * this.zoomScale}px`,
				left: `${-3 * this.zoomScale}px`,
				fontSize: `${MAPS.smallFontSize[type] * this.zoomScale}px`,
			};
			backgroundColor = SHAPE_TYPES.PRICE_SUPER_WHITE === type ? '#fff' : '#000';

			dragShape = (
				<span style={textStyle}>99.<sup style={smallTextStyle}>00</sup></span>
			);
		}
		if ([SHAPE_TYPES.PRICE_SUB_WHITE, SHAPE_TYPES.PRICE_SUB_BLACK].includes(type)) {
			const textStyle = {
				position: 'relative',
				top: `${-1.5 * this.zoomScale}px`,
				fontSize: `${MAPS.fontSize[type] * this.zoomScale}px`,
				fontFamily: 'Zfull-GB',
				color: SHAPE_TYPES.PRICE_SUB_WHITE === type ? '#000' : '#fff',
				lineHeight: `${height}px`,
			};
			const smallTextStyle = {
				position: 'relative',
				top: `${-0.5 * this.zoomScale}px`,
				left: `${-3 * this.zoomScale}px`,
				fontSize: `${MAPS.smallFontSize[type] * this.zoomScale}px`,
			};
			backgroundColor = SHAPE_TYPES.PRICE_SUB_WHITE === type ? '#fff' : '#000';

			dragShape = (
				<span style={textStyle}>99.<sup style={smallTextStyle}>00</sup></span>
			);
		}

		return (
			<Fragment>
				<div className={className}>{children}</div>
				<div className={className} id={id} style={{opacity: 0}}>
					{children}
				</div>
				<div style={{backgroundColor, position: 'fixed', zIndex: 100, width, height, left, top}}>
					{dragShape}
				</div>
			</Fragment>
		);
	}
}
