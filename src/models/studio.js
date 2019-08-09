import {IMAGE_TYPES, MAPS, SHAPE_TYPES, SIZES, RECT_SELECT_NAME, RECT_FIX_NAME} from '@/constants/studio';
import { filterObject, getLocationParam } from '@/utils/utils';
import { getImagePromise, saveNowStep, isInComponent } from '@/utils/studio';

function calcutePosition(stage, zoomScale) {
	const screenType = getLocationParam('screen');
	const {width, height} = MAPS.screen[screenType];

	const x = (stage.width - width * zoomScale) / 2;
	const y = (stage.height - height * zoomScale) / 2;

	return {x, y};
}

export default {
	namespace: 'studio',
	state: {
		stage: {
			width: 0,
			height: 0
		},
		selectedShapeName: '',
		componentsDetail: {},
		showRightToolBox: false,
		rightToolBoxPos: {
			left: -9999,
			top: -9999
		},
		copiedComponent: {},
		scopedComponents: [],
		zoomScale: 1
	},
	effects: {
		* changeOneStep({ payload = {} }, { put, select }) {
			const { stage, zoomScale } = yield select(state => state.studio);
			const position = calcutePosition(stage, zoomScale);
			const componentsDetail = {};
			let hasImage = false;
			Object.keys(payload).map(key => {
				componentsDetail[key] = payload[key];
				componentsDetail[key].x = componentsDetail[key].startX * zoomScale + position.x;
				componentsDetail[key].y = componentsDetail[key].startY * zoomScale + position.y;
				hasImage = hasImage || IMAGE_TYPES.includes(payload[key].type);
			});

			if (hasImage) {
				(yield Promise.all(
					Object.keys(payload).map(key => {
						if (IMAGE_TYPES.includes(payload[key].type)) {
							return getImagePromise(payload[key]);
						}
						return undefined;
					}).filter(item => item)
				)).forEach(value => {
					componentsDetail[value.name].image = value.image;
				});
				yield put({
					type: 'changeStep',
					payload: componentsDetail
				});
			} else {
				yield put({
					type: 'changeStep',
					payload: componentsDetail
				});
			}
		}
	},
	reducers: {
		updateState(state, action) {
			return {
				...state,
				...action.payload
			};
		},
		addComponent(state, action) {
			// name为组件名，若被原始定义，则用，否则，则生成
			const { componentsDetail, zoomScale } = state;
			const { x, y, type, name: preName, scaleX, scaleY, isStep = true} = action.payload;
			let maxIndex = 0;
			let name = preName;

			if (name !== RECT_SELECT_NAME) {
				Object.keys(componentsDetail).forEach(key => {
					const index = parseInt(key.replace(/[^0-9]/gi, ''), 10);
					if (index >= maxIndex) {
						maxIndex = index;
					}
				});
				name = `${type}${maxIndex + 1}`;
			}
			const startX = ((x - componentsDetail[RECT_FIX_NAME].x) / zoomScale).toFixed();
			const startY = ((y - componentsDetail[RECT_FIX_NAME].y) / zoomScale).toFixed();

			const newComponentsDetail = {
				...state.componentsDetail,
				[name]: {
					...action.payload,
					name,
					width: MAPS.width[type],
					height: MAPS.height[type],
					lines: [
						[x, 0, x, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
						[
							x + MAPS.containerWidth[type] * scaleX * state.zoomScale,
							0,
							x + MAPS.containerWidth[type] * scaleX * state.zoomScale,
							SIZES.DEFAULT_MAX_CANVAS_LENGTH
						],
						[0, y, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y],
						[
							0,
							y + MAPS.containerHeight[type] * scaleY * state.zoomScale,
							SIZES.DEFAULT_MAX_CANVAS_LENGTH,
							y + MAPS.containerHeight[type] * scaleY * state.zoomScale
						]
					],
					startX,
					startY,
					zoomScale
				}
			};
			if (isStep) {
				saveNowStep(getLocationParam('id'), newComponentsDetail);
			}
			return {
				...state,
				selectedShapeName: name,
				componentsDetail: newComponentsDetail
			};
		},
		addComponentsDetail(state, action) {
			const { isStep, ...payload } = action.payload;
			const newComponentsDetail = {
				...state.componentsDetail,
				...payload
			};
			if (isStep) {
				saveNowStep(getLocationParam('id'), newComponentsDetail);
			}
			return {
				...state,
				componentsDetail: newComponentsDetail
			};
		},
		changeStep(state, action) {
			return {
				...state,
				selectedShapeName: '',
				componentsDetail: {
					...action.payload
				}
			};
		},
		updateComponentsDetail(state, action) {
			const { noUpdateLines, selectedShapeName, isStep = false, updatePrecision = false, ...componentsDetail } = action.payload;
			const chooseShapeName = state.selectedShapeName;
			let targetShapeName = selectedShapeName;
			if (selectedShapeName === undefined) {
				targetShapeName = chooseShapeName;
			}
			const detail = {
				...state.componentsDetail[targetShapeName],
				...filterObject(componentsDetail[targetShapeName] || {})
			};
			const { x, y, type } = detail;
			if (!noUpdateLines) {
				detail.lines = [
					[x, 0, x, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
					[
						x + MAPS.width[type] * detail.scaleX * state.zoomScale,
						0,
						x + MAPS.width[type] * detail.scaleX * state.zoomScale,
						SIZES.DEFAULT_MAX_CANVAS_LENGTH
					],
					[0, y, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y],
					[
						0,
						y + MAPS.height[type] * detail.scaleY * state.zoomScale,
						SIZES.DEFAULT_MAX_CANVAS_LENGTH,
						y + MAPS.height[type] * detail.scaleY * state.zoomScale
					]
				];
			}
			const newComponentsDetail = {
				...state.componentsDetail,
				[targetShapeName]: detail
			};
			if (updatePrecision) {
				newComponentsDetail[targetShapeName].content = detail.content === '' ? '' :
					((detail.type && detail.type.indexOf(SHAPE_TYPES.PRICE) > -1) ? Number(detail.content).toFixed(detail.precision) : detail.content);
			}
			if (isStep) {
				saveNowStep(getLocationParam('id'), newComponentsDetail);
			}

			return {
				...state,
				selectedShapeName: targetShapeName,
				componentsDetail: newComponentsDetail
			};
		},
		batchUpdateComponentDetail(state, action) {
			const { scopedComponents, selectedShapeName, componentsDetail } = state;
			const { x, y } = action.payload;
			const detail = componentsDetail[selectedShapeName];

			detail.lines = [
				[x, 0, x, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
				[x + detail.width, 0, x + detail.width, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
				[0, y, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y],
				[0, y + detail.height, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y + detail.height]
			];
			for (let i = 0 ; i < scopedComponents.length; i++) {
				componentsDetail[scopedComponents[i].name].x = scopedComponents[i].x + (x - detail.x);
				componentsDetail[scopedComponents[i].name].y = scopedComponents[i].y + (y - detail.y);
			}
		},
		batchUpdateScopedComponent(state) {
			const { scopedComponents, componentsDetail, } = state;

			for (let i = 0 ; i < scopedComponents.length; i++) {
				scopedComponents[i].x = componentsDetail[scopedComponents[i].name].x;
				scopedComponents[i].y = componentsDetail[scopedComponents[i].name].y;
			}
		},
		toggleRightToolBox(state, action) {
			const chooseShapeName = state.selectedShapeName;
			let { selectedShapeName } = action.payload;
			const { showRightToolBox, rightToolBoxPos } = action.payload;
			if (!selectedShapeName) {
				selectedShapeName = chooseShapeName;
			}

			return {
				...state,
				selectedShapeName,
				showRightToolBox,
				rightToolBoxPos
			};
		},
		copySelectedComponent(state, action) {
			return {
				...state,
				copiedComponent: action.payload
			};
		},
		deleteSelectedComponent(state, action) {
			state.selectedShapeName = '';
			const {
				selectedShapeName,
				// isStep = true
			} = action.payload;
			delete state.componentsDetail[selectedShapeName || action.payload];
			// TODO 放开此处代码会报错，需要定位原因，暂时注释
			// if (isStep) {
			// 	saveNowStep(getLocationParam('id'), state.componentsDetail);
			// }
		},
		zoomOutOrIn(state, action) {
			const {
				stage: { width, height },
				zoomScale: originZoomScale,
				componentsDetail
			} = state;
			const { zoomScale, screenType } = action.payload;

			const originFixRect = {};
			Object.keys(componentsDetail).map(key => {
				const componentDetail = componentsDetail[key];
				componentDetail.zoomScale = zoomScale;
				if (componentDetail.type === SHAPE_TYPES.RECT_FIX) {
					originFixRect.x = componentDetail.x;
					originFixRect.y = componentDetail.y;
				}
			});
			Object.keys(componentsDetail).map(key => {
				const componentDetail = componentsDetail[key];
				const fixRectWidth = MAPS.screen[screenType].width * zoomScale;
				const fixRectHeight = MAPS.screen[screenType].height * zoomScale;
				if (componentDetail.type === SHAPE_TYPES.RECT_FIX) {
					componentDetail.width = fixRectWidth;
					componentDetail.height = fixRectHeight;
					componentDetail.x = (width - fixRectWidth) / 2;
					componentDetail.y = (height - fixRectHeight) / 2;
				} else {
					componentDetail.x =
						(width - fixRectWidth) / 2 +
						((componentDetail.x - originFixRect.x) * zoomScale) / originZoomScale;
					componentDetail.y =
						(height - fixRectHeight) / 2 +
						((componentDetail.y - originFixRect.y) * zoomScale) / originZoomScale;
				}
			});

			state.selectedShapeName = '';
			state.zoomScale = zoomScale;
			state.componentsDetail = componentsDetail;
		},
		selectComponentIn(state) {
			const { componentsDetail, zoomScale } = state;
			const selectComponent = componentsDetail[RECT_SELECT_NAME];
			const selectRect = {
				...selectComponent,
				left: selectComponent.x,
				top: selectComponent.y,
				right: selectComponent.x + selectComponent.width * selectComponent.scaleX,
				bottom: selectComponent.y + selectComponent.height * selectComponent.scaleY
			};
			const bound = {};

			state.scopedComponents = [];
			Object.keys(componentsDetail).forEach(key => {
				if (componentsDetail[key].name && componentsDetail[key].name.indexOf(SHAPE_TYPES.RECT_FIX) === -1 && key !== RECT_SELECT_NAME) {
					const component = { ...componentsDetail[key] };
					const realWidth = MAPS.containerWidth[component.type] * zoomScale * (component.scaleX || 1);
					let realHeight = MAPS.containerHeight[component.type] * zoomScale * (component.scaleY || 1);

					// 上传过图片的IMAGE组件高度需要特殊处理
					if (component.type === SHAPE_TYPES.IMAGE && component.imgPath) {
						realHeight = realWidth * component.ratio;
					}

					component.left = component.x;
					component.top = component.y;
					component.right = component.x + realWidth;
					component.bottom = component.y + realHeight;

					if (isInComponent(component, selectRect)) {
						state.scopedComponents.push(component);

						if (!bound.left || bound.left > component.left) {
							bound.left = component.left;
						}
						if (!bound.top || bound.top > component.top) {
							bound.top = component.top;
						}
						if (!bound.right || bound.right < component.right) {
							bound.right = component.right;
						}
						if (!bound.bottom || bound.bottom < component.bottom) {
							bound.bottom = component.bottom;
						}
					}
				}
			});
			state.componentsDetail[RECT_SELECT_NAME].x = bound.left;
			state.componentsDetail[RECT_SELECT_NAME].y = bound.top;
			state.componentsDetail[RECT_SELECT_NAME].width = bound.right - bound.left;
			state.componentsDetail[RECT_SELECT_NAME].height = bound.bottom - bound.top;
		}
	}
};
