import React from 'react';
import {Icon} from 'antd';
import * as styles from './index.less';

export default function ZoomIcon() {
    return (
        <div className={styles["zoom-icon-wrapper"]}>
            <div className={styles["zoom-icon"]}>
                <Icon type="plus" />
                <span>100%</span>
                <Icon type="minus" />
            </div>
            <span className={styles.name}>缩放</span>
        </div>
    )
}