import React, { Fragment } from 'react';
import { Group, Rect, Text, Image, Shape } from 'react-konva';
import { SHAPE_TYPES, SIZES, MAPS } from '@/constants/studio';

const initFontStyle = (option) => {
	let fontStyle = 'normal';
	if (option.bold && !option.italic) {
		fontStyle = 'bold';
	}
	if (!option.bold && option.italic) {
		fontStyle = 'italic';
	}
	if (option.bold && option.italic) {
		fontStyle = 'bold italic';
	}
	return fontStyle;
};

const initTextDecoration = (option) => {
	let textDecoration = 'normal';
	if (option.underline) {
		textDecoration = 'underline';
	}
	if (option.strikethrough) {
		textDecoration = 'line-through';
	}
	return textDecoration;
};

export default function generateShape(option) {
	let shape;

	switch (option.type) {
		case SHAPE_TYPES.RECT:
			shape = (
				<Rect
					{...{
						name: option.name,
						x: option.x,
						y: option.y,
						width: MAPS.width[SHAPE_TYPES.RECT] * option.zoomScale - (option.strokeWidth || 0),
						height: MAPS.height[SHAPE_TYPES.RECT] * option.zoomScale - (option.strokeWidth || 0),
						scaleX: option.scaleX,
						scaleY: option.scaleY,
						fill: option.backgroundColor,
						stroke: option.strokeWidth ? option.strokeColor : 'rgba(0, 0, 0, 0)',
						strokeWidth: option.strokeWidth,
						cornerRadius: option.cornerRadius,
						strokeScaleEnabled: false,
						draggable: true,
						onTransform: option.onTransform,
						onTransformEnd: option.onTransformEnd,
						onMouseOver: () => {
							document.body.style.cursor = 'pointer';
						},
						onMouseOut: () => {
							document.body.style.cursor = 'default';
						},
					}}
				/>
			);
			break;
		case SHAPE_TYPES.RECT_FIX:
			shape = (
				<Rect
					{...{
						name: option.name,
						x: option.x,
						y: option.y,
						width: MAPS.screen[option.screenType].width * option.zoomScale,
						height: MAPS.screen[option.screenType].height * option.zoomScale,
						scaleX: option.scaleX,
						scaleY: option.scaleY,
						fill: option.backgroundColor,
						stroke: option.strokeWidth ? option.strokeColor : 'rgba(0, 0, 0, 0)',
						strokeWidth: option.strokeWidth,
						cornerRadius: option.cornerRadius,
						strokeScaleEnabled: false,
						onTransform: option.onTransform,
						onTransformEnd: option.onTransformEnd,
						shadowColor: 'rgba(0, 0, 0, 0.1)',
						shadowBlur: 1,
						shadowOffset: { x: 0, y: 2 },
						shadowOpacity: 0.5,
						onMouseOver: () => {
							document.body.style.cursor = 'pointer';
						},
						onMouseOut: () => {
							document.body.style.cursor = 'default';
						},
					}}
				/>
			);
			break;
		case SHAPE_TYPES.RECT_SELECT:
			shape = (
				<Rect
					{...{
						name: option.name,
						x: option.x,
						y: option.y,
						width: option.width,
						height: option.height,
						scaleX: option.scaleX,
						scaleY: option.scaleY,
						opacity: option.opacity,
						fill: 'rgb(41, 141, 248)',
						strokeScaleEnabled: false,
						zIndex: 1000,
						draggable: true,
						onMouseOver: () => {
							document.body.style.cursor = 'pointer';
						},
						onMouseOut: () => {
							document.body.style.cursor = 'default';
						},
					}}
				/>
			);
			break;
		case SHAPE_TYPES.TEXT:
			shape = (
				<Group>
					<Rect
						{...{
							name: option.name,
							x: option.x,
							y: option.y,
							width: MAPS.containerWidth[SHAPE_TYPES.TEXT] * option.zoomScale,
							height: MAPS.containerHeight[SHAPE_TYPES.TEXT] * option.zoomScale,
							scaleX: option.scaleX,
							scaleY: option.scaleY,
							fill: option.backgroundColor,
							opacity: option.backgroundColor === 'opacity' ? 0 : 1,
							draggable: true,
							onTransform: option.onTransform,
							onTransformEnd: option.onTransformEnd,
							onDblClick: option.onDblClick,
							onMouseOver: () => {
								document.body.style.cursor = 'pointer';
							},
							onMouseOut: () => {
								document.body.style.cursor = 'default';
							},
						}}
					/>
					<Text
						{...{
							name: option.name,
							x: option.x,
							y: option.y,
							offsetY: -4,
							text: option.content,
							fontFamily: option.fontFamily,
							fontSize: option.fontSize * option.zoomScale,
							fontStyle: initFontStyle(option),
							textDecoration: initTextDecoration(option),
							fill: option.fontColor,
							align: option.align,
							letterSpacing: option.letterSpacing,
							width: MAPS.containerWidth[SHAPE_TYPES.TEXT] * option.scaleX * option.zoomScale,
							height: MAPS.containerHeight[SHAPE_TYPES.TEXT] * option.zoomScale,
							draggable: true,
							onDblClick: option.onDblClick,
							onMouseOver: () => {
								document.body.style.cursor = 'pointer';
							},
							onMouseOut: () => {
								document.body.style.cursor = 'default';
							},
						}}
					/>
				</Group>
			);
			break;
		case SHAPE_TYPES.LINE_H:
			shape = (
				<Rect
					{...{
						name: option.name,
						x: option.x,
						y: option.y,
						width: MAPS.containerWidth[SHAPE_TYPES.LINE_H] * option.zoomScale,
						height: MAPS.containerHeight[SHAPE_TYPES.LINE_H] * option.zoomScale,
						scaleX: option.scaleX,
						scaleY: option.scaleY,
						fill: option.backgroundColor,
						draggable: true,
						onTransform: option.onTransform,
						onTransformEnd: option.onTransformEnd,
						onMouseOver: () => {
							document.body.style.cursor = 'pointer';
						},
						onMouseOut: () => {
							document.body.style.cursor = 'default';
						},
					}}
				/>
			);
			break;
		case SHAPE_TYPES.LINE_V:
			shape = (
				<Rect
					{...{
						name: option.name,
						x: option.x,
						y: option.y,
						width: MAPS.containerWidth[SHAPE_TYPES.LINE_V] * option.zoomScale,
						height: MAPS.containerHeight[SHAPE_TYPES.LINE_V] * option.zoomScale,
						scaleX: option.scaleX,
						scaleY: option.scaleY,
						fill: option.backgroundColor,
						draggable: true,
						onTransform: option.onTransform,
						onTransformEnd: option.onTransformEnd,
						onMouseOver: () => {
							document.body.style.cursor = 'pointer';
						},
						onMouseOut: () => {
							document.body.style.cursor = 'default';
						},
					}}
				/>
			);
			break;
		case SHAPE_TYPES.IMAGE:
			if (!option.imgPath) {
				shape = (
					<Group>
						<Rect
							{...{
								name: option.name,
								x: option.x,
								y: option.y,
								width: MAPS.containerWidth[SHAPE_TYPES.IMAGE] * option.zoomScale,
								height: MAPS.containerHeight[SHAPE_TYPES.IMAGE] * option.zoomScale,
								scaleX: option.scaleX,
								scaleY: option.scaleY,
								fill: '#d9d9d9',
								draggable: true,
								onTransform: option.onTransform,
								onTransformEnd: option.onTransformEnd,
								onDblClick: option.onDblClick,
								onMouseOver: () => {
									document.body.style.cursor = 'pointer';
								},
								onMouseOut: () => {
									document.body.style.cursor = 'default';
								},
							}}
						/>
						<Image
							{...{
								x: option.x + ((SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH - SIZES.DEFAULT_IMAGE_WIDTH) * option.scaleX * option.zoomScale) / 2,
								y: option.y + ((SIZES.DEFAULT_IMAGE_CONTAINER_HEIGHT - SIZES.DEFAULT_IMAGE_HEIGHT) * option.scaleY * option.zoomScale) / 2,
								width: SIZES.DEFAULT_IMAGE_WIDTH * option.zoomScale,
								height: SIZES.DEFAULT_IMAGE_HEIGHT * option.zoomScale,
								scaleX: option.scaleX,
								scaleY: option.scaleY,
								image: option.image,
								onMouseOver: () => {
									document.body.style.cursor = 'pointer';
								},
								onMouseOut: () => {
									document.body.style.cursor = 'default';
								},
							}}
						/>
						{option.selected ? (
							<Fragment>
								<Rect
									{...{
										x: option.x + (SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.scaleX * option.zoomScale - 120) / 2,
										y: option.y - 30,
										width: 120,
										height: 24,
										fill: '#5085E3',
										cornerRadius: 16,
										onMouseOver: () => {
											document.body.style.cursor = 'pointer';
										},
										onMouseOut: () => {
											document.body.style.cursor = 'default';
										},
									}}
								/>
								<Text
									{...{
										x: option.x + (SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.scaleX * option.zoomScale - 120) / 2,
										y: option.y - 30,
										width: 120,
										height: 24,
										lineHeight: 2,
										align: 'center',
										fontSize: 12,
										fill: 'white',
										text: '双击更换图片',
										onMouseOver: () => {
											document.body.style.cursor = 'pointer';
										},
										onMouseOut: () => {
											document.body.style.cursor = 'default';
										},
									}}
								/>
							</Fragment>
						) : null}
					</Group>
				);
			} else {
				shape = (
					<Group>
						<Image
							{...{
								name: option.name,
								x: option.x,
								y: option.y,
								width: SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.zoomScale,
								height: SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.ratio * option.zoomScale,
								scaleX: option.scaleX,
								scaleY: option.scaleY,
								image: option.image,
								ratio: option.ratio,
								draggable: true,
								onTransform: option.onTransform,
								onTransformEnd: option.onTransformEnd,
								onDblClick: option.onDblClick,
								onMouseOver: () => {
									document.body.style.cursor = 'pointer';
								},
								onMouseOut: () => {
									document.body.style.cursor = 'default';
								},
							}}
						/>
						{option.selected ? (
							<Fragment>
								<Rect
									{...{
										x: option.x + (SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.scaleX * option.zoomScale - 180) / 2,
										y: option.y - 50,
										width: 180,
										height: 32,
										fill: '#5085E3',
										cornerRadius: 16,
										onMouseOver: () => {
											document.body.style.cursor = 'pointer';
										},
										onMouseOut: () => {
											document.body.style.cursor = 'default';
										},
									}}
								/>
								<Text
									{...{
										x: option.x + (SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.scaleX * option.zoomScale - 180) / 2,
										y: option.y - 50,
										width: 180,
										height: 32,
										lineHeight: 2.5,
										align: 'center',
										fontSize: 14,
										fill: 'white',
										text: '双击更换图片',
										onMouseOver: () => {
											document.body.style.cursor = 'pointer';
										},
										onMouseOut: () => {
											document.body.style.cursor = 'default';
										},
									}}
								/>
							</Fragment>
						) : null}
					</Group>
				);
			}
			break;
		case SHAPE_TYPES.PRICE_NORMAL_WHITE:
		case SHAPE_TYPES.PRICE_NORMAL_BLACK:
			shape = (
				<Group>
					<Rect
						{...{
							name: option.name,
							x: option.x,
							y: option.y,
							width: MAPS.containerWidth[option.type] * option.zoomScale,
							height: MAPS.containerHeight[option.type] * option.zoomScale,
							scaleX: option.scaleX,
							scaleY: option.scaleY,
							fill: option.backgroundColor,
							opacity: option.backgroundColor === 'opacity' ? 0 : 1,
							draggable: true,
							onTransform: option.onTransform,
							onTransformEnd: option.onTransformEnd,
							onDblClick: option.onDblClick,
							onMouseOver: () => {
								document.body.style.cursor = 'pointer';
							},
							onMouseOut: () => {
								document.body.style.cursor = 'default';
							},
						}}
					/>
					<Text
						{...{
							name: option.name,
							x: option.x,
							y: option.y,
							text: option.content,
							fontFamily: option.fontFamily,
							fontSize: option.fontSize * option.zoomScale,
							fontStyle: initFontStyle(option),
							textDecoration: initTextDecoration(option),
							fill: option.fontColor,
							align: option.align,
							letterSpacing: option.letterSpacing,
							width: MAPS.containerWidth[option.type] * option.scaleX * option.zoomScale,
							height: MAPS.containerHeight[option.type] * option.zoomScale,
							// lineHeight: (MAPS.containerHeight[option.type] * option.scaleY) / option.fontSize,
							draggable: true,
							onDblClick: option.onDblClick,
							onMouseOver: () => {
								document.body.style.cursor = 'pointer';
							},
							onMouseOut: () => {
								document.body.style.cursor = 'default';
							},
						}}
					/>
				</Group>
			);
			break;
		case SHAPE_TYPES.PRICE_SUPER_WHITE:
		case SHAPE_TYPES.PRICE_SUPER_BLACK:
			shape = (
				<Group>
					<Rect
						{...{
							name: option.name,
							x: option.x,
							y: option.y,
							width: MAPS.containerWidth[option.type] * option.zoomScale,
							height: MAPS.containerHeight[option.type] * option.zoomScale,
							scaleX: option.scaleX,
							scaleY: option.scaleY,
							fill: option.backgroundColor,
							opacity: option.backgroundColor === 'opacity' ? 0 : 1,
							draggable: true,
							onTransform: option.onTransform,
							onTransformEnd: option.onTransformEnd,
							onDblClick: option.onDblClick,
							onMouseOver: () => {
								document.body.style.cursor = 'pointer';
							},
							onMouseOut: () => {
								document.body.style.cursor = 'default';
							},
						}}
					/>
					<Shape
						{...{
							name: option.name,
							x: option.x,
							y: option.y,
							onDblClick: option.onDblClick,
							onMouseOver: () => {
								document.body.style.cursor = 'pointer';
							},
							onMouseOut: () => {
								document.body.style.cursor = 'default';
							},
							sceneFunc(context) {
								const intPriceText = `${option.content}`.split('.')[0];
								const smallPriceText = `${option.content}`.split('.')[1] || '';
								// const yPosition = ((MAPS.containerHeight[option.type] * option.scaleY - option.fontSize) * option.zoomScale) / 2;
								const yPosition = 5;
								const intTextWidth = (option.fontSize / 2) * (intPriceText.length + (smallPriceText ? 0.7 : 0)) * option.zoomScale;
								const textWidth = intTextWidth + ((smallPriceText.length * option.smallFontSize) / 2) * option.zoomScale;
								let intXPosition = 0;
								const totalWidth = MAPS.containerWidth[option.type] * option.scaleX * option.zoomScale;
								if (option.align === 'center') {
									intXPosition = (totalWidth - textWidth) / 2;
								}
								if (option.align === 'right') {
									intXPosition = totalWidth - textWidth;
								}
								const smallXPosition = intXPosition + intTextWidth;

								const rectWidth = MAPS.containerWidth[option.type] * option.zoomScale * option.scaleX;
								if (rectWidth > textWidth) {
									context.font = `${initFontStyle(option)} ${option.fontSize * option.zoomScale}px ${option.fontFamily}`;
									context.textBaseline = 'hanging';
									context.fillStyle = option.fontColor;
									context.fillText(`${option.content ? `${intPriceText}${smallPriceText ? '.' : ''}` : ''}`, intXPosition, yPosition);
									context.font = `${initFontStyle(option)} ${option.smallFontSize * option.zoomScale}px ${option.fontFamily}`;
									context.fillText(`${option.content ? smallPriceText : ''}`, smallXPosition, yPosition);
									if (initTextDecoration(option) === 'line-through') {
										context.fillRect(intXPosition, yPosition + option.fontSize * option.zoomScale * 0.7 / 2, textWidth, 1 * option.zoomScale);
									} else if (initTextDecoration(option) === 'underline') {
										context.fillRect(intXPosition, yPosition + option.fontSize * option.zoomScale * 0.7, textWidth, 1 * option.zoomScale);
									}
								} else if (rectWidth > intTextWidth) {
									const leaveLength = Math.floor((rectWidth - intTextWidth) / option.zoomScale / option.smallFontSize * 2);
									context.font = `${initFontStyle(option)} ${option.fontSize * option.zoomScale}px ${option.fontFamily}`;
									context.textBaseline = 'hanging';
									context.fillStyle = option.fontColor;
									context.fillText(`${option.content ? `${intPriceText}${smallPriceText ? '.' : ''}` : ''}`, intXPosition, yPosition);
									context.font = `${initFontStyle(option)} ${option.smallFontSize * option.zoomScale}px ${option.fontFamily}`;
									context.fillText(`${option.content ? smallPriceText.substr(0, leaveLength) : ''}`, smallXPosition, yPosition);
									if (initTextDecoration(option) === 'line-through') {
										context.fillRect(intXPosition, yPosition + option.fontSize * option.zoomScale * 0.7 / 2, textWidth, 1 * option.zoomScale);
									} else if (initTextDecoration(option) === 'underline') {
										context.fillRect(intXPosition, yPosition + option.fontSize * option.zoomScale * 0.7, textWidth, 1 * option.zoomScale);
									}
								} else if (rectWidth > (option.fontSize / 2 * intPriceText.length * option.zoomScale)) {
									context.font = `${initFontStyle(option)} ${option.fontSize * option.zoomScale}px ${option.fontFamily}`;
									context.textBaseline = 'hanging';
									context.fillStyle = option.fontColor;
									context.fillText(`${option.content ? `${intPriceText}` : ''}`, intXPosition, yPosition);
								} else {
									const leaveLength = Math.floor(rectWidth / option.zoomScale / option.fontSize * 2);

									context.font = `${initFontStyle(option)} ${option.fontSize * option.zoomScale}px ${option.fontFamily}`;
									context.textBaseline = 'hanging';
									context.fillStyle = option.fontColor;
									context.fillText(`${option.content ? `${intPriceText.substr(0, leaveLength)}` : ''}`, intXPosition, yPosition);
								}
							},
						}}
					/>
				</Group>
			);
			break;
		case SHAPE_TYPES.PRICE_SUB_WHITE:
		case SHAPE_TYPES.PRICE_SUB_BLACK:
			shape = (
				<Group>
					<Rect
						{...{
							name: option.name,
							x: option.x,
							y: option.y,
							width: MAPS.containerWidth[option.type] * option.zoomScale,
							height: MAPS.containerHeight[option.type] * option.zoomScale,
							scaleX: option.scaleX,
							scaleY: option.scaleY,
							fill: option.backgroundColor,
							opacity: option.backgroundColor === 'opacity' ? 0 : 1,
							draggable: true,
							onTransform: option.onTransform,
							onTransformEnd: option.onTransformEnd,
							onDblClick: option.onDblClick,
							onMouseOver: () => {
								document.body.style.cursor = 'pointer';
							},
							onMouseOut: () => {
								document.body.style.cursor = 'default';
							},
						}}
					/>
					<Shape
						{...{
							name: option.name,
							x: option.x,
							y: option.y,
							onDblClick: option.onDblClick,
							onMouseOver: () => {
								document.body.style.cursor = 'pointer';
							},
							onMouseOut: () => {
								document.body.style.cursor = 'default';
							},
							sceneFunc(context) {
								const intPriceText = `${option.content}`.split('.')[0];
								const smallPriceText = `${option.content}`.split('.')[1] || '';
								// const yPosition = ((MAPS.containerHeight[option.type] * option.scaleY + option.fontSize) * option.zoomScale) / 2;
								const yPosition = option.fontSize * option.zoomScale * 0.72 + 5;
								const intTextWidth = (option.fontSize / 2) * (intPriceText.length + (smallPriceText ? 0.7 : 0)) * option.zoomScale;
								const textWidth = intTextWidth + ((smallPriceText.length * option.smallFontSize) / 2) * option.zoomScale;
								let intXPosition = 0;
								if (option.align === 'center') {
									intXPosition = (MAPS.containerWidth[option.type] * option.scaleX * option.zoomScale - textWidth) / 2;
								}
								if (option.align === 'right') {
									intXPosition = MAPS.containerWidth[option.type] * option.scaleX * option.zoomScale - textWidth;
								}
								const smallXPosition = intXPosition + intTextWidth;

								const rectWidth = MAPS.containerWidth[option.type] * option.zoomScale * option.scaleX;
								if (rectWidth > textWidth) {
									context.font = `${initFontStyle(option)} ${option.fontSize * option.zoomScale}px ${option.fontFamily}`;
									context.textBaseline = 'alphabetic';
									context.fillStyle = option.fontColor;
									context.fillText(`${option.content ? `${intPriceText}${smallPriceText ? '.' : ''}` : ''}`, intXPosition, yPosition);
									context.font = `${initFontStyle(option)} ${option.smallFontSize * option.zoomScale}px ${option.fontFamily}`;
									context.fillText(`${option.content ? smallPriceText : ''}`, smallXPosition, yPosition);
									if (initTextDecoration(option) === 'line-through') {
										context.fillRect(intXPosition, yPosition - option.fontSize * option.zoomScale * 0.7 / 2, textWidth, 1 * option.zoomScale);
									} else if (initTextDecoration(option) === 'underline') {
										context.fillRect(intXPosition, yPosition, textWidth, 1 * option.zoomScale);
									}
								} else if (rectWidth > intTextWidth) {
									const leaveLength = Math.floor((rectWidth - intTextWidth) / option.zoomScale / option.smallFontSize * 2);

									context.font = `${initFontStyle(option)} ${option.fontSize * option.zoomScale}px ${option.fontFamily}`;
									context.textBaseline = 'alphabetic';
									context.fillStyle = option.fontColor;
									context.fillText(`${option.content ? `${intPriceText}${smallPriceText ? '.' : ''}` : ''}`, intXPosition, yPosition);
									context.font = `${initFontStyle(option)} ${option.smallFontSize * option.zoomScale}px ${option.fontFamily}`;
									context.fillText(`${option.content ? smallPriceText.substr(0, leaveLength) : ''}`, smallXPosition, yPosition);
									if (initTextDecoration(option) === 'line-through') {
										context.fillRect(intXPosition, yPosition - option.fontSize * option.zoomScale * 0.7 / 2, textWidth, 1 * option.zoomScale);
									} else if (initTextDecoration(option) === 'underline') {
										context.fillRect(intXPosition, yPosition, textWidth, 1 * option.zoomScale);
									}
								} else if (rectWidth > (option.fontSize / 2 * intPriceText.length * option.zoomScale)) {
									context.font = `${initFontStyle(option)} ${option.fontSize * option.zoomScale}px ${option.fontFamily}`;
									context.textBaseline = 'alphabetic';
									context.fillStyle = option.fontColor;
									context.fillText(`${option.content ? `${intPriceText}` : ''}`, intXPosition, yPosition);
								} else {
									const leaveLength = Math.floor(rectWidth / option.zoomScale / option.fontSize * 2);

									context.font = `${initFontStyle(option)} ${option.fontSize * option.zoomScale}px ${option.fontFamily}`;
									context.textBaseline = 'alphabetic';
									context.fillStyle = option.fontColor;
									context.fillText(`${option.content ? `${intPriceText.substr(0, leaveLength)}` : ''}`, intXPosition, yPosition);
								}
							},
						}}
					/>
				</Group>
			);
			break;
		case SHAPE_TYPES.CODE_H:
		case SHAPE_TYPES.CODE_QR:
			shape = (
				<Image
					{...{
						name: option.name,
						x: option.x,
						y: option.y,
						width: MAPS.containerWidth[option.type] * option.zoomScale,
						height: MAPS.containerHeight[option.type] * option.zoomScale,
						scaleX: option.scaleX,
						scaleY: option.scaleY,
						image: option.image,
						rotation: 0,
						draggable: true,
						onTransform: option.onTransform,
						onTransformEnd: option.onTransformEnd,
						onMouseOver: () => {
							document.body.style.cursor = 'pointer';
						},
						onMouseOut: () => {
							document.body.style.cursor = 'default';
						},
					}}
				/>
			);
			break;
		case SHAPE_TYPES.CODE_V:
			shape = (
				<Group>
					<Shape
						{...{
							name: option.name,
							x: option.x,
							y: option.y,
							width: MAPS.containerWidth[option.type] * option.zoomScale,
							height: MAPS.containerHeight[option.type] * option.zoomScale,
							scaleX: option.scaleX,
							scaleY: option.scaleY,
							sceneFunc(context) {
								context.rotate(Math.PI / 2);
								context.translate(0, -MAPS.containerWidth[option.type] * option.zoomScale);
								context.drawImage(option.image, 0, 0, MAPS.containerHeight[option.type] * option.zoomScale, MAPS.containerWidth[option.type] * option.zoomScale);
							},
							draggable: true,
							onTransform: option.onTransform,
							onTransformEnd: option.onTransformEnd,
							onMouseOver: () => {
								document.body.style.cursor = 'pointer';
							},
							onMouseOut: () => {
								document.body.style.cursor = 'default';
							},
						}}
					/>
					<Rect
						{...{
							name: option.name,
							x: option.x,
							y: option.y,
							width: MAPS.containerWidth[option.type] * option.zoomScale,
							height: MAPS.containerHeight[option.type] * option.zoomScale,
							scaleX: option.scaleX,
							scaleY: option.scaleY,
							draggable: true,
							onMouseOver: () => {
								document.body.style.cursor = 'pointer';
							},
							onMouseOut: () => {
								document.body.style.cursor = 'default';
							},
						}}
					/>
				</Group>
			);
			break;
		default:
			throw new Error(`Do not have shape of ${option.type}.`);
	}

	return <Fragment key={option.name}>{shape}</Fragment>;
}
