import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { SHAPE_TYPES, SIZES } from '@/constants/studio';
import * as styles from './index.less';

export default class ContextMenu extends Component {
    handleCopy = () => {
        const { componentsDetail, selectedShapeName, copySelectedComponent } = this.props;
        this.hideRightToolBox();
        copySelectedComponent(componentsDetail[selectedShapeName]);
    };

    handlePaste = () => {
        const { copiedComponent, position, showRightToolBox, addComponent } = this.props;
        if (showRightToolBox) {
            this.hideRightToolBox();
        }
        if (copiedComponent.name) {
            addComponent({
                ...copiedComponent,
                x: position.left - SIZES.TOOL_BOX_WIDTH,
                y: position.top - SIZES.HEADER_HEIGHT,
            });
        }
    };

    handleDelete = () => {
        const { selectedShapeName, deleteSelectedComponent } = this.props;
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
        const {
            props: { position, selectedShapeName, copiedComponent },
        } = this;
        const canCopyOrDelete =
            selectedShapeName && selectedShapeName.indexOf(SHAPE_TYPES.RECT_FIX) === -1;

        return (
            <div
                className={styles['right-tool-box']}
                style={{ left: position.left, top: position.top }}
            >
                {canCopyOrDelete ? (
                    <div className={styles['context-item']} onClick={this.handleCopy}>
                        {formatMessage({ id: 'studio.action.copy' })}
                    </div>
                ) : (
                    <div className={`${styles['context-item']} ${styles.disabled}`}>复制</div>
                )}
                {copiedComponent && copiedComponent.type ? (
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
