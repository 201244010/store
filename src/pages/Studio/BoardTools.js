import React, { Fragment } from 'react';
import ToolItem from './ToolItem';
import { SHAPE_TYPES } from '@/constants/studio';
import { generatorId } from '@/utils/studio';
import * as styles from './index.less';

export default function BoardTools(props) {
    const { addComponent } = props;
    return (
        <Fragment>
            <div className={`${styles['tools-block']} ${styles.basic}`}>
                <h4>基本元件</h4>
                <ToolItem
                    className={`${styles.item} ${styles['item-text']}`}
                    type={SHAPE_TYPES.TEXT}
                    id={generatorId(SHAPE_TYPES.TEXT)}
                    addComponent={addComponent}
                >
                    <Fragment>
                        <img src={require('@/assets/studio/text.svg')} />
                        <span>文本</span>
                    </Fragment>
                </ToolItem>
                <ToolItem
                    className={`${styles.item} ${styles['item-rect']}`}
                    type={SHAPE_TYPES.RECT}
                    id={generatorId(SHAPE_TYPES.RECT)}
                    addComponent={addComponent}
                >
                    <Fragment>
                        <img src={require('@/assets/studio/rect.svg')} />
                        <span>矩形</span>
                    </Fragment>
                </ToolItem>
                {/*
                        <ToolItem
                            className={`${styles.item} ${styles["item-circle"]}`}
                            type={SHAPE_TYPES.HLine}
                            id={generatorId(SHAPE_TYPES.HLine)}
                            addComponent={addComponent}
                        >
                            <Fragment>
                                <img src={require("@/assets/studio/hLine.svg")} />
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
                                <img src={require("@/assets/studio/vLine.svg")} />
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
                                <img src={require("@/assets/studio/image.svg")} />
                                <span>图片</span>
                            </Fragment>
                        </ToolItem>
                     */}
            </div>
            <div className={`${styles['tools-block']} ${styles.price}`}>
                <h4>价格</h4>
                <ToolItem
                    className={`${styles['item-price']} ${styles['item-price-white-normal']}`}
                    type={SHAPE_TYPES.PRICE_NORMAL_WHITE}
                    id={generatorId(SHAPE_TYPES.PRICE_NORMAL_WHITE)}
                    addComponent={addComponent}
                >
                    <span>99.00</span>
                </ToolItem>
                <ToolItem
                    className={`${styles["item-price"]} ${styles["item-price-white-super"]}`}
                    type={SHAPE_TYPES.PRICE_SUPER_WHITE}
                    id={generatorId(SHAPE_TYPES.PRICE_SUPER_WHITE)}
                    addComponent={addComponent}
                >
                    <span>99.<sup>00</sup></span>
                </ToolItem>
                <ToolItem
                    className={`${styles["item-price"]} ${styles["item-price-white-sub"]}`}
                    type={SHAPE_TYPES.PRICE_SUB_WHITE}
                    id={generatorId(SHAPE_TYPES.PRICE_SUB_WHITE)}
                    addComponent={addComponent}
                >
                    <span>99.<sub>00</sub></span>
                </ToolItem>
                <ToolItem
                    className={`${styles['item-price']} ${styles['item-price-normal']}`}
                    type={SHAPE_TYPES.PRICE_NORMAL_BLACK}
                    id={generatorId(SHAPE_TYPES.PRICE_NORMAL_BLACK)}
                    addComponent={addComponent}
                >
                    <span>99.00</span>
                </ToolItem>
                <ToolItem
                    className={`${styles['item-price']} ${styles['item-price-super']}`}
                    type={SHAPE_TYPES.PRICE_SUPER_BLACK}
                    id={generatorId(SHAPE_TYPES.PRICE_SUPER_BLACK)}
                    addComponent={addComponent}
                >
                    <span>99.<sup>00</sup></span>
                </ToolItem>
                <ToolItem
                    className={`${styles['item-price']} ${styles['item-price-sub']}`}
                    type={SHAPE_TYPES.PRICE_SUB_BLACK}
                    id={generatorId(SHAPE_TYPES.PRICE_SUB_BLACK)}
                    addComponent={addComponent}
                >
                    <span>99.<sub>00</sub></span>
                </ToolItem>
            </div>
            <div className={`${styles['tools-block']} ${styles.code}`}>
                <h4>条码/二维码</h4>
                <ToolItem
                    className={`${styles.item} ${styles['item-h-code']}`}
                    type={SHAPE_TYPES.CODE_H}
                    id={generatorId(SHAPE_TYPES.CODE_H)}
                    addComponent={addComponent}
                >
                    <Fragment>
                        <img src={require('@/assets/studio/code_h.svg')} />
                        <span>横向条码</span>
                    </Fragment>
                </ToolItem>
                {
                    /*
                    * <ToolItem
                    className={`${styles.item} ${styles['item-v-code']}`}
                    type={SHAPE_TYPES.CODE_V}
                    id={generatorId(SHAPE_TYPES.CODE_V)}
                    addComponent={addComponent}
                >
                    <Fragment>
                        <img src={require('@/assets/studio/code_v.svg')} />
                        <span>竖向条码</span>
                    </Fragment>
                </ToolItem>
                    * */
                }
                <ToolItem
                    className={`${styles.item} ${styles['item-qr-code']}`}
                    type={SHAPE_TYPES.CODE_QR}
                    id={generatorId(SHAPE_TYPES.CODE_QR)}
                    addComponent={addComponent}
                >
                    <Fragment>
                        <img src={require('@/assets/studio/code_qr.svg')} />
                        <span>二维码</span>
                    </Fragment>
                </ToolItem>
            </div>
        </Fragment>
    );
}
