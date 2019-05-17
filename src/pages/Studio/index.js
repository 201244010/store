import React, { Component } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { connect } from 'dva';
import { Spin, message } from 'antd';
import MTransformer from './MTransformer';
import BoardHeader from './BoardHeader';
import BoardTools from './BoardTools';
import ContextMenu from './ContextMenu';
import RightToolBox from './RightToolBox';
import generateShape from './GenerateShape';
import { getLocationParam } from '@/utils/utils';
import { getTypeByName, getNearLines } from '@/utils/studio';
import { KEY } from '@/constants';
import { SIZES, SHAPE_TYPES, PRICE_TYPES, MAPS } from '@/constants/studio';
import * as RegExp from '@/constants/regexp';
import { ERROR_OK } from '@/constants/errorCode';
import * as styles from './index.less';

@connect(
    state => ({
        studio: state.studio,
        template: state.template,
    }),
    dispatch => ({
        updateComponentsDetail: payload =>
            dispatch({ type: 'studio/updateComponentsDetail', payload }),
        toggleRightToolBox: payload => dispatch({ type: 'studio/toggleRightToolBox', payload }),
        copySelectedComponent: payload =>
            dispatch({ type: 'studio/copySelectedComponent', payload }),
        deleteSelectedComponent: payload =>
            dispatch({ type: 'studio/deleteSelectedComponent', payload }),
        addComponent: payload => dispatch({ type: 'studio/addComponent', payload }),
        updateState: payload => dispatch({ type: 'studio/updateState', payload }),
        zoomOutOrIn: payload => dispatch({ type: 'studio/zoomOutOrIn', payload }),
        fetchBindFields: payload => dispatch({ type: 'template/fetchBindFields', payload }),
        saveAsDraft: payload => dispatch({ type: 'template/saveAsDraft', payload }),
        fetchTemplateDetail: payload => dispatch({ type: 'template/fetchTemplateDetail', payload }),
        renameTemplate: payload => dispatch({ type: 'template/renameTemplate', payload }),
        uploadImage: payload => dispatch({ type: 'template/uploadImage', payload }),
    })
)
class Studio extends Component {
    constructor(props) {
        super(props);
        this.stageWidth = window.innerWidth - SIZES.TOOL_BOX_WIDTH * 2;
        this.stageHeight = window.innerHeight - SIZES.HEADER_HEIGHT;
        this.state = {
            dragging: false,
        };
    }

