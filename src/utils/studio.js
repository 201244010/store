import { SHAPE_TYPES, MAPS } from '@/constants/studio';

const NEAR_GAP = 10;

export const getTypeByName = name => name.replace(/\d+/g, '');

export let currentId = 1;

export const generatorId = type => `${type}-${currentId++}`;

export const getNearLines = (source, target) => {
	const newSource = { ...source };
	const newTarget = { ...target };
	if (newSource.type === SHAPE_TYPES.RECT_FIX || newTarget.type === SHAPE_TYPES.RECT_FIX) {
		return [];
	}
	const ret = [];
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
		ret.push([newTarget.left, 0, newTarget.left, 10000]);
	}
	if (
		Math.abs(newTarget.right - newSource.left) < NEAR_GAP ||
		Math.abs(newTarget.right - newSource.right) < NEAR_GAP
	) {
		ret.push([newTarget.right, 0, newTarget.right, 10000]);
	}

	if (
		Math.abs(newTarget.top - newSource.top) < NEAR_GAP ||
		Math.abs(newTarget.top - newSource.bottom) < NEAR_GAP
	) {
		ret.push([0, newTarget.top, 10000, newTarget.top]);
	}
	if (
		Math.abs(newTarget.bottom - newSource.top) < NEAR_GAP ||
		Math.abs(newTarget.bottom - newSource.bottom) < NEAR_GAP
	) {
		ret.push([0, newTarget.bottom, 10000, newTarget.bottom]);
	}

	return ret;
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
