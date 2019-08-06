import localForage from 'localforage';
import {
	SHAPE_TYPES,
	MAPS,
	RECT_FIX_NAME,
	RECT_SELECT_NAME,
	NON_NORMAL_PRICE_TYPES,
	NORMAL_PRICE_TYPES,
	BARCODE_TYPES,
	CODE_TYPES
} from '@/constants/studio';

const NEAR_GAP = 10;
export const COINCIDE_GAP = 10;

export const getTypeByName = name => name.replace(/\d+/g, '');

export let currentId = 1;

export const generatorId = type => `${type}-${currentId++}`;

export const getPositionInNearScope = (source, target, scopedPosition) => {
	const newSource = { ...source };
	const newTarget = { ...target };
	if (newSource.type === SHAPE_TYPES.RECT_FIX || newTarget.type === SHAPE_TYPES.RECT_FIX) {
		return [];
	}

	const ret = {};
	let sourceWidth = 0;
	let sourceHeight = 0;
	if (newSource.type === SHAPE_TYPES.RECT_SELECT) {
		sourceWidth = newSource.width;
		sourceHeight = newSource.height;
		newSource.left = scopedPosition.x;
		newSource.top = scopedPosition.y;
	} else {
		sourceWidth = MAPS.containerWidth[newSource.type] * newSource.scaleX * newSource.zoomScale;
		sourceHeight = MAPS.containerHeight[newSource.type] * newSource.scaleY * newSource.zoomScale;
		newSource.left = newSource.x;
		newSource.top = newSource.y;
	}
	newSource.right = newSource.left + sourceWidth;
	newSource.bottom = newSource.top + sourceHeight;
	newTarget.left = newTarget.x;
	newTarget.top = newTarget.y;
	newTarget.right = newTarget.left + MAPS.containerWidth[newTarget.type] * newTarget.scaleX * newTarget.zoomScale;
	newTarget.bottom = newTarget.top + MAPS.containerHeight[newTarget.type] * newTarget.scaleY * newTarget.zoomScale;

	const leftToLeft = Math.abs(newTarget.left - newSource.left);
	const leftToRight = Math.abs(newTarget.left - newSource.right);
	if (leftToLeft < NEAR_GAP || leftToRight < NEAR_GAP) {
		ret.left = newTarget.left;
		ret.minLeftGap = Math.min(leftToLeft, leftToRight);
		if (leftToLeft <= leftToRight) {
			ret.hasLeft = true;
		} else {
			ret.hasRight = true;
		}
	}

	const rightToLeft = Math.abs(newTarget.right - newSource.left);
	const rightToRight = Math.abs(newTarget.right - newSource.right);
	if (rightToLeft < NEAR_GAP || rightToRight < NEAR_GAP) {
		ret.right = newTarget.right;
		ret.minRightGap = Math.min(rightToLeft, rightToRight);
		if (rightToLeft <= rightToRight) {
			ret.hasLeft = true;
		} else {
			ret.hasRight = true;
		}
	}

	const topToTop = Math.abs(newTarget.top - newSource.top);
	const topToBottom = Math.abs(newTarget.top - newSource.bottom);
	if (topToTop < NEAR_GAP || topToBottom < NEAR_GAP) {
		ret.top = newTarget.top;
		ret.minTopGap = Math.min(topToTop, topToBottom);
		if (topToTop <= topToBottom) {
			ret.hasTop = true;
		} else {
			ret.hasBottom = true;
		}
	}

	const bottomToTop = Math.abs(newTarget.bottom - newSource.top);
	const bottomToBottom = Math.abs(newTarget.bottom - newSource.bottom);
	if (bottomToTop < NEAR_GAP || bottomToBottom < NEAR_GAP) {
		ret.bottom = newTarget.bottom;
		ret.minBottomGap = Math.min(bottomToTop, bottomToBottom);
		if (bottomToTop <= bottomToBottom) {
			ret.hasTop = true;
		} else {
			ret.hasBottom = true;
		}
	}

	console.log('ret', ret);
	return ret;
};

