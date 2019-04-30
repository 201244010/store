import { SHAPE_TYPES } from '@/constants/studio';

const NEAR_GAP = 5;

export const getTypeByName = (name) => name.replace(/\d+/g,'');

export let currentId = 1;

export const generatorId = (type) => `${type}-${currentId++}`;

export const getNearLines = (source, target) => {
    const ret = [];
    if (source.type === SHAPE_TYPES.CIRCLE) {
        source.left = source.x - source.radius * source.scaleX;
        source.top = source.y - source.radius * source.scaleY;
        source.right = source.x + source.radius * source.scaleX;
        source.bottom = source.y + source.radius * source.scaleY;
    } else {
        source.left = source.x;
        source.top = source.y;
        source.right = source.x + source.width * source.scaleX;
        source.bottom = source.y + source.height * source.scaleY;
    }
    if (target.type === SHAPE_TYPES.CIRCLE) {
        target.left = target.x - target.radius * target.scaleX;
        target.top = target.y - target.radius * target.scaleY;
        target.right = target.x + target.radius * target.scaleX;
        target.bottom = target.y + target.radius * target.scaleY;
    } else {
        target.left = target.x;
        target.top = target.y;
        target.right = target.x + target.width * target.scaleX;
        target.bottom = target.y + target.height * target.scaleY;
    }

    if (Math.abs(target.left - source.left) < NEAR_GAP || Math.abs(target.left - source.right) < NEAR_GAP) {
        ret.push([target.left, 0, target.left, 10000]);
    }
    if (Math.abs(target.right - source.left) < NEAR_GAP || Math.abs(target.right - source.right) < NEAR_GAP) {
        ret.push([target.right, 0, target.right, 10000]);
    }

    if (Math.abs(target.top - source.top) < NEAR_GAP || Math.abs(target.top - source.bottom) < NEAR_GAP) {
        ret.push([0, target.top, 10000, target.top]);
    }
    if (Math.abs(target.bottom - source.top) < NEAR_GAP || Math.abs(target.bottom - source.bottom) < NEAR_GAP) {
        ret.push([0, target.bottom, 10000, target.bottom]);
    }

    return ret;
};

export const getImagePromise = (componentDetail) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            componentDetail.image = image;
            resolve(componentDetail);
        };
        image.onerror = (error) => {
            reject(error);
        };
        image.src = componentDetail.imageUrl || require('@/assets/studio/image.svg');
    });