    async componentDidMount() {
        const {
            stageWidth,
            stageHeight,
            props: { fetchTemplateDetail, addComponent, fetchBindFields, updateState },
        } = this;
        fetchBindFields();
        const response = await fetchTemplateDetail({
            template_id: getLocationParam('id'),
        });
        const screenType = getLocationParam('screen');
        const { width, height, zoomScale } = MAPS.screen[screenType];
        let realZoomScale = zoomScale;
        if (response && response.code === ERROR_OK) {
            const studioInfo = JSON.parse(response.data.template_info.studio_info || '{}');
            if (!studioInfo.layers || !studioInfo.layers.length) {
                const type = SHAPE_TYPES.RECT_FIX;
                addComponent({
                    x: (stageWidth - width * zoomScale) / 2,
                    y: (stageHeight - height * zoomScale) / 2,
                    screenType,
                    type,
                    fill: 'white',
                    width,
                    height,
                    cornerRadius: MAPS.cornerRadius[type],
                    strokeWidth: MAPS.strokeWidth[type],
                    stroke: MAPS.stroke[type],
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 0,
                });
                this.updateSelectedShapeName('');
            } else {
                realZoomScale = studioInfo.layers[0].zoomScale;
            }
        }
        updateState({
            zoomScale: realZoomScale,
            stage: {
                width: stageWidth,
                height: stageHeight,
            },
        });
        document.addEventListener('keydown', this.handleDeleteComponent);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleDeleteComponent);
    }

    handleDeleteComponent = e => {
        if (e.keyCode === KEY.DELETE) {
            const {
                studio: { selectedShapeName },
                deleteSelectedComponent,
                toggleRightToolBox,
            } = this.props;

            if (selectedShapeName && selectedShapeName.indexOf(SHAPE_TYPES.RECT_FIX) === -1) {
                deleteSelectedComponent(selectedShapeName);
                toggleRightToolBox({
                    showRightToolBox: false,
                    rightToolBoxPos: {
                        left: -9999,
                        top: -9999,
                    },
                });
            }
        }
    };

    handleStageMouseDown = e => {
        const {
            studio: { selectedShapeName, componentsDetail, showRightToolBox },
        } = this.props;

        // 点击stage，取消选择正在编辑图形
        if (e.target === e.target.getStage()) {
            if (selectedShapeName) {
                this.updateSelectedShapeName('');
            }
            if (showRightToolBox) {
                this.toggleRightToolBox({
                    showRightToolBox: false,
                    rightToolBoxPos: {
                        left: -9999,
                        top: -9999,
                    },
                });
            }
            return;
        }
        // 点击拖拽框时，不做任何操作
        if (e.target.getParent().className === 'Transformer') {
            return;
        }

        const name = e.target.name();
        const shape = componentsDetail[name];
        if (shape) {
            // 鼠标左键取消右侧工具框
            if (e.evt.button === 0) {
                const target =
                    name.indexOf(SHAPE_TYPES.PRICE) !== -1 ? e.target.parent.children[0] : e.target;
                this.updateComponentsDetail(target, name);
                if (showRightToolBox) {
                    this.toggleRightToolBox({
                        showRightToolBox: false,
                        rightToolBoxPos: {
                            left: -9999,
                            top: -9999,
                        },
                    });
                }
            }
        } else if (selectedShapeName) {
            this.updateSelectedShapeName('');
        }
    };

    handleStageShapeStart = () => {
        this.setState({
            dragging: true,
        });
    };

    handleStageShapeMove = e => {
        this.updateComponentsDetail(e.target);
    };

    handleStageShapeEnd = () => {
        this.setState({
            dragging: false,
        });
    };

    handleShapeTransform = e => {
        this.updateComponentsDetail(e.currentTarget, undefined, true);
    };

    handleShapeDblClick = e => {
        const targetName = e.target.name();
        if (targetName.indexOf(SHAPE_TYPES.TEXT) !== -1) {
            this.handleTextDblClick(e, SHAPE_TYPES.TEXT);
        } else if (targetName.indexOf(SHAPE_TYPES.IMAGE) !== -1) {
            this.handleImageDblClick(e);
        } else if (targetName.indexOf(SHAPE_TYPES.PRICE) !== -1) {
            this.handlePriceDblClick(e, SHAPE_TYPES.PRICE);
        }
    };

    handleContextMenu = e => {
        e.evt.preventDefault();
        // const {studio: {showRightToolBox}} = this.props;
        const name = e.target.name();

        // if (e.target === e.target.getStage()) { // 点击stage，如果有侧工具框，则取消
        //     if (showRightToolBox) {
        //         this.toggleRightToolBox({
        //             showRightToolBox: false,
        //             rightToolBoxPos: {
        //                 left: -9999,
        //                 top: -9999
        //             }
        //         });
        //     }
        //     return;
        // }
        // if (e.target.getParent().className === 'Transformer') { // 点击拖拽框时，不做任何操作
        //     return;
        // }

        this.toggleRightToolBox({
            selectedShapeName: name,
            showRightToolBox: true,
            rightToolBoxPos: {
                left: e.evt.clientX,
                top: e.evt.clientY,
            },
        });
    };

    handleWheel = e => {
        console.log(e);
    };

    handleSaveAsDraft = () => {
        const {
            studio: { componentsDetail, zoomScale },
            saveAsDraft,
        } = this.props;
        const newDetails = {};
        Object.keys(componentsDetail).forEach(key => {
            const detail = componentsDetail[key];
            if (detail.name) {
                newDetails[key] = {
                    ...detail,
                    zoomScale,
                };
            }
        });

        saveAsDraft({
            template_id: getLocationParam('id'),
            draft: newDetails,
        });
    };

    handleTextDblClick = e => {
        const { updateComponentsDetail } = this.props;
        const targetName = e.target.name();
        this.createInput(e);
        updateComponentsDetail({
            selectedShapeName: targetName,
            [targetName]: {
                text: '',
            },
        });
    };

    handleImageDblClick = clickEvent => {
        const {
            studio: { selectedShapeName, componentsDetail },
            updateComponentsDetail,
            uploadImage,
        } = this.props;
        const targetName = clickEvent.target.name();
        const inputObj = document.createElement('input');

        inputObj.setAttribute('id', '_ef');
        inputObj.setAttribute('type', 'file');
        inputObj.setAttribute('style', 'display: none');
        document.body.appendChild(inputObj);
        inputObj.click();

        const fileChangeHandler = async changeEvent => {
            const response = await uploadImage({
                file: changeEvent.target.files[0],
            });
            const detail = componentsDetail[selectedShapeName];
            const imageUrl = response.data.template_image_info.address;

            const image = new Image();
            image.onload = () => {
                updateComponentsDetail({
                    selectedShapeName: targetName,
                    [targetName]: {
                        image,
                        imageUrl,
                        imageType: 'selected',
                        ratio: image.height / image.width,
                        height: (detail.width * image.height) / image.width,
                    },
                });
                inputObj.removeEventListener('change', fileChangeHandler);
                inputObj.parentNode.removeChild(inputObj);
            };
            image.src = imageUrl;
        };
        inputObj.addEventListener('change', fileChangeHandler);
    };

    handlePriceDblClick = (e, type) => {
        const { updateComponentsDetail } = this.props;
        const targetName = e.target.name();
        this.createInput(e, type);
        updateComponentsDetail({
            selectedShapeName: targetName,
            [targetName]: {
                text: '',
            },
        });
    };

    updateSelectedShapeName = selectedShapeName => {
        const { updateComponentsDetail } = this.props;

        updateComponentsDetail({
            selectedShapeName,
        });
    };

    updateComponentsDetail = (target, selectedShapeName, updateInput) => {
        const { updateComponentsDetail } = this.props;
        const { x, y, name, width, height, scaleX, scaleY, rotation, strokeWidth } = target.attrs;
        let realW = width;
        let realH = height;
        let realScaleX = scaleX;
        let realScaleY = scaleY;
        let adjustX = 0;
        let adjustY = 0;

        if (name && name.indexOf('_') === -1) {
            const type = getTypeByName(name);
            if ([...PRICE_TYPES, SHAPE_TYPES.TEXT].includes(type)) {
                // TEXT组件放大的是同层的RECT组件
                realW = target.parent.children[0].attrs.width;
                realScaleX = target.parent.children[0].attrs.scaleX || 1;
                realScaleY = target.parent.children[0].attrs.scaleY || 1;
            } else if (type === SHAPE_TYPES.HLine) {
                // HLine组件特殊处理
                realW = SIZES.DEFAULT_H_LINE_WIDTH;
                realH = strokeWidth;
                adjustY = strokeWidth / 2;
            } else if (type === SHAPE_TYPES.VLine) {
                // VLine组件特殊处理
                realW = strokeWidth;
                realH = SIZES.DEFAULT_V_LINE_HEIGHT;
                adjustX = strokeWidth / 2;
            }

            if (updateInput) {
                this.updateInput({
                    width,
                    height,
                    scaleX: realScaleX,
                    scaleY: realScaleY,
                });
            }

            const componentDetail = {
                selectedShapeName,
                [name]: {
                    type,
                    name,
                    x,
                    y,
                    width: realW,
                    height: realH,
                    scaleX: realScaleX,
                    scaleY: realScaleY,
                    rotation,
                },
            };
            componentDetail[name].lines = [
                [x - adjustX, 0, x - adjustX, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
                [
                    x + realW * realScaleX - adjustX,
                    0,
                    x + realW * realScaleX - adjustX,
                    SIZES.DEFAULT_MAX_CANVAS_LENGTH,
                ],
                [0, y - adjustY, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y - adjustY],
                [
                    0,
                    y + realH * realScaleY - adjustY,
                    SIZES.DEFAULT_MAX_CANVAS_LENGTH,
                    y + realH * realScaleY - adjustY,
                ],
            ];
            updateComponentsDetail(componentDetail);
        }
    };

    createInput = (e, type) => {
        // type是为了区分价格组件、文本组件及其他
        const targetName = e.target.name();
        const {
            studio: { componentsDetail, zoomScale },
            updateComponentsDetail,
        } = this.props;
        const targetDetail = componentsDetail[targetName];

        const textPosition = e.target.getAbsolutePosition();
        const stageBox = e.target
            .getStage()
            .getContainer()
            .getBoundingClientRect();
        const inputPosition = {
            x: stageBox.left + textPosition.x,
            y: stageBox.top + textPosition.y,
        };

        const inputEle = document.createElement('input');
        document.body.appendChild(inputEle);
        inputEle.setAttribute('id', 'textInput');
        if (type === SHAPE_TYPES.PRICE) {
            // inputEle.value = `${e.target.parent.children[1].text()}${e.target.parent.children[2].text()}`;
            inputEle.value = e.target.parent.children[1].text();
        } else {
            inputEle.value = e.target.parent.children[1].text();
        }
        inputEle.style.backgroundColor = 'transparent';
        inputEle.style.border = '1px solid #ccc';
        inputEle.style.borderRadius = '5px';
        inputEle.style.fontSize = `${targetDetail.fontSize * zoomScale}px`;
        inputEle.style.fontFamily = targetDetail.fontFamily;
        inputEle.style.color = e.target.parent.children[1].attrs.fill;
        inputEle.style.position = 'absolute';
        inputEle.style.left = `${inputPosition.x}px`;
        inputEle.style.top = `${inputPosition.y}px`;
        inputEle.style.width = `${targetDetail.width * targetDetail.scaleX}px`;
        inputEle.style.height = `${targetDetail.height * targetDetail.scaleY}px`;
        inputEle.style.lineHeight = `${targetDetail.lineHeight}`;
        inputEle.style.letterSpacing = `${targetDetail.letterSpacing}px`;
        inputEle.style.textAlign = targetDetail.align;
        inputEle.focus();

        const saveToLocal = () => {
            const inputValue = inputEle.value;
            if (type === SHAPE_TYPES.PRICE && !RegExp.money.test(inputValue)) {
                message.warning('输入价格不正确');
                inputEle.value = '';
                return;
            }
            try {
                document.body.removeChild(inputEle);
                updateComponentsDetail({
                    selectedShapeName: targetName,
                    [targetName]: {
                        text: inputValue || '双击编辑文本',
                    },
                });
            } catch (evt) {
                console.log(evt);
            }
        };

        inputEle.addEventListener('keydown', evt => {
            // 按下enter保存
            if (evt.keyCode === 13) {
                saveToLocal();
            }
        });
        inputEle.addEventListener('blur', () => {
            // 失去焦点时也保存
            saveToLocal();
        });
    };

    updateInput = config => {
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.style.width = `${config.width * config.scaleX}px`;
            textInput.style.height = `${config.height * config.scaleY}px`;
            textInput.style.lineHeight = `${config.lineHeight}`;
        }
    };

    toggleRightToolBox = config => {
        const { toggleRightToolBox } = this.props;
        toggleRightToolBox(config);
    };

    render() {
        const {
            stageWidth,
            stageHeight,
            props: {
                updateComponentsDetail,
                copySelectedComponent,
                deleteSelectedComponent,
                addComponent,
                toggleRightToolBox,
                zoomOutOrIn,
                renameTemplate,
                fetchTemplateDetail,
                studio: {
                    selectedShapeName,
                    componentsDetail,
                    showRightToolBox,
                    rightToolBoxPos,
                    copiedComponent,
                    zoomScale,
                },
                template: { bindFields, curTemplate },
            },
            state: { dragging },
        } = this;

        let lines = [];
        if (selectedShapeName) {
            Object.keys(componentsDetail).forEach(key => {
                if (key === selectedShapeName) {
                    if (componentsDetail[key].type !== SHAPE_TYPES.RECT_FIX) {
                        lines = lines.concat(componentsDetail[key].lines);
                    }
                } else if (componentsDetail[key].type !== SHAPE_TYPES.RECT_FIX) {
                    lines = lines.concat(
                        getNearLines(componentsDetail[selectedShapeName], componentsDetail[key])
                    );
                }
            });
        }

        return (
            <div className={styles.board}>
                <Spin tip="拼命加载中" spinning={false} />
                <div className={styles['board-header']}>
                    <BoardHeader
                        {...{
                            templateInfo: curTemplate,
                            zoomScale,
                            saveAsDraft: this.handleSaveAsDraft,
                            zoomOutOrIn,
                            renameTemplate,
                            fetchTemplateDetail,
                        }}
                    />
                </div>
                <div className={styles['board-content']}>
                    <div className={styles['board-tools']}>
                        <BoardTools addComponent={addComponent} />
                    </div>
                    <div className={styles['board-stage']}>
                        <Stage
                            width={stageWidth}
                            height={stageHeight}
                            onMouseDown={this.handleStageMouseDown}
                            onDragStart={this.handleStageShapeStart}
                            onDragMove={this.handleStageShapeMove}
                            onDragEnd={this.handleStageShapeEnd}
                            onTransform={this.handleShapeTransform}
                            onContextMenu={this.handleContextMenu}
                            onWheel={this.handleWheel}
                        >
                            <Layer x={0} y={0} width={stageWidth} height={stageHeight}>
                                {Object.keys(componentsDetail).map(key => {
                                    const targetDetail = componentsDetail[key];
                                    if (targetDetail.name) {
                                        return generateShape({
                                            ...targetDetail,
                                            key,
                                            stageWidth,
                                            stageHeight,
                                            scaleX: targetDetail.scaleX || 1,
                                            scaleY: targetDetail.scaleY || 1,
                                            zoomScale,
                                            ratio: targetDetail.ratio || 1,
                                            selected: selectedShapeName === targetDetail.name,
                                            onTransform: this.handleShapeTransform,
                                            onDblClick: this.handleShapeDblClick,
                                        });
                                    }
                                    return undefined;
                                })}
                                {!dragging &&
                                selectedShapeName &&
                                componentsDetail[selectedShapeName].type !==
                                    SHAPE_TYPES.RECT_FIX ? (
                                    <MTransformer selectedShapeName={selectedShapeName} />
                                ) : null}
                            </Layer>
                            {dragging && lines && !showRightToolBox ? (
                                <Layer x={0} y={0} width={stageWidth} height={stageHeight}>
                                    {lines.map((line, index) => (
                                        <Line
                                            key={index}
                                            points={line}
                                            stroke="#ee735c"
                                            strokeWidth={1}
                                            dash={[4, 2]}
                                        />
                                    ))}
                                </Layer>
                            ) : null}
                        </Stage>
                    </div>
                    {selectedShapeName && selectedShapeName.indexOf(SHAPE_TYPES.RECT_FIX) === -1 ? (
                        <div className={styles['tool-box']}>
                            <RightToolBox
                                {...{
                                    bindFields,
                                    selectedShapeName,
                                    componentsDetail,
                                    zoomScale,
                                    updateComponentsDetail,
                                    deleteSelectedComponent,
                                    addComponent,
                                }}
                            />
                        </div>
                    ) : null}
                </div>
                {showRightToolBox ? (
                    <ContextMenu
                        {...{
                            color: (componentsDetail[selectedShapeName] || {}).fill,
                            fontSize: (componentsDetail[selectedShapeName] || {}).fontSize,
                            text: (componentsDetail[selectedShapeName] || {}).text,
                            position: rightToolBoxPos,
                            componentsDetail,
                            selectedShapeName,
                            copiedComponent,
                            showRightToolBox,
                            updateComponentsDetail,
                            deleteSelectedComponent,
                            copySelectedComponent,
                            addComponent,
                            toggleRightToolBox,
                        }}
                    />
                ) : null}
            </div>
        );
    }
}

export default Studio;
