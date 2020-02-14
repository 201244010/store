import React, {Component} from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { connect } from 'dva';
import { Spin, Modal, Alert,	 Icon, message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as RegExp from '@/constants/regexp';
import { getLocationParam, downloadFileByClick } from '@/utils/utils';
import { getTypeByName, getNearestLines, getNearestPosition, clearSteps, saveNowStep, preStep, nextStep, getImagePromise } from '@/utils/studio';
import FontDetector from '@/utils/FontDetector';
import { KEY } from '@/constants';
import { SIZES, SHAPE_TYPES, NORMAL_PRICE_TYPES, MAPS, RECT_SELECT_NAME, IMAGE_TYPES } from '@/constants/studio';
import Config from '@/config';
import MTransformer from './MTransformer';
import BoardHeader from './BoardHeader';
import BoardTools from './BoardTools';
import ContextMenu from './ContextMenu';
import RightToolBox from './RightToolBox';
import DragCopy from './DragCopy';
import generateShape from './GenerateShape';
import * as styles from './index.less';

@connect(
	state => ({
		studio: state.studio,
		template: state.template,
	}),
	dispatch => ({
		updateComponentsDetail: payload =>
			dispatch({ type: 'studio/updateComponentsDetail', payload }),
		updateComponentDetail: payload =>
			dispatch({ type: 'studio/updateComponentDetail', payload }),
		batchUpdateComponentDetail: payload =>
			dispatch({ type: 'studio/batchUpdateComponentDetail', payload }),
		batchUpdateScopedComponent: payload =>
			dispatch({ type: 'studio/batchUpdateScopedComponent', payload }),
		resetScopedComponents: payload =>
			dispatch({ type: 'studio/resetScopedComponents', payload }),
		toggleRightToolBox: payload => dispatch({ type: 'studio/toggleRightToolBox', payload }),
		copySelectedComponent: payload =>
			dispatch({ type: 'studio/copySelectedComponent', payload }),
		deleteSelectedComponent: payload =>
			dispatch({ type: 'studio/deleteSelectedComponent', payload }),
		addComponent: payload => dispatch({ type: 'studio/addComponent', payload }),
		updateState: payload => dispatch({ type: 'studio/updateState', payload }),
		zoomOutOrIn: payload => dispatch({ type: 'studio/zoomOutOrIn', payload }),
		changeOneStep: payload => dispatch({ type: 'studio/changeOneStep', payload }),
		selectComponentIn: payload => dispatch({ type: 'studio/selectComponentIn', payload }),
		selectComponent: payload => dispatch({ type: 'studio/selectComponent', payload }),
		fetchBindFields: payload => dispatch({ type: 'template/fetchBindFields', payload }),
		saveAsDraft: payload => dispatch({ type: 'template/saveAsDraft', payload }),
		downloadAsDraft: payload => dispatch({ type: 'template/downloadAsDraft', payload }),
		fetchTemplateDetail: payload => dispatch({ type: 'template/fetchTemplateDetail', payload }),
		renameTemplate: payload => dispatch({ type: 'template/renameTemplate', payload }),
		uploadImage: payload => dispatch({ type: 'template/uploadImage', payload }),
		previewTemplate: payload => dispatch({ type: 'template/previewTemplate', payload }),
	})
)
class Studio extends Component {
	constructor(props) {
		super(props);
		this.stageWidth = window.innerWidth - SIZES.TOOL_BOX_WIDTH * 2;
		this.stageHeight = window.innerHeight - SIZES.HEADER_HEIGHT;
		this.refComponents = {};
		this.state = {
			editing: false,
			dragging: false,
			dragName: '',
			dragCopy: {
				left: -9999,
				top: -9999
			},
			showMask: false,
			hasNoFonts: []
		};
		clearSteps();
	}

	async componentDidMount() {
		const {stageWidth, stageHeight, props: {fetchTemplateDetail, fetchBindFields, updateState}} = this;
		fetchBindFields();
		const screenType = getLocationParam('screen');
		updateState({
			stage: {
				width: stageWidth,
				height: stageHeight,
			},
		});

		await fetchTemplateDetail({
			template_id: getLocationParam('id'),
			width: stageWidth,
			height: stageHeight,
			screenType,
		});

		document.addEventListener('keydown', this.handleComponentActions);

		// 当页面关闭及刷新时，存储在localStorage中的待拷贝项需要清空
		window.onunload = () => {
			if (localStorage.getItem('__studio_copy_cross_template_id__') === getLocationParam('id')) {
				localStorage.removeItem('__studio_copy_cross_template_id__');
				localStorage.removeItem('__studio_copy_cross_two_template__');
			}
		};

		this.detectFonts();
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleComponentActions);
	}

	handleComponentActions = e => {
		const { editing } = this.state;
		const { keyCode, ctrlKey, target: { tagName } } = e;

		// 编辑文本状态下无法操作
		if (editing) {
			return;
		}
		const {
			studio: { selectedShapeName, componentsDetail, copiedComponent, scopedComponents },
			addComponent,
			updateComponentsDetail
		} = this.props;
		const canCopyOrDelete = selectedShapeName && selectedShapeName.indexOf(SHAPE_TYPES.RECT_FIX) === -1;
		// 操作输入框时 无法删除
		if ([KEY.DELETE, KEY.BACKSPACE].includes(keyCode) && tagName.toUpperCase() !== 'INPUT' && tagName.toUpperCase() !== 'TEXTAREA') {
			this.handleDelete();
		}
		if (keyCode === KEY.KEY_LEFT) {
			updateComponentsDetail({
				[selectedShapeName]: {
					x: componentsDetail[selectedShapeName].x - 1,
				},
			});
		}
		if (keyCode === KEY.KEY_RIGHT) {
			updateComponentsDetail({
				[selectedShapeName]: {
					x: componentsDetail[selectedShapeName].x + 1,
				},
			});
		}
		if (keyCode === KEY.KEY_UP) {
			updateComponentsDetail({
				[selectedShapeName]: {
					y: componentsDetail[selectedShapeName].y - 1,
				},
			});
		}
		if (keyCode === KEY.KEY_DOWN) {
			updateComponentsDetail({
				[selectedShapeName]: {
					y: componentsDetail[selectedShapeName].y + 1,
				},
			});
		}
		if (ctrlKey) {
			// Ctrl + X
			if (keyCode === KEY.KEY_X) {
				if (canCopyOrDelete) {
					this.handleCut();
				}
			}
			// Ctrl + C
			if (keyCode === KEY.KEY_C) {
				if (canCopyOrDelete) {
					this.handleCopy();
				}
			}
			// Ctrl + V
			if (keyCode === KEY.KEY_V) {
				if (copiedComponent.name) {
					if (copiedComponent.type !== SHAPE_TYPES.RECT_SELECT) {
						const newPosition = {};
						this.copyCountMap = this.copyCountMap || {};
						if (!this.copyCountMap[copiedComponent.name]) {
							this.copyCountMap[copiedComponent.name] = 1;
						} else {
							this.copyCountMap[copiedComponent.name]++;
						}
						newPosition.x = copiedComponent.x  + 10 * this.copyCountMap[copiedComponent.name];
						newPosition.y = copiedComponent.y + 10 * this.copyCountMap[copiedComponent.name];

						addComponent({
							...copiedComponent,
							x: newPosition.x,
							y: newPosition.y,
						});
					} else if (scopedComponents.length) {
						this.copyCountMap = this.copyCountMap || {};
						if (!this.copyCountMap[copiedComponent.name]) {
							this.copyCountMap[copiedComponent.name] = 1;
						} else {
							this.copyCountMap[copiedComponent.name]++;
						}
						for (let i = 0; i < scopedComponents.length; i++) {
							addComponent({
								...scopedComponents[i],
								x: scopedComponents[i].x + 10 * this.copyCountMap[copiedComponent.name],
								y: scopedComponents[i].y + 10 * this.copyCountMap[copiedComponent.name],
								isStep: i === scopedComponents.length - 1
							});
						}
					} else {
						this.handleCrossTemplateCopy();
					}
				} else {
					this.handleCrossTemplateCopy();
				}
			}
			// Ctrl + Y
			if (keyCode === KEY.KEY_Y) {
				this.nextStep();
			}
			// Ctrl + Z
			if (keyCode === KEY.KEY_Z) {
				this.preStep();
			}
		}
	};

	preStep = async () => {
		const { props: { changeOneStep } } = this;
		const result = await preStep(getLocationParam('id'));
		if (result) {
			changeOneStep(JSON.parse(result));
		}
	};

	nextStep = async () => {
		const { props: { changeOneStep } } = this;
		const result = await nextStep(getLocationParam('id'));
		if (result) {
			changeOneStep(JSON.parse(result));
		}
	};

	handleSelectRect = (e) => {
		const { studio: { componentsDetail }, addComponent, updateComponentsDetail } = this.props;

		this.moveStart = true;
		this.moveStartX = e.evt.clientX;
		this.moveStartY = e.evt.clientY;
		if (!componentsDetail[RECT_SELECT_NAME]) {
			addComponent({
				type: SHAPE_TYPES.RECT_SELECT,
				name: RECT_SELECT_NAME,
				x: e.evt.clientX - SIZES.TOOL_BOX_WIDTH,
				y: e.evt.clientY - SIZES.HEADER_HEIGHT - 20,
				background: '#5cadff',
				width: 0,
				height: 0,
				scaleX: 1,
				scaleY: 1,
				zoomScale: 1,
				rotation: 0,
				opacity: 0.2,
				isStep: false
			});
		} else {
			updateComponentsDetail({
				isStep: false,
				selectedShapeName: RECT_SELECT_NAME,
				[RECT_SELECT_NAME]: {
					x: e.evt.clientX - SIZES.TOOL_BOX_WIDTH,
					y: e.evt.clientY - SIZES.HEADER_HEIGHT - 20,
					width: 0,
					height: 0
				},
			});
		}
		this.updateSelectedShapeName('');
	};

	handleStageMouseDown = e => {
		const { selectComponent, studio: { selectedShapeName, componentsDetail, showRightToolBox } } = this.props;
		const name = e.target.name();

		if (e.evt.ctrlKey && !e.evt.shiftKey && name.indexOf(SHAPE_TYPES.RECT_FIX) === -1 && name.indexOf(SHAPE_TYPES.RECT_SELECT) === -1) {
			window.clearTimeout(this.selectComponentTimer);
			this.selectComponentTimer = setTimeout(() => {
				selectComponent({
					componentName: name
				});
			}, 100);
			return;
		}

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
			// 鼠标左键出发多选
			if (e.evt.button === 0) {
				this.handleSelectRect(e);
			}
			return;
		}
		// 点击拖拽框时，不做任何操作
		if (e.target.getParent().className === 'Transformer') {
			return;
		}

		if (e.evt.button === 0 && name.indexOf(SHAPE_TYPES.RECT_FIX) > -1) {
			this.handleSelectRect(e);
		}

		const shape = componentsDetail[name];
		if (shape) {
			// 鼠标左键取消右侧工具框
			if (e.evt.button === 0) {
				const target = name.indexOf(SHAPE_TYPES.PRICE) !== -1 ? e.target.parent.children[0] : e.target;
				this.updateComponentsDetail({
					target,
					selectedShapeName: name
				});
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

	handleStageMouseMove = (e) => {
		if (this.moveStart) {
			const { updateComponentsDetail } = this.props;
			const diffX = e.evt.clientX - this.moveStartX;
			const diffY = e.evt.clientY - this.moveStartY;
			if (diffX > 0) {
				if (diffY > 0) {
					updateComponentsDetail({
						isStep: false,
						selectedShapeName: RECT_SELECT_NAME,
						[RECT_SELECT_NAME]: {
							width: Math.abs(diffX),
							height: Math.abs(diffY),
						},
					});
				} else {
					updateComponentsDetail({
						isStep: false,
						selectedShapeName: RECT_SELECT_NAME,
						[RECT_SELECT_NAME]: {
							y: e.evt.clientY - SIZES.HEADER_HEIGHT - 20,
							width: Math.abs(diffX),
							height: Math.abs(diffY),
						},
					});
				}
			} else if (diffX <= 0) {
				if (diffY > 0) {
					updateComponentsDetail({
						isStep: false,
						selectedShapeName: RECT_SELECT_NAME,
						[RECT_SELECT_NAME]: {
							x: e.evt.clientX - SIZES.TOOL_BOX_WIDTH,
							width: Math.abs(diffX),
							height: Math.abs(diffY),
						},
					});
				} else {
					updateComponentsDetail({
						isStep: false,
						selectedShapeName: RECT_SELECT_NAME,
						[RECT_SELECT_NAME]: {
							x: e.evt.clientX - SIZES.TOOL_BOX_WIDTH,
							y: e.evt.clientY - SIZES.HEADER_HEIGHT - 20,
							width: Math.abs(e.evt.clientX - this.moveStartX),
							height: Math.abs(e.evt.clientY - this.moveStartY),
						},
					});
				}
			}
		}
	};

	handleStageMouseUp = (e) => {
		if (this.moveStart) {
			this.moveStart = false;
			const { selectComponentIn, updateComponentsDetail } = this.props;
			if (Math.abs(e.evt.clientX - this.moveStartX) > 10) {
				selectComponentIn();
			} else {
				updateComponentsDetail({
					isStep: false,
					selectedShapeName: '',
					scopedComponents: [],
					[RECT_SELECT_NAME]: {
						width: 0,
						height: 0
					},
				});
			}

		}
	};

	handleStageShapeStart = e => {
		this.startCtrlKey = e.evt.ctrlKey;
		const { studio: { componentsDetail }, updateComponentDetail } = this.props;
		this.setState({
			dragging: true,
		});
		const componentName = e.target.name();
		if (componentName.indexOf(SHAPE_TYPES.RECT_SELECT) === -1 && componentsDetail[componentName]) {
			// 按住ctrl拖动复制组件
			if (e.evt.ctrlKey && !e.evt.shiftKey) {
				this.setState({
					dragName: componentName,
					dragCopy: {
						left: e.evt.clientX,
						top: e.evt.clientY
					}
				});
				updateComponentDetail({
					componentName,
					detail: {
						frozenX: true,
						frozenY: true
					}
				});
			}
		}
	};

	handleStageShapeMove = e => {
		const {
			studio: { selectedShapeName },
			updateComponentsDetail, resetScopedComponents, batchUpdateComponentDetail
		} = this.props;

		if (e.evt.ctrlKey && !e.evt.shiftKey) {
			this.setState({
				dragCopy: {
					left: e.evt.clientX - 10,
					top: e.evt.clientY
				}
			});
			window.clearTimeout(this.selectComponentTimer);
			resetScopedComponents();
			return;
		}

		if (e.evt.shiftKey && !this.shiftDrag) {
			this.shiftDrag = true;
			if (Math.abs(e.evt.movementX) >= Math.abs(e.evt.movementY)) {
				updateComponentsDetail({
					[selectedShapeName]: {
						frozenX: false,
						frozenY: true
					},
				});
			} else {
				updateComponentsDetail({
					[selectedShapeName]: {
						frozenX: true,
						frozenY: false
					},
				});
			}
		}
		if (selectedShapeName.indexOf(SHAPE_TYPES.RECT_SELECT) === -1) {
			this.updateComponentsDetail({
				target: e.target,
			});
		} else {
			batchUpdateComponentDetail({
				x: e.target.attrs.x,
				y: e.target.attrs.y,
			});
		}
	};

	handleStageShapeEnd = (e) => {
		const {
			studio: { selectedShapeName, componentsDetail },
			addComponent, updateComponentsDetail, batchUpdateScopedComponent
		} = this.props;
		this.setState({
			dragging: false,
			dragCopy: {
				left: -9999,
				top: -9999
			}
		});
		this.shiftDrag = false;
		const curComponent = componentsDetail[e.target.name()];
		updateComponentsDetail({
			[selectedShapeName]: {
				frozenX: false,
				frozenY: false
			}
		});
		if (this.startCtrlKey && e.evt.ctrlKey && !e.evt.shiftKey && curComponent) {
			addComponent({
				...curComponent,
				x: e.evt.clientX - SIZES.TOOL_BOX_WIDTH,
				y: e.evt.clientY - SIZES.HEADER_HEIGHT - 20,
			});
			return;
		}

		if (selectedShapeName.indexOf(SHAPE_TYPES.RECT_SELECT) === -1) {
			const scope = getNearestPosition(componentsDetail, selectedShapeName);
			updateComponentsDetail({
				isStep: true,
				[selectedShapeName]: {
					x: scope.x,
					y: scope.y
				},
			});
		} else {
			batchUpdateScopedComponent();
		}

		// if (scope.x || scope.x === 0) {
		// 	componentsDetail[selectedShapeName].x = scope.x;
		// }
		// if (scope.y || scope.y === 0) {
		// 	componentsDetail[selectedShapeName].y = scope.y;
		// }
		// saveNowStep(getLocationParam('id'), componentsDetail);
	};

	handleShapeTransform = e => {
		this.updateComponentsDetail({
			target: e.currentTarget,
			updateInput: true
		});
	};

	handleShapeTransformEnd = () => {
		const { studio: { componentsDetail } } = this.props;
		saveNowStep(getLocationParam('id'), componentsDetail);
	};

	handleShapeDblClick = e => {
		const targetName = e.target.name();
		if (targetName.indexOf(SHAPE_TYPES.TEXT) !== -1) {
			this.handleTextDblClick(e, SHAPE_TYPES.TEXT);
		} else if (targetName.indexOf(SHAPE_TYPES.IMAGE) !== -1) {
			this.handleImageDblClick(e);
		} else if (targetName.indexOf(SHAPE_TYPES.PRICE_NORMAL) !== -1) {
			this.handlePriceDblClick(e, SHAPE_TYPES.PRICE_NORMAL);
		} else if (targetName.indexOf(SHAPE_TYPES.PRICE_SUPER) !== -1) {
			this.handlePriceDblClick(e, SHAPE_TYPES.PRICE_SUPER);
		} else if (targetName.indexOf(SHAPE_TYPES.PRICE_SUB) !== -1) {
			this.handlePriceDblClick(e, SHAPE_TYPES.PRICE_SUB);
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

		if (!e.evt.ctrlKey) {
			this.toggleRightToolBox({
				selectedShapeName: name,
				showRightToolBox: true,
				rightToolBoxPos: {
					left: e.evt.clientX,
					top: e.evt.clientY,
				},
			});
		}
	};

	handleWheel = (e) => {
		e.evt.preventDefault();
		const {ctrlKey, deltaY} = e.evt;
		if (ctrlKey) {
			const { studio: {zoomScale}, zoomOutOrIn } = this.props;
			let realZoomScale = zoomScale + (deltaY < 0 ? 0.1 : -0.1);
			if (realZoomScale > 3) {
				realZoomScale = 3;
			} else if (realZoomScale < 0.5) {
				realZoomScale = 0.5;
			}

			zoomOutOrIn({
				zoomScale: realZoomScale,
				screenType: getLocationParam('screen'),
				selectedShapeName: '',
			});
		}
	};

	handleSaveAsDraft = () => {
		const { studio: { componentsDetail, zoomScale }, saveAsDraft} = this.props;
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

	handleDownloadAsDraft = () => {
		const { studio: { componentsDetail, zoomScale }, downloadAsDraft} = this.props;
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

		downloadAsDraft({
			template_id: getLocationParam('id'),
			draft: newDetails,
		});
	};

	handleTextDblClick = e => {
		const { updateComponentsDetail } = this.props;
		const targetName = e.target.name();
		this.createInput(e, SHAPE_TYPES.TEXT);
		updateComponentsDetail({
			selectedShapeName: targetName,
			[targetName]: {
				content: '',
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

		const fileChangeHandler = async changeEvent => {
			const file = changeEvent.target.files[0];
			if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
				message.warning(formatMessage({ id: 'studio.tool.error.image.format' }));
				return;
			}
			const response = await uploadImage({
				file
			});
			const detail = componentsDetail[selectedShapeName];
			const imgPath = response.data.template_image_info.address;

			const image = new Image();
			image.onload = () => {
				updateComponentsDetail({
					selectedShapeName: targetName,
					[targetName]: {
						image,
						imgPath,
						ratio: image.height / image.width,
						height: (detail.width * image.height) / image.width,
					},
				});
				inputObj.removeEventListener('change', fileChangeHandler);
				inputObj.parentNode.removeChild(inputObj);
			};
			image.src = imgPath;
		};
		inputObj.addEventListener('change', fileChangeHandler);
		inputObj.click();
	};

	handlePriceDblClick = (e, type) => {
		const { updateComponentsDetail } = this.props;
		const targetName = e.target.name();
		this.createInput(e, type);
		updateComponentsDetail({
			selectedShapeName: targetName,
			[targetName]: {
				content: '',
			},
		});
	};

	updateSelectedShapeName = selectedShapeName => {
		const { updateComponentsDetail } = this.props;

		updateComponentsDetail({
			selectedShapeName,
		});
	};

	updateComponentsDetail = ({ target, selectedShapeName, updateInput, isStep }) => {
		const { updateComponentsDetail } = this.props;
		const { x, y, name, width, height, scaleX, scaleY, rotation } = target.attrs;
		let realW = width;
		let realScaleX = scaleX;
		let realScaleY = scaleY;

		if (name && name.indexOf('_') === -1) {
			const type = getTypeByName(name);
			if ([...NORMAL_PRICE_TYPES, SHAPE_TYPES.TEXT].includes(type)) {
				// TEXT组件放大的是同层的RECT组件
				realW = target.parent.children[0].attrs.width;
				realScaleX = target.parent.children[0].attrs.scaleX || 1;
				realScaleY = target.parent.children[0].attrs.scaleY || 1;
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
				isStep,
				noUpdateLines: true,
				selectedShapeName,
				[name]: {
					type,
					name,
					x,
					y,
					width: realW,
					height,
					scaleX: realScaleX,
					scaleY: realScaleY,
					rotation
				},
			};
			componentDetail[name].lines = [
				[x, 0, x, SIZES.DEFAULT_MAX_CANVAS_LENGTH],
				[
					x + realW * realScaleX,
					0,
					x + realW * realScaleX,
					SIZES.DEFAULT_MAX_CANVAS_LENGTH,
				],
				[0, y, SIZES.DEFAULT_MAX_CANVAS_LENGTH, y],
				[
					0,
					y + height * realScaleY,
					SIZES.DEFAULT_MAX_CANVAS_LENGTH,
					y + height * realScaleY,
				],
			];
			updateComponentsDetail(componentDetail);
		}
	};

	handleDelete = () => {
		const {
			studio: { selectedShapeName, scopedComponents },
			deleteSelectedComponent,
			updateComponentsDetail
		} = this.props;
		if (selectedShapeName.indexOf(SHAPE_TYPES.RECT_SELECT) === -1) {
			deleteSelectedComponent(selectedShapeName);
		} else if (scopedComponents.length) {
			for (let i = 0; i < scopedComponents.length; i++) {
				deleteSelectedComponent({
					selectedShapeName: scopedComponents[i].name,
					isStep: i === scopedComponents.length - 1
				});
			}
			updateComponentsDetail({
				isStep: false,
				selectedShapeName: RECT_SELECT_NAME,
				[RECT_SELECT_NAME]: {
					width: 0,
					height: 0
				},
			});
			updateComponentsDetail({
				selectedShapeName: ''
			});
		}
		this.toggleRightToolBox({
			showRightToolBox: false,
			rightToolBoxPos: {
				left: -9999,
				top: -9999,
			},
		});
	};

	handleCut = () => {
		const {studio: {selectedShapeName, componentsDetail}, copySelectedComponent} = this.props;

		copySelectedComponent(componentsDetail[selectedShapeName]);
		this.handleDelete();
		this.toggleRightToolBox({
			showRightToolBox: false,
			rightToolBoxPos: {
				left: -9999,
				top: -9999,
			},
		});
	};

	handlePaste = () => {
		const {
			studio: {copiedComponent, scopedComponents, rightToolBoxPos, showRightToolBox},
			addComponent,
			updateComponentsDetail,
		} = this.props;
		if (copiedComponent.name) {
			if (copiedComponent.name.indexOf(SHAPE_TYPES.RECT_SELECT) === -1) {
				addComponent({
					...copiedComponent,
					x: rightToolBoxPos.left - SIZES.TOOL_BOX_WIDTH,
					y: rightToolBoxPos.top - SIZES.HEADER_HEIGHT,
				});
			} else if (scopedComponents.length) {
				const baseComponent = scopedComponents[0];
				addComponent({
					...baseComponent,
					x: rightToolBoxPos.left - SIZES.TOOL_BOX_WIDTH,
					y: rightToolBoxPos.top - SIZES.HEADER_HEIGHT,
					isStep: false
				});
				for (let i = 1; i < scopedComponents.length; i++) {
					addComponent({
						...scopedComponents[i],
						x: rightToolBoxPos.left - SIZES.TOOL_BOX_WIDTH + scopedComponents[i].x - baseComponent.x,
						y: rightToolBoxPos.top - SIZES.HEADER_HEIGHT + scopedComponents[i].y - baseComponent.y,
						isStep: i === scopedComponents.length - 1
					});
				}
				updateComponentsDetail({
					selectedShapeName: ''
				});
			} else {
				this.handleCrossTemplateCopy('menu');
			}
		} else {
			this.handleCrossTemplateCopy('menu');
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
	};

	handleCopy = () => {
		const {studio: {componentsDetail, selectedShapeName}, copySelectedComponent} = this.props;
		copySelectedComponent(componentsDetail[selectedShapeName]);
		this.toggleRightToolBox({
			showRightToolBox: false,
			rightToolBoxPos: {
				left: -9999,
				top: -9999,
			},
		});
	};

	handleCrossTemplateCopy = (type) => {
		const { studio: { zoomScale, rightToolBoxPos }, addComponent } = this.props;
		// 处理快捷键粘贴的位置
		const screenType = getLocationParam('screen');
		const px = (this.stageWidth - MAPS.screen[screenType].width * zoomScale) / 2;
		const py = (this.stageHeight - MAPS.screen[screenType].height * zoomScale) / 2;
		// 处理右键粘贴的位置
		const baseX = rightToolBoxPos.left - SIZES.TOOL_BOX_WIDTH;
		const baseY = rightToolBoxPos.top - SIZES.HEADER_HEIGHT - 10;

		const needCopyComponents = JSON.parse(localStorage.getItem('__studio_copy_cross_two_template__'));
		if (needCopyComponents && needCopyComponents.length) {
			const baseComponent = needCopyComponents[0];
			if (IMAGE_TYPES.includes(baseComponent.type)) {
				getImagePromise(baseComponent).then((detail) => {
					addComponent({
						...detail,
						x: type === 'menu' ? baseX : px + detail.startX * zoomScale,
						y: type === 'menu' ? baseY : py + detail.startY * zoomScale,
						isStep: false
					});
				});
			} else {
				addComponent({
					...baseComponent,
					x: type === 'menu' ? baseX : px + baseComponent.startX * zoomScale,
					y: type === 'menu' ? baseY : py + baseComponent.startY * zoomScale,
					isStep: false
				});
			}
			for (let i = 1; i < needCopyComponents.length; i++) {
				if (IMAGE_TYPES.includes(needCopyComponents[i].type)) {
					getImagePromise(needCopyComponents[i]).then((detail) => {
						addComponent({
							...detail,
							x: type === 'menu' ? baseX + (detail.startX - baseComponent.startX) * zoomScale : px + detail.startX * zoomScale,
							y: type === 'menu' ? baseY + (detail.startY - baseComponent.startY) * zoomScale : py + detail.startY * zoomScale,
							isStep: i === needCopyComponents.length - 1
						});
					});
				} else {
					addComponent({
						...needCopyComponents[i],
						x: type === 'menu' ? baseX + (needCopyComponents[i].startX - baseComponent.startX) * zoomScale : px + needCopyComponents[i].startX * zoomScale,
						y: type === 'menu' ? baseY + (needCopyComponents[i].startY - baseComponent.startY) * zoomScale : py + needCopyComponents[i].startY * zoomScale,
						isStep: i === needCopyComponents.length - 1
					});
				}
			}
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
		const stageBox = e.target.getStage().getContainer().getBoundingClientRect();
		const inputPosition = {
			x: stageBox.left + textPosition.x,
			y: stageBox.top + textPosition.y,
		};

		const offsetX = targetDetail.type.indexOf(SHAPE_TYPES.PRICE) > -1 ? 0 : -1;
		const offsetY = targetDetail.type.indexOf(SHAPE_TYPES.PRICE) > -1 ? 0 : 2;

		const inputEle = document.createElement('input');
		document.body.appendChild(inputEle);
		inputEle.setAttribute('id', 'textInput');
		inputEle.setAttribute('autocomplete', 'off');
		inputEle.value = targetDetail.content;
		inputEle.style.backgroundColor = 'transparent';
		// inputEle.style.border = '1px solid #ccc';
		// inputEle.style.borderRadius = '5px';
		inputEle.style.fontSize = `${targetDetail.fontSize * zoomScale}px`;
		inputEle.style.fontFamily = targetDetail.fontFamily;
		inputEle.style.color = targetDetail.fontColor;
		inputEle.style.position = 'absolute';
		inputEle.style.left = `${inputPosition.x + offsetX}px`;
		inputEle.style.top = `${inputPosition.y + offsetY}px`;
		inputEle.style.width = `${targetDetail.width * targetDetail.scaleX}px`;
		inputEle.style.height = `${targetDetail.fontSize * targetDetail.zoomScale}px`;
		// inputEle.style.lineHeight = `${targetDetail.lineHeight}`;
		inputEle.style.letterSpacing = `${targetDetail.letterSpacing}px`;
		inputEle.style.textAlign = targetDetail.align;
		inputEle.focus();
		this.setState({
			editing: true,
		});

		const saveToLocal = () => {
			const inputValue = inputEle.value;
			if (type.indexOf(SHAPE_TYPES.PRICE) > -1 && !RegExp.money.test(inputValue)) {
				message.warning(formatMessage({ id: 'studio.tool.error.price.format' }));
				inputEle.value = '';
				return;
			}
			this.setState({
				editing: false,
			});
			try {
				document.body.removeChild(inputEle);
				updateComponentsDetail({
					selectedShapeName: targetName,
					updatePrecision: true,
					[targetName]: {
						content: inputValue || formatMessage({ id: 'studio.action.text.db.click' }),
					},
				});
			} catch (evt) {
				console.log(evt);
			}
		};

		inputEle.addEventListener('keydown', evt => {
			// 按下enter保存
			evt.stopImmediatePropagation();
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
			textInput.style.height = `${config.fontSize * config.zoomScale}px`;
			// textInput.style.lineHeight = `${config.lineHeight}`;
		}
	};

	toggleRightToolBox = config => {
		const { toggleRightToolBox } = this.props;
		toggleRightToolBox(config);
	};

	updateMask = (showMask) => {
		this.setState({
			showMask
		});
	};

	detectFonts = () => {
		const fonts = ['Zfull-GB', 'Alibaba Sans'];
		const fontDetector = new FontDetector();

		this.setState({
			hasNoFonts: fonts.filter(font => !fontDetector.detect(font))
		});
	}

	downloadFont = (font) => {
		const fontUrls = {
			'Zfull-GB': 'Zfull-GB.ttf',
			'Alibaba Sans': 'AlibabaSans.otf'
		};
		const baseUrl = Config.API_ADDRESS.split(':')[0];
		downloadFileByClick(`http://${baseUrl}/static/${fontUrls[font]}`);
	};

	render() {
		const {
			stageWidth,
			stageHeight,
			refComponents,
			props: {
				updateComponentsDetail,
				updateState,
				copySelectedComponent,
				deleteSelectedComponent,
				addComponent,
				toggleRightToolBox,
				zoomOutOrIn,
				renameTemplate,
				fetchTemplateDetail,
				previewTemplate,
				studio: {
					selectedShapeName,
					selectedComponent,
					componentsDetail,
					showRightToolBox,
					rightToolBoxPos,
					copiedComponent,
					scopedComponents,
					noScopedComponents,
					zoomScale,
				},
				template: { bindFields, curTemplate },
			},
			state: { dragging, dragCopy, dragName, showMask, hasNoFonts },
		} = this;

		const lines = getNearestLines(componentsDetail, selectedShapeName, scopedComponents);
		const componentDetail = componentsDetail[selectedShapeName] || {};

		return (
			<div className={styles.board}>
				<Spin tip={formatMessage({ id: 'studio.loading' })} spinning={false} />
				<div className={styles['board-header']}>
					<BoardHeader
						{...{
							templateInfo: curTemplate,
							zoomScale,
							saveAsDraft: this.handleSaveAsDraft,
							downloadAsDraft: this.handleDownloadAsDraft,
							zoomOutOrIn,
							preStep: this.preStep,
							nextStep: this.nextStep,
							renameTemplate,
							fetchTemplateDetail,
							previewTemplate
						}}
					/>
				</div>
				<div className={styles['board-content']}>
					<div className={styles['board-tools']}>
						<BoardTools addComponent={addComponent} zoomScale={zoomScale} />
					</div>
					<div className={styles['board-stage']}>
						<Stage
							width={stageWidth}
							height={stageHeight}
							onMouseDown={this.handleStageMouseDown}
							onMouseMove={this.handleStageMouseMove}
							onMouseUp={this.handleStageMouseUp}
							onDragStart={this.handleStageShapeStart}
							onDragMove={this.handleStageShapeMove}
							onDragEnd={this.handleStageShapeEnd}
							onTransform={this.handleShapeTransform}
							onTransformEnd={this.handleShapeTransformEnd}
							onContextMenu={this.handleContextMenu}
							onWheel={this.handleWheel}
						>
							<Layer x={0} y={0} width={stageWidth} height={stageHeight}>
								{Object.keys(componentsDetail).map(key => {
									const targetDetail = componentsDetail[key];
									const noScopedNames = [RECT_SELECT_NAME].concat(noScopedComponents.map(item => item.name));
									if (targetDetail.name && !noScopedNames.includes(targetDetail.name)) {
										return generateShape({
											refComponents,
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
											onTransformEnd: this.handleShapeTransformEnd,
											onDblClick: this.handleShapeDblClick,
										});
									}
									return undefined;
								})}
								{
									componentsDetail[RECT_SELECT_NAME] ?
										generateShape({
											refComponents,
											...componentsDetail[RECT_SELECT_NAME],
											key: RECT_SELECT_NAME,
											stageWidth,
											stageHeight,
											scaleX: componentsDetail[RECT_SELECT_NAME].scaleX || 1,
											scaleY: componentsDetail[RECT_SELECT_NAME].scaleY || 1,
											zoomScale,
											ratio: componentsDetail[RECT_SELECT_NAME].ratio || 1,
											selected: selectedShapeName === RECT_SELECT_NAME,
											onTransform: this.handleShapeTransform,
											onTransformEnd: this.handleShapeTransformEnd,
											onDblClick: this.handleShapeDblClick,
										}) :
										null
								}
								{Object.keys(noScopedComponents).map(key => {
									const targetDetail = noScopedComponents[key];
									if (targetDetail.name) {
										return generateShape({
											refComponents,
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
											onTransformEnd: this.handleShapeTransformEnd,
											onDblClick: this.handleShapeDblClick,
										});
									}
									return undefined;
								})}
								{!dragging &&
									selectedShapeName &&
									componentsDetail[selectedShapeName].type !==
									SHAPE_TYPES.RECT_FIX ? (
										<MTransformer
											selectedShapeName={selectedShapeName}
											componentsDetail={componentsDetail}
											zoomScale={zoomScale}
										/>
									) : null
								}
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
						{showMask ? <div className={styles.mask} /> : <></>}
					</div>
					{selectedShapeName && selectedShapeName.indexOf(SHAPE_TYPES.RECT_FIX) === -1 && selectedShapeName.indexOf(SHAPE_TYPES.RECT_SELECT) === -1 ? (
						<div className={styles['tool-box']}>
							<RightToolBox
								{...{
									bindFields,
									selectedShapeName,
									selectedComponent,
									componentsDetail,
									zoomScale,
									templateInfo: curTemplate,
									updateMask: this.updateMask,
									updateComponentsDetail,
									updateState,
									deleteSelectedComponent,
									addComponent,
								}}
							/>
						</div>
					) : <div className={styles['tool-box']} />}
				</div>
				{showRightToolBox ? (
					<ContextMenu
						{...{
							color: componentDetail.fontColor,
							fontSize: componentDetail.fontSize,
							text: componentDetail.context,
							position: rightToolBoxPos,
							componentsDetail,
							selectedShapeName,
							copiedComponent,
							scopedComponents,
							showRightToolBox,
							updateComponentsDetail,
							deleteSelectedComponent,
							copySelectedComponent,
							addComponent,
							toggleRightToolBox,
							onDeleteHandler: this.handleDelete,
							onCutHandler: this.handleCut,
							onPasteHandler: this.handlePaste,
							onCopyHandler: this.handleCopy,
						}}
					/>
				) : null}
				<DragCopy
					dragCopy={dragCopy}
					dragName={dragName}
					refComponents={refComponents}
					componentsDetail={componentsDetail}
				/>
				<Modal
					title={formatMessage({id: 'studio.tool.font.download.title'})}
					closable={false}
					footer={null}
					visible={!!hasNoFonts.length}
				>
					<Alert message={formatMessage({id: 'studio.tool.font.download.alert'})} type="info" showIcon />
					<div className={styles['font-download-main']}>
						{
							hasNoFonts.map(font => (
								<p className={styles['font-download-item']} key={font}>
									<span>{font}</span>
									<span className={styles['font-download-icon']} onClick={() => this.downloadFont(font)}>
										<Icon type="download" />
									</span>
								</p>
							))
						}
					</div>
				</Modal>
			</div>
		);
	}
}

export default Studio;