export const getPositionInCoincideScope = (source, target) => {
	const newSource = { ...source };
	const newTarget = { ...target };
	if (newSource.type === SHAPE_TYPES.RECT_FIX || newTarget.type === SHAPE_TYPES.RECT_FIX) {
		return [];
	}
	const ret = {};
	newSource.left = newSource.x;
	newSource.top = newSource.y;
	newSource.right = newSource.x + MAPS.containerWidth[newSource.type] * newSource.scaleX * newSource.zoomScale;
	newSource.bottom = newSource.y + MAPS.containerHeight[newSource.type] * newSource.scaleY * newSource.zoomScale;
	newTarget.left = newTarget.x;
	newTarget.top = newTarget.y;
	newTarget.right = newTarget.x + MAPS.containerWidth[newTarget.type] * newTarget.scaleX * newTarget.zoomScale;
	newTarget.bottom = newTarget.y + MAPS.containerHeight[newTarget.type] * newTarget.scaleY * newTarget.zoomScale;

	if (Math.abs(newTarget.left - newSource.left) < COINCIDE_GAP) {
		ret.left = newSource.left;
		ret.hLeftGap = Math.abs(newTarget.left - newSource.left);
		ret.x = newSource.x + newTarget.left - newSource.left;
	}
	if (Math.abs(newTarget.left - newSource.right) < COINCIDE_GAP) {
		ret.left = newSource.right;
		ret.hLeftGap = Math.abs(newTarget.left - newSource.right);
		ret.x = newSource.x + newTarget.left - newSource.right;
	}
	if (Math.abs(newTarget.right - newSource.left) < COINCIDE_GAP) {
		ret.right = newSource.left;
		ret.hRightGap = Math.abs(newTarget.right - newSource.left);
		ret.x = newSource.x + newTarget.right - newSource.left;
	}
	if (Math.abs(newTarget.right - newSource.right) < COINCIDE_GAP) {
		ret.right = newSource.right;
		ret.hRightGap = Math.abs(newTarget.right - newSource.right);
		ret.x = newSource.x + newTarget.right - newSource.right;
	}
	if (Math.abs(newTarget.top - newSource.top) < COINCIDE_GAP) {
		ret.top = newSource.top;
		ret.vTopGap = Math.abs(newTarget.top - newSource.top);
		ret.y = newSource.y + newTarget.top - newSource.top;
	}
	if (Math.abs(newTarget.top - newSource.bottom) < COINCIDE_GAP) {
		ret.top = newSource.bottom;
		ret.vTopGap = Math.abs(newTarget.top - newSource.bottom);
		ret.y = newSource.y + newTarget.top - newSource.bottom;
	}
	if (Math.abs(newTarget.bottom - newSource.top) < COINCIDE_GAP) {
		ret.bottom = newSource.top;
		ret.vBottomGap = Math.abs(newTarget.bottom - newSource.top);
		ret.y = newSource.y + newTarget.bottom - newSource.top;
	}
	if (Math.abs(newTarget.bottom - newSource.bottom) < COINCIDE_GAP) {
		ret.bottom = newSource.bottom;
		ret.vBottomGap = Math.abs(newTarget.bottom - newSource.bottom);
		ret.y = newSource.y + newTarget.bottom - newSource.bottom;
	}

	return ret;
};

