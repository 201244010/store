import { MAPS, SIZES } from '@/constants/studio';
import { filterObject } from '@/utils/utils';

export default {
    namespace: 'studio',
    state: {
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
        addComponent(state, action) {
            const { componentsDetail } = state;
            const { x, y, type } = action.payload;
            let maxIndex = 0;

            Object.keys(componentsDetail).forEach(name => {
                const index = parseInt(name.replace(/[^0-9]/ig, ''), 10);
                if (index >= maxIndex) {
                    maxIndex = index;
                }
            });
            const name = `${type}${maxIndex + 1}`;
            return {
                ...state,
                componentsDetail: {
                    ...state.componentsDetail,
                    [name]: {
                        ...action.payload,
                        name,
                        width: MAPS.width[type],
                        height: MAPS.height[type],
                        lines: [
                            [x, 0, x, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
                            [x + MAPS.width[type], 0, x + MAPS.width[type], SIZES.DEFAULT_MAX_CANVAS_LENGTH],
                            [0, y, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y],
                            [0, y + MAPS.height[type], SIZES.DEFAULT_MAX_CANVAS_LENGTH, y + MAPS.height[type]]
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

            return {
                ...state,
                selectedShapeName: targetShapeName,
                componentsDetail: {
                    ...state.componentsDetail,
                    [targetShapeName]: {
                        ...state.componentsDetail[targetShapeName],
                        ...filterObject(componentsDetail[targetShapeName] || {})
                    }
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
        }
    },
};
