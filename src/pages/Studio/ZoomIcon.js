import React, { Component } from 'react';
import { Icon } from 'antd';
import * as styles from './index.less';

export default class ZoomIcon extends Component {
    handleZoom = (type) => {
        const { zoomScale, updateState } = this.props;
        let realZoomScale = zoomScale + ( type === 'out' ? 0.1 : -0.1);
        if (realZoomScale > 3) {
            realZoomScale = 3;
        } else if (realZoomScale < 0.5) {
            realZoomScale = 0.5
        }

        updateState({
            zoomScale: realZoomScale,
            selectedShapeName: ''
        });
    };

    render() {
        const { zoomScale } = this.props;

        return (
            <div className={styles["zoom-icon-wrapper"]}>
                <div className={styles["zoom-icon"]}>
                    <Icon type="plus" onClick={() => this.handleZoom('out')} />
                    <span>{(zoomScale * 100).toFixed()}%</span>
                    <Icon type="minus" onClick={() => this.handleZoom('in')} />
                </div>
                <span className={styles.name}>缩放</span>
            </div>
        )
    }
}