import React, { Component } from 'react';
import { SIZES } from '@/constants/studio';
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
            props: { position },
        } = this;

        return (
            <div
                className={styles['right-tool-box']}
                style={{ left: position.left, top: position.top }}
            >
                <div className={styles['context-item']} onClick={this.handleCopy}>
                    复制
                </div>
                <div className={styles['context-item']} onClick={this.handlePaste}>
                    粘贴
                </div>
                <div
                    className={`${styles['context-item']} ${styles['last-item']}`}
                    onClick={this.handleDelete}
                >
                    删除
                </div>
            </div>
        );
    }
}