export const getNearestLines = (componentsDetail, selectedShapeName, scopedComponents) => {
	const lines = [];
	if (!selectedShapeName) {
		return lines;
	}
	const minInScope = {
		left: 10000,
		minLeftGap: 10000,
		right: 10000,
		minRightGap: 10000,
		top: 10000,
		minTopGap: 10000,
		bottom: 10000,
		minBottomGap: 10000
	};

	const scopedKeys = [];
	const scopedPosition = {};
	if (selectedShapeName.indexOf(SHAPE_TYPES.RECT_SELECT) > -1) {
		scopedComponents.forEach((detail) => {
			if (detail.name) {
				scopedKeys.push(detail.name);
				const curDetail = componentsDetail[detail.name];

				if (curDetail) {
					if (!scopedPosition.x || scopedPosition.x > curDetail.x) {
						scopedPosition.x = curDetail.x;
					}
					if (!scopedPosition.y || scopedPosition.y > curDetail.y) {
						scopedPosition.y = curDetail.y;
					}
				}
			}
		});
	}

	Object.keys(componentsDetail).forEach(key => {
		if (componentsDetail[key].type && componentsDetail[key].type !== SHAPE_TYPES.RECT_FIX &&
			key !== selectedShapeName && !scopedKeys.includes(key)) {
			const scope = getPositionInNearScope(componentsDetail[selectedShapeName], componentsDetail[key], scopedPosition);
			if (minInScope.minLeftGap >= scope.minLeftGap) {
				minInScope.left = scope.left;
				minInScope.hasLeft = scope.hasLeft;
				minInScope.hasRight = scope.hasRight;
			}
			if (minInScope.minRightGap >= scope.minRightGap) {
				minInScope.right = scope.right;
				minInScope.hasLeft = scope.hasLeft;
				minInScope.hasRight = scope.hasRight;
			}
			if (minInScope.minTopGap >= scope.minTopGap) {
				minInScope.top = scope.top;
				minInScope.hasTop = scope.hasTop;
				minInScope.hasBottom = scope.hasBottom;
			}
			if (minInScope.minBottomGap >= scope.minBottomGap) {
				minInScope.bottom = scope.bottom;
				minInScope.hasTop = scope.hasTop;
				minInScope.hasBottom = scope.hasBottom;
			}
		}
	});
	if (minInScope.left < 10000) {
		lines.push([minInScope.left, 0, minInScope.left, 10000]);
	}
	if (minInScope.right < 10000) {
		lines.push([minInScope.right, 0, minInScope.right, 10000]);
	}
	if (minInScope.top < 10000) {
		lines.push([0, minInScope.top, 10000, minInScope.top]);
	}
	if (minInScope.bottom < 10000) {
		lines.push([0, minInScope.bottom, 10000, minInScope.bottom]);
	}
	if (minInScope.hasLeft) {
		lines.push(componentsDetail[selectedShapeName].lines[0]);
	}
	if (minInScope.hasRight) {
		lines.push(componentsDetail[selectedShapeName].lines[1]);
	}
	if (minInScope.hasTop) {
		lines.push(componentsDetail[selectedShapeName].lines[2]);
	}
	if (minInScope.hasBottom) {
		lines.push(componentsDetail[selectedShapeName].lines[3]);
	}
	return lines;
};

export const getNearestPosition = (componentsDetail, selectedShapeName) => {
	const minInScope = {
		left: 10000,
		hLeftGap: 10000,
		right: 10000,
		hRightGap: 10000,
		top: 10000,
		vTopGap: 10000,
		bottom: 10000,
		vBottomGap: 10000
	};
	Object.keys(componentsDetail).forEach(key => {
		if (selectedShapeName && key !== selectedShapeName && componentsDetail[key].type !== SHAPE_TYPES.RECT_FIX) {
			const scope = getPositionInCoincideScope(componentsDetail[selectedShapeName], componentsDetail[key]);
			if (minInScope.hLeftGap >= scope.hLeftGap) {
				minInScope.left = scope.left;
				minInScope.x = scope.x;
			}
			if (minInScope.hRightGap >= scope.hRightGap) {
				minInScope.right = scope.right;
				minInScope.x = scope.x;
			}
			if (minInScope.vTopGap >= scope.vTopGap) {
				minInScope.top = scope.top;
				minInScope.y = scope.y;
			}
			if (minInScope.vBottomGap >= scope.vBottomGap) {
				minInScope.bottom = scope.bottom;
				minInScope.y = scope.y;
			}
		}
	});
	return minInScope;
};

export const isInComponent = (source, target) => source.left > target.left && source.right < target.right && source.top > target.top && source.bottom < target.bottom;

export const getImagePromise = componentDetail =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => {
			componentDetail.image = image;
			resolve(componentDetail);
		};
		image.onerror = error => {
			reject(error);
		};
		image.src = componentDetail.imgPath || MAPS.imgPath[componentDetail.type];
	});

export const STEP_KEYS = {};
export const NOW_KEYS = {};

