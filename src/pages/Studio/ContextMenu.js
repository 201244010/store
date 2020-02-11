import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { SHAPE_TYPES } from '@/constants/studio';
import * as styles from './index.less';

export default class ContextMenu extends Component {
	render() {
		const { props: { position, selectedShapeName, copiedComponent, scopedComponents, onDeleteHandler, onCutHandler, onPasteHandler, onCopyHandler } } = this;
		const needCopyComponents = JSON.parse(localStorage.getItem('__studio_copy_cross_two_template__'));
		const canCopyOrDelete = selectedShapeName && selectedShapeName.indexOf(SHAPE_TYPES.RECT_FIX) === -1;
		// const canCut = selectedShapeName && selectedShapeName.indexOf(SHAPE_TYPES.RECT_SELECT) === -1;
		const canPaste =
			(copiedComponent && (copiedComponent.type === SHAPE_TYPES.RECT_SELECT ? (scopedComponents && scopedComponents.length) : copiedComponent.type)) ||
			(needCopyComponents && needCopyComponents.length);

		return (
			<div
				className={styles['right-tool-box']}
				style={{ left: position.left, top: position.top }}
			>
				{
					(canCopyOrDelete) ?
						<div className={styles['context-item']} onClick={onCutHandler}>
							{formatMessage({ id: 'studio.action.cut' })}
						</div> :
						<div className={`${styles['context-item']} ${styles.disabled}`}>
							{formatMessage({ id: 'studio.action.cut' })}
						</div>
				}
				{canCopyOrDelete ? (
					<div className={styles['context-item']} onClick={onCopyHandler}>
						{formatMessage({ id: 'studio.action.copy' })}
					</div>
				) : (
					<div className={`${styles['context-item']} ${styles.disabled}`}>
						{formatMessage({ id: 'studio.action.copy' })}
					</div>
				)}
				{canPaste ? (
					<div className={styles['context-item']} onClick={onPasteHandler}>
						{formatMessage({ id: 'studio.action.paste' })}
					</div>
				) : null}
				{canCopyOrDelete ? (
					<div
						className={`${styles['context-item']} ${styles['last-item']}`}
						onClick={onDeleteHandler}
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
