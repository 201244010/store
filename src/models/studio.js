import { MAPS, SHAPE_TYPES, SIZES } from "@/constants/studio";
import { filterObject } from '@/utils/utils';

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
        zoomScale: 1
    },
    reducers: {
        updateState(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        addComponent(state, action) { // name为组件名，若被原始定义，则用，否则，则生成
            const { componentsDetail } = state;
            const { x, y, type, name: preName } = action.payload;
            let maxIndex = 0;
            let name = preName;

            if (!name) {
                Object.keys(componentsDetail).forEach(key => {
                    const index = parseInt(key.replace(/[^0-9]/ig, ''), 10);
                    if (index >= maxIndex) {
                        maxIndex = index;
                    }
                });
                name = `${type}${maxIndex + 1}`;
            }

            return {
                ...state,
                selectedShapeName: name,
                componentsDetail: {
                    ...state.componentsDetail,
                    [name]: {
                        ...action.payload,
                        name,
                        width: MAPS.width[type],
                        height: MAPS.height[type],
                        lines: [
                            [x, 0, x, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
                            [x + MAPS.width[type] * state.zoomScale, 0, x + MAPS.width[type] * state.zoomScale, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
                            [0, y, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y],
                            [0, y + MAPS.height[type] * state.zoomScale, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y + MAPS.height[type] * state.zoomScale]
                        ]
                    }
                }
            };
        },
        addComponentsDetail(state, action) {
            return {
                ...state,
                componentsDetail: {
                    ...state.componentsDetail,
                    ...action.payload
                }
            };
        },
        updateComponentsDetail(state, action) {
            const { selectedShapeName, ...componentsDetail } = action.payload;
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
            // TODO 是否需要做判断不更新lines？
            detail.lines = [
                [x, 0, x, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
                [x + MAPS.width[type] * detail.scaleX * state.zoomScale, 0, x + MAPS.width[type] * detail.scaleX * state.zoomScale, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
                [0, y, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y],
                [0, y + MAPS.height[type] * detail.scaleY * state.zoomScale, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y + MAPS.height[type] * detail.scaleY * state.zoomScale]
            ];

            return {
                ...state,
                selectedShapeName: targetShapeName,
                componentsDetail: {
                    ...state.componentsDetail,
                    [targetShapeName]: detail
                }
            };
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
            const { componentsDetail } = state;
            delete componentsDetail[action.payload];
            return {
                ...state,
                selectedShapeName: '',
                componentsDetail: {
                    ...componentsDetail
                }
            };
        },
        zoomOutOrIn(state, action) {
            const { stage: {width, height}, zoomScale: originZoomScale, componentsDetail } = state;
            const { zoomScale, screenType } = action.payload;

            const originFixRect = {};
            Object.keys(componentsDetail).map(key => {
                const componentDetail = componentsDetail[key];
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
                    componentDetail.x = (width - fixRectWidth) / 2 + (componentDetail.x - originFixRect.x) * zoomScale / originZoomScale;
                    componentDetail.y = (height - fixRectHeight) / 2 + (componentDetail.y - originFixRect.y) * zoomScale / originZoomScale;
                }
            });

            return {
                ...state,
                selectedShapeName: '',
                zoomScale,
                componentsDetail
            }
        }
    },
};
