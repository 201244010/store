import { SHAPE_TYPES, MAPS } from '@/constants/studio';

const NEAR_GAP = 10;
export const COINCIDE_GAP = 10;

export const getTypeByName = name => name.replace(/\d+/g, '');

export let currentId = 1;

export const generatorId = type => `${type}-${currentId++}`;

export const getPositionInNearScope = (source, target) => {
	const newSource = { ...source };
	const newTarget = { ...target };
	if (newSource.type === SHAPE_TYPES.RECT_FIX || newTarget.type === SHAPE_TYPES.RECT_FIX) {
		return [];
	}
	const ret = {};
	newSource.left = newSource.x;
	newSource.top = newSource.y;
	newSource.right = newSource.x + newSource.width * newSource.scaleX;
	newSource.bottom = newSource.y + newSource.height * newSource.scaleY;
	newTarget.left = newTarget.x;
	newTarget.top = newTarget.y;
	newTarget.right = newTarget.x + newTarget.width * newTarget.scaleX;
	newTarget.bottom = newTarget.y + newTarget.height * newTarget.scaleY;

	if (
		Math.abs(newTarget.left - newSource.left) < NEAR_GAP ||
		Math.abs(newTarget.left - newSource.right) < NEAR_GAP
	) {
		ret.left = newTarget.left;
		ret.minLeftGap = Math.min(Math.abs(newTarget.left - newSource.left), Math.abs(newTarget.left - newSource.right));
	}
	if (
		Math.abs(newTarget.right - newSource.left) < NEAR_GAP ||
		Math.abs(newTarget.right - newSource.right) < NEAR_GAP
	) {
		ret.right = newTarget.right;
		ret.minRightGap = Math.min(Math.abs(newTarget.right - newSource.left), Math.abs(newTarget.right - newSource.right));
	}
	if (
		Math.abs(newTarget.top - newSource.top) < NEAR_GAP ||
		Math.abs(newTarget.top - newSource.bottom) < NEAR_GAP
	) {
		ret.top = newTarget.top;
		ret.minTopGap = Math.min(Math.abs(newTarget.top - newSource.top), Math.abs(newTarget.top - newSource.bottom));
	}
	if (
		Math.abs(newTarget.bottom - newSource.top) < NEAR_GAP ||
		Math.abs(newTarget.bottom - newSource.bottom) < NEAR_GAP
	) {
		ret.bottom = newTarget.bottom;
		ret.minBottomGap = Math.min(Math.abs(newTarget.bottom - newSource.top), Math.abs(newTarget.bottom - newSource.bottom));
	}

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
	newSource.right = newSource.x + newSource.width * newSource.scaleX;
	newSource.bottom = newSource.y + newSource.height * newSource.scaleY;
	newTarget.left = newTarget.x;
	newTarget.top = newTarget.y;
	newTarget.right = newTarget.x + newTarget.width * newTarget.scaleX;
	newTarget.bottom = newTarget.y + newTarget.height * newTarget.scaleY;

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

export const getNearestLines = (componentsDetail, selectedShapeName) => {
	let lines = [];
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
	Object.keys(componentsDetail).forEach(key => {
		if (key === selectedShapeName) {
			if (componentsDetail[key].type !== SHAPE_TYPES.RECT_FIX) {
				lines = lines.concat(componentsDetail[key].lines);
			}
		} else if (componentsDetail[key].type !== SHAPE_TYPES.RECT_FIX) {
			const scope = getPositionInNearScope(componentsDetail[selectedShapeName], componentsDetail[key]);
			if (minInScope.minLeftGap >= scope.minLeftGap) {
				minInScope.left = scope.left;
			}
			if (minInScope.minRightGap >= scope.minRightGap) {
				minInScope.right = scope.right;
			}
			if (minInScope.minTopGap >= scope.minTopGap) {
				minInScope.top = scope.top;
			}
			if (minInScope.minBottomGap >= scope.minBottomGap) {
				minInScope.bottom = scope.bottom;
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