export const clearSteps = () => {
	localForage.clear();
};

export const saveNowStep = async (templateId, componentsDetail) => {
	let nowKey;
	if (!STEP_KEYS[templateId]) {
		STEP_KEYS[templateId] = [];
		nowKey = templateId * 1000 + 1;
	} else {
		nowKey = Number(STEP_KEYS[templateId][STEP_KEYS[templateId].length - 1]) + 1;
	}
	STEP_KEYS[templateId].push(nowKey);
	NOW_KEYS[templateId] = nowKey;

	const keys = await localForage.keys();
	if (keys.length >= 30) {
		await localForage.removeItem(keys[0]);
	}
	await localForage.setItem(nowKey, JSON.stringify(componentsDetail));
};

export const preStep = async (templateId) => {
	const nowKey = NOW_KEYS[templateId];
	const result = await localForage.getItem(nowKey - 1);
	if (result) {
		NOW_KEYS[templateId] = nowKey - 1;
	}
	return result;
};

export const nextStep = async (templateId) => {
	const nowKey = NOW_KEYS[templateId];
	const result = await localForage.getItem(nowKey + 1);
	if (result) {
		NOW_KEYS[templateId] = nowKey + 1;
	}
	return result;
};

export const initTemplateDetail = (stage, layers, zoomScale, screenType) => {
	const type = SHAPE_TYPES.RECT_FIX;
	const {width, height} = MAPS.screen[screenType];
	const x = (stage.width - width * zoomScale) / 2;
	const y = (stage.height - height * zoomScale) / 2;

	layers.map(layer => {
		layer.x = layer.startX * zoomScale + x;
		layer.y = layer.startY * zoomScale + y;
		layer.zoomScale = zoomScale;
		if (layer.underline && layer.strikethrough) {
			layer.strikethrough = 0;
		}
		if (layer.bindField && layer.bindField.indexOf('{{') > -1) {
			layer.bindField = layer.bindField.substring(2, layer.bindField.length - 2);
		} else {
			layer.bindField = undefined;
		}
		if (layer.type === SHAPE_TYPES.LINE) {
			if (layer.width > layer.height) {
				layer.type = `${layer.type}@h`;
			} else {
				layer.type = `${layer.type}@v`;
			}
		}
		if (layer.type === SHAPE_TYPES.PRICE) {
			if (!['sup', 'sub'].includes(layer.subType)) {
				layer.subType = 'normal';
			}
			layer.type = `${layer.type}@${layer.subType}@${layer.backgroundColor}`;
		}
		if (layer.type === SHAPE_TYPES.CODE) {
			if (layer.width - layer.height > 10) {
				layer.type = `${layer.type}@h`;
			} else if (layer.width - layer.height < -10) {
				layer.type = `${layer.type}@v`;
			} else {
				layer.type = `${layer.type}@qr`;
			}
		}
	});

	layers.unshift({
		type,
		name: RECT_FIX_NAME,
		screenType,
		startX: 0,
		startY: 0,
		x,
		y,
		backgroundColor: 'white',
		width,
		height,
		cornerRadius: MAPS.cornerRadius[type],
		strokeWidth: MAPS.strokeWidth[type],
		strokeColor: MAPS.strokeColor[type],
		scaleX: 1,
		scaleY: 1,
		rotation: 0,
	});
};

