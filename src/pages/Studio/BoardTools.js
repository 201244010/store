import React, {Fragment} from 'react';
import ToolItem from './ToolItem';
import {SHAPE_TYPES} from '@/constants/studio';
import { generatorId } from '@/utils/studio';
import * as styles from './index.less';

export default function BoardTools(props) {
    const { addComponent } = props;
    return (
        <div className={styles["tools-block"]}>
            <h4>基本元件</h4>
            <ToolItem
                className={`${styles.item} ${styles["item-rect"]}`}
                type={SHAPE_TYPES.RECT}
                id={generatorId(SHAPE_TYPES.RECT)}
                addComponent={addComponent}
            >
                <Fragment>
                    <img src={require('@/assets/studio/rect.svg')} alt="" />
                    <span>矩形</span>
                </Fragment>
            </ToolItem>
            <ToolItem
                className={`${styles.item} ${styles["item-text"]}`}
                type={SHAPE_TYPES.TEXT}
                id={generatorId(SHAPE_TYPES.TEXT)}
                addComponent={addComponent}
            >
                <Fragment>
                    <img src={require('@/assets/studio/text.svg')} alt="" />
                    <span>文本</span>
                </Fragment>
            </ToolItem>
            <ToolItem
                className={`${styles.item} ${styles["item-circle"]}`}
                type={SHAPE_TYPES.HLine}
                id={generatorId(SHAPE_TYPES.HLine)}
                addComponent={addComponent}
            >
                <Fragment>
                    <img src={require('@/assets/studio/hLine.svg')} alt="" />
                    <span>横向直线</span>
                </Fragment>
            </ToolItem>
            <ToolItem
                className={`${styles.item} ${styles["item-v-line"]}`}
                type={SHAPE_TYPES.VLine}
                id={generatorId(SHAPE_TYPES.VLine)}
                addComponent={addComponent}
            >
                <Fragment>
                    <img src={require('@/assets/studio/vLine.svg')} alt="" />
                    <span>竖向直线</span>
                </Fragment>
            </ToolItem>
            <ToolItem
                className={`${styles.item} ${styles["item-image"]}`}
                type={SHAPE_TYPES.IMAGE}
                id={generatorId(SHAPE_TYPES.IMAGE)}
                addComponent={addComponent}
            >
                <Fragment>
                    <img src={require('@/assets/studio/image.svg')} alt="" />
                    <span>图片</span>
                </Fragment>
            </ToolItem>
        </div>
    )
}