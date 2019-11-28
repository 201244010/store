import {IMAGE_TYPES, MAPS, SHAPE_TYPES, SIZES, RECT_SELECT_NAME, RECT_FIX_NAME} from '@/constants/studio';
import { filterObject, getLocationParam } from '@/utils/utils';
import { getImagePromise, saveNowStep, isInComponent } from '@/utils/studio';

function calculatePosition(stage, zoomScale) {
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
		noScopedComponents: [],
		zoomScale: 1
	},
	effects: {
		* changeOneStep({ payload = {} }, { put, select }) {
			const { stage, zoomScale } = yield select(state => state.studio);
			const position = calculatePosition(stage, zoomScale);
			const componentsDetail = {};
			let hasImage = false;
			Object.keys(payload).map(key => {
				componentsDetail[key] = payload[key];
				componentsDetail[key].x = componentsDetail[key].startX * zoomScale + position.x;
				componentsDetail[key].y = componentsDetail[key].startY * zoomScale + position.y;
				if (componentsDetail[key].type === SHAPE_TYPES.RECT_SELECT) {
					componentsDetail[key].width = 0;
					componentsDetail[key].height = 0;
				}
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
			const { noUpdateLines, selectedShapeName, scopedComponents, nowShapeName, isStep = false, updatePrecision = false, ...componentsDetail } = action.payload;
			const chooseShapeName = state.selectedShapeName;
			let targetShapeName = selectedShapeName;
			if (selectedShapeName === undefined) {
				targetShapeName = chooseShapeName;
			}
			if (!targetShapeName) {
				targetShapeName = nowShapeName;
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

			if (state.componentsDetail[RECT_FIX_NAME]) {
				detail.startX = ((x - state.componentsDetail[RECT_FIX_NAME].x) / state.zoomScale).toFixed();
				detail.startY = ((y - state.componentsDetail[RECT_FIX_NAME].y) / state.zoomScale).toFixed();
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
				componentsDetail: newComponentsDetail,
				scopedComponents: scopedComponents || state.scopedComponents
			};
		},
		updateComponentDetail(state, action) {
			const { componentName, detail } = action.payload;
			if (state.componentsDetail[componentName]) {
				Object.keys(detail).forEach(key => state.componentsDetail[componentName][key] = detail[key]);
			}
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
			const { scopedComponents, componentsDetail } = state;

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
			const {selectedShapeName, isStep = true} = action.payload;
			delete state.componentsDetail[selectedShapeName || action.payload];
			const copyDetail = JSON.parse(JSON.stringify(state.componentsDetail));
			if (isStep) {
				saveNowStep(getLocationParam('id'), copyDetail);
			}
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
			state.noScopedComponents = [];
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
		},
		selectComponent(state, action) {
			const { componentsDetail, scopedComponents, zoomScale } = state;
			const { componentName } = action.payload;
			const componentNames = scopedComponents.map(component => component.name);
			const component = componentsDetail[componentName];

			if (!componentNames.includes(componentName)) {
				scopedComponents.push(component);
			}

			if (!componentsDetail[RECT_SELECT_NAME]) {
				componentsDetail[RECT_SELECT_NAME] = {
					type: SHAPE_TYPES.RECT_SELECT,
					name: RECT_SELECT_NAME,
					background: '#5cadff',
					scaleX: 1,
					scaleY: 1,
					zoomScale,
					rotation: 0,
					opacity: 0.2,
				};

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

				componentsDetail[RECT_SELECT_NAME].left = component.left;
				componentsDetail[RECT_SELECT_NAME].top = component.top;
				componentsDetail[RECT_SELECT_NAME].right = component.right;
				componentsDetail[RECT_SELECT_NAME].bottom = component.bottom;
				componentsDetail[RECT_SELECT_NAME].x = component.left;
				componentsDetail[RECT_SELECT_NAME].y = component.top;
				componentsDetail[RECT_SELECT_NAME].width = component.right - component.left;
				componentsDetail[RECT_SELECT_NAME].height = component.bottom - component.top;
			} else {
				const bound = {};
				scopedComponents.forEach(item => {
					if (item.name) {
						const curItem = componentsDetail[item.name];
						const realWidth = MAPS.containerWidth[curItem.type] * zoomScale * (curItem.scaleX || 1);
						let realHeight = MAPS.containerHeight[curItem.type] * zoomScale * (curItem.scaleY || 1);

						// 上传过图片的IMAGE组件高度需要特殊处理
						if (curItem.type === SHAPE_TYPES.IMAGE && curItem.imgPath) {
							realHeight = realWidth * curItem.ratio;
						}
						curItem.left = curItem.x;
						curItem.top = curItem.y;
						curItem.right = curItem.x + realWidth;
						curItem.bottom = curItem.y + realHeight;
						if (!bound.left || bound.left > curItem.left) {
							bound.left = curItem.left;
						}
						if (!bound.top || bound.top > curItem.top) {
							bound.top = curItem.top;
						}
						if (!bound.right || bound.right < curItem.right) {
							bound.right = curItem.right;
						}
						if (!bound.bottom || bound.bottom < curItem.bottom) {
							bound.bottom = curItem.bottom;
						}
					}
				});
				state.selectedShapeName = RECT_SELECT_NAME;
				componentsDetail[RECT_SELECT_NAME].left = bound.left;
				componentsDetail[RECT_SELECT_NAME].top = bound.top;
				componentsDetail[RECT_SELECT_NAME].right = bound.right;
				componentsDetail[RECT_SELECT_NAME].bottom = bound.bottom;
				componentsDetail[RECT_SELECT_NAME].x = bound.left;
				componentsDetail[RECT_SELECT_NAME].y = bound.top;
				componentsDetail[RECT_SELECT_NAME].width = bound.right - bound.left;
				componentsDetail[RECT_SELECT_NAME].height = bound.bottom - bound.top;
			}

			state.noScopedComponents = [];
			const scopedNames = scopedComponents.map(item => item.name);
			Object.keys(componentsDetail).forEach(name => {
				if (name && (name !== RECT_SELECT_NAME && name.indexOf(SHAPE_TYPES.RECT_FIX) === -1)) {
					const cd = componentsDetail[name];
					const realWidth = MAPS.containerWidth[cd.type] * zoomScale * (cd.scaleX || 1);
					let realHeight = MAPS.containerHeight[cd.type] * zoomScale * (cd.scaleY || 1);

					if (cd.type === SHAPE_TYPES.IMAGE && cd.imgPath) {
						realHeight = realWidth * cd.ratio;
					}
					cd.left = cd.x;
					cd.top = cd.y;
					cd.right = cd.x + realWidth;
					cd.bottom = cd.y + realHeight;
					if (isInComponent(cd, componentsDetail[RECT_SELECT_NAME]) && !scopedNames.includes(cd.name)) {
						state.noScopedComponents.push(componentsDetail[name]);
					}
				}
			});
		},
		resetScopedComponents(state) {
			state.scopedComponents = [];
			if (state.componentsDetail[RECT_SELECT_NAME]) {
				state.componentsDetail[RECT_SELECT_NAME].width = 0;
				state.componentsDetail[RECT_SELECT_NAME].height = 0;
			}
		}
	}
};