export const purifyJsonOfBackEnd = (componentsDetail) => {
	const layers = [];
	const originOffset = {};
	const bindFields = [];

	originOffset.x = componentsDetail[RECT_FIX_NAME].x;
	originOffset.y = componentsDetail[RECT_FIX_NAME].y;
	delete componentsDetail[RECT_SELECT_NAME];
	delete componentsDetail[RECT_FIX_NAME];

	Object.keys(componentsDetail).map(key => {
		const componentDetail = componentsDetail[key];

		componentDetail.scaleX = componentDetail.scaleX || 1;
		componentDetail.scaleY = componentDetail.scaleY || 1;

		if (componentDetail.type === SHAPE_TYPES.RECT_FIX) {
			originOffset.x = componentDetail.x;
			originOffset.y = componentDetail.y;
		}
		if (componentDetail.bindField) {
			bindFields.push(componentDetail.bindField);
			componentDetail.bindField = `{{${componentDetail.bindField}}}`;
		} else {
			componentDetail.bindField = componentDetail.content;
		}

		// 计算height, width
		if (SHAPE_TYPES.IMAGE === componentDetail.type) {
			const backWidth = Math.round(MAPS.containerWidth[componentDetail.type] * componentDetail.scaleX);
			componentDetail.width = backWidth;
			componentDetail.height = backWidth * componentDetail.ratio;
		} else {
			componentDetail.width = Math.round(MAPS.containerWidth[componentDetail.type] * componentDetail.scaleX);
			componentDetail.height = Math.round(MAPS.containerHeight[componentDetail.type] * componentDetail.scaleY);
		}

		// 图片，条码及二维码 codec 处理
		if (BARCODE_TYPES.includes(componentDetail.type)) {
			componentDetail.codec = componentDetail.type === SHAPE_TYPES.CODE_QR ? 'qrcode' : componentDetail.codec;
		}
		if ([SHAPE_TYPES.IMAGE].includes(componentDetail.type)) {
			if (componentDetail.imgPath && componentDetail.imgPath.indexOf('.png') > -1) {
				componentDetail.codec = 'png';
			} else {
				componentDetail.codec = 'jpeg';
			}
		}

		// 计算startX, startY 等位置信息
		componentDetail.startX = ((componentDetail.x - originOffset.x) / componentDetail.zoomScale).toFixed();
		componentDetail.startY = ((componentDetail.y - originOffset.y) / componentDetail.zoomScale).toFixed();
		if (NON_NORMAL_PRICE_TYPES.includes(componentDetail.type)) {
			const intPriceText = `${componentDetail.content}`.split('.')[0];
			const smallPriceText = `${componentDetail.content}`.split('.')[1] || '';
			let backSmallStartY = 0;
			if (componentDetail.type.indexOf(SHAPE_TYPES.PRICE_SUPER)) {
				backSmallStartY = (MAPS.containerHeight[componentDetail.type] * componentDetail.scaleY - componentDetail.fontSize) / 2;
			}
			const intTextWidth = (componentDetail.fontSize / 2) * (intPriceText.length + (smallPriceText ? 0.7 : 0));
			const textWidth = intTextWidth + (smallPriceText.length * componentDetail.smallFontSize) / 2;
			let intXPosition = 0;
			if (componentDetail.align === 'center') {
				intXPosition = (MAPS.containerWidth[componentDetail.type] * componentDetail.scaleX - textWidth) / 2;
			}
			if (componentDetail.align === 'right') {
				intXPosition = MAPS.containerWidth[componentDetail.type] * componentDetail.scaleX - textWidth;
			}
			componentDetail.intStartX = Math.round(componentDetail.startX) + Math.round(intXPosition);
			componentDetail.intStartY = Math.round(componentDetail.startY) + Math.round(backSmallStartY);
			componentDetail.smallStartX = componentDetail.intStartX + Math.round(intTextWidth);
			if (componentDetail.type.indexOf(SHAPE_TYPES.PRICE_SUPER) > -1) {
				componentDetail.smallStartY = componentDetail.intStartY;
			} else {
				componentDetail.smallStartY = componentDetail.intStartY + componentDetail.fontSize - componentDetail.smallFontSize;
			}
		}

		// 处理type
		if ([SHAPE_TYPES.LINE_H, SHAPE_TYPES.LINE_V, ...CODE_TYPES].includes(componentDetail.type)) {
			componentDetail.type = componentDetail.type.split('@')[0];
		}

		if ([...NORMAL_PRICE_TYPES, ...NON_NORMAL_PRICE_TYPES].includes(componentDetail.type)) {
			const types = componentDetail.type.split('@');
			componentDetail.type = types[0];
			componentDetail.subType = types[1];
		}

		delete componentDetail.lines;
		delete componentDetail.x;
		delete componentDetail.y;

		layers.push(componentDetail);
	});

	return {
		layers,
		bindFields
	};
};
