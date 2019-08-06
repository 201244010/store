import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { RECT_SELECT_NAME, SHAPE_TYPES, SIZES } from '@/constants/studio';
import * as styles from './index.less';

export default class ContextMenu extends Component {
	handleCopy = () => {
		const { componentsDetail, selectedShapeName, copySelectedComponent } = this.props;
		this.hideRightToolBox();
		copySelectedComponent(componentsDetail[selectedShapeName]);
	};

	handlePaste = () => {
		const { copiedComponent, scopedComponents, position, showRightToolBox, addComponent, updateComponentsDetail } = this.props;
		if (showRightToolBox) {
			this.hideRightToolBox();
		}
		if (copiedComponent.name) {
			if (copiedComponent.name.indexOf(SHAPE_TYPES.RECT_SELECT) === -1) {
				addComponent({
					...copiedComponent,
					x: position.left - SIZES.TOOL_BOX_WIDTH,
					y: position.top - SIZES.HEADER_HEIGHT,
				});
			} else if (scopedComponents.length) {
				const baseComponent = scopedComponents[0];
				addComponent({
					...baseComponent,
					x: position.left - SIZES.TOOL_BOX_WIDTH,
					y: position.top - SIZES.HEADER_HEIGHT,
					isStep: false
				});
				for (let i = 1; i < scopedComponents.length; i++) {
					addComponent({
						...scopedComponents[i],
						x: position.left - SIZES.TOOL_BOX_WIDTH + scopedComponents[i].x - baseComponent.x,
						y: position.top - SIZES.HEADER_HEIGHT + scopedComponents[i].y - baseComponent.y,
						isStep: i === scopedComponents.length - 1
					});
				}
				updateComponentsDetail({
					selectedShapeName: ''
				});
			}
		}
	};

	handleDelete = () => {
		const { selectedShapeName, scopedComponents, deleteSelectedComponent, updateComponentsDetail } = this.props;
		if (selectedShapeName.indexOf(SHAPE_TYPES.RECT_SELECT) === -1) {
			deleteSelectedComponent(selectedShapeName);
		} else if (scopedComponents.length) {
			for (let i = 0; i < scopedComponents.length - 1; i++) {
				deleteSelectedComponent({
					selectedShapeName: scopedComponents[i].name,
					isStep: false
				});
			}
			deleteSelectedComponent({
				selectedShapeName: scopedComponents[scopedComponents.length - 1].name,
				isStep: true
			});
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
		this.hideRightToolBox();
	};

	handleCut = () => {
		const {
			selectedShapeName, componentsDetail, copySelectedComponent, deleteSelectedComponent
		} = this.props;
		copySelectedComponent(componentsDetail[selectedShapeName]);
		deleteSelectedComponent(selectedShapeName);
		this.hideRightToolBox();
	};

	hideRightToolBox = () => {
		const { toggleRightToolBox } = this.props;

		toggleRightToolBox({
			showRightToolBox: false,
			rightToolBoxPos: {
				left: -9999,
				top: -9999,
			},
		});
	};

	render() {
		const { props: { position, selectedShapeName, copiedComponent, scopedComponents } } = this;
		const canCopyOrDelete = selectedShapeName && selectedShapeName.indexOf(SHAPE_TYPES.RECT_FIX) === -1;
		const canCut = selectedShapeName && selectedShapeName.indexOf(SHAPE_TYPES.RECT_SELECT) === -1;
		const canPaste = copiedComponent && (copiedComponent.type === SHAPE_TYPES.RECT_SELECT ? (scopedComponents && scopedComponents.length) : copiedComponent.type);

		return (
			<div
				className={styles['right-tool-box']}
				style={{ left: position.left, top: position.top }}
			>
				{
					(canCopyOrDelete && canCut) ?
						<div className={styles['context-item']} onClick={this.handleCut}>
							{formatMessage({ id: 'studio.action.cut' })}
						</div> :
						<div className={`${styles['context-item']} ${styles.disabled}`}>
							{formatMessage({ id: 'studio.action.cut' })}
						</div>
				}
				{canCopyOrDelete ? (
					<div className={styles['context-item']} onClick={this.handleCopy}>
						{formatMessage({ id: 'studio.action.copy' })}
					</div>
				) : (
					<div className={`${styles['context-item']} ${styles.disabled}`}>
						{formatMessage({ id: 'studio.action.copy' })}
					</div>
				)}
				{canPaste ? (
					<div className={styles['context-item']} onClick={this.handlePaste}>
						{formatMessage({ id: 'studio.action.paste' })}
					</div>
				) : null}
				{canCopyOrDelete ? (
					<div
						className={`${styles['context-item']} ${styles['last-item']}`}
						onClick={this.handleDelete}
					>
						{formatMessage({ id: 'studio.action.delete' })}
					</div>
				) : (
					<div
						className={`${styles['context-item']} ${styles['last-item']} ${
							styles.disabled
						}`}
					>
						{formatMessage({ id: 'studio.action.delete' })}
					</div>
				)}
			</div>
		);
	}
}
