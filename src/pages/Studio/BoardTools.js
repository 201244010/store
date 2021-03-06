import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import ToolItem from './ToolItem';
import { SHAPE_TYPES } from '@/constants/studio';
import { generatorId } from '@/utils/studio';
import * as styles from './index.less';

export default function BoardTools(props) {
	const { addComponent } = props;
	return (
		<Fragment>
			<div className={`${styles['tools-block']} ${styles.basic}`}>
				<h4>{formatMessage({ id: 'studio.basic.component' })}</h4>
				<ToolItem
					className={`${styles.item} ${styles['item-text']}`}
					type={SHAPE_TYPES.TEXT}
					id={generatorId(SHAPE_TYPES.TEXT)}
					addComponent={addComponent}
				>
					<Fragment>
						<img src={require('@/assets/studio/text.svg')} />
						<span>{formatMessage({ id: 'studio.component.text' })}</span>
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
						<span>{formatMessage({ id: 'studio.component.rect' })}</span>
					</Fragment>
				</ToolItem>
				<ToolItem
					className={`${styles.item} ${styles['item-circle']}`}
					type={SHAPE_TYPES.LINE_H}
					id={generatorId(SHAPE_TYPES.LINE_H)}
					addComponent={addComponent}
				>
					<Fragment>
						<img src={require('@/assets/studio/hLine.svg')} />
						<span>{formatMessage({ id: 'studio.component.line.h' })}</span>
					</Fragment>
				</ToolItem>
				<ToolItem
					className={`${styles.item} ${styles['item-v-line']}`}
					type={SHAPE_TYPES.LINE_V}
					id={generatorId(SHAPE_TYPES.LINE_V)}
					addComponent={addComponent}
				>
					<Fragment>
						<img src={require('@/assets/studio/vLine.svg')} />
						<span>{formatMessage({ id: 'studio.component.line.v' })}</span>
					</Fragment>
				</ToolItem>
				<ToolItem
					className={`${styles.item} ${styles['item-image']}`}
					type={SHAPE_TYPES.IMAGE}
					id={generatorId(SHAPE_TYPES.IMAGE)}
					addComponent={addComponent}
				>
					<Fragment>
						<img src={require('@/assets/studio/image.svg')} />
						<span>{formatMessage({ id: 'studio.component.image' })}</span>
					</Fragment>
				</ToolItem>
			</div>
			<div className={`${styles['tools-block']} ${styles.price}`}>
				<h4>{formatMessage({ id: 'studio.price.component' })}</h4>
				<ToolItem
					className={`${styles['item-price']} ${styles['item-price-white-normal']}`}
					type={SHAPE_TYPES.PRICE_NORMAL_WHITE}
					id={generatorId(SHAPE_TYPES.PRICE_NORMAL_WHITE)}
					addComponent={addComponent}
				>
					<span>99.00</span>
				</ToolItem>
				<ToolItem
					className={`${styles['item-price']} ${styles['item-price-white-super']}`}
					type={SHAPE_TYPES.PRICE_SUPER_WHITE}
					id={generatorId(SHAPE_TYPES.PRICE_SUPER_WHITE)}
					addComponent={addComponent}
				>
					<span>
						99.<sup>00</sup>
					</span>
				</ToolItem>
				<ToolItem
					className={`${styles['item-price']} ${styles['item-price-white-sub']}`}
					type={SHAPE_TYPES.PRICE_SUB_WHITE}
					id={generatorId(SHAPE_TYPES.PRICE_SUB_WHITE)}
					addComponent={addComponent}
				>
					<span>
						99.<sub>00</sub>
					</span>
				</ToolItem>
				<ToolItem
					className={`${styles['item-price']} ${styles['item-price-black-normal']}`}
					type={SHAPE_TYPES.PRICE_NORMAL_BLACK}
					id={generatorId(SHAPE_TYPES.PRICE_NORMAL_BLACK)}
					addComponent={addComponent}
				>
					<span>99.00</span>
				</ToolItem>
				<ToolItem
					className={`${styles['item-price']} ${styles['item-price-black-super']}`}
					type={SHAPE_TYPES.PRICE_SUPER_BLACK}
					id={generatorId(SHAPE_TYPES.PRICE_SUPER_BLACK)}
					addComponent={addComponent}
				>
					<span>
						99.<sup>00</sup>
					</span>
				</ToolItem>
				<ToolItem
					className={`${styles['item-price']} ${styles['item-price-black-sub']}`}
					type={SHAPE_TYPES.PRICE_SUB_BLACK}
					id={generatorId(SHAPE_TYPES.PRICE_SUB_BLACK)}
					addComponent={addComponent}
				>
					<span>
						99.<sub>00</sub>
					</span>
				</ToolItem>
			</div>
			<div className={`${styles['tools-block']} ${styles.code}`}>
				<h4>{formatMessage({ id: 'studio.code.component' })}</h4>
				<ToolItem
					className={`${styles.item} ${styles['item-h-code']}`}
					type={SHAPE_TYPES.CODE_H}
					id={generatorId(SHAPE_TYPES.CODE_H)}
					addComponent={addComponent}
				>
					<Fragment>
						<img src={require('@/assets/studio/code_h.svg')} />
						<span>{formatMessage({ id: 'studio.component.barcode' })}</span>
					</Fragment>
				</ToolItem>
				<ToolItem
					className={`${styles.item} ${styles['item-v-code']}`}
					type={SHAPE_TYPES.CODE_V}
					id={generatorId(SHAPE_TYPES.CODE_V)}
					addComponent={addComponent}
				>
					<Fragment>
						<img src={require('@/assets/studio/code_v.svg')} />
						<span>{formatMessage({ id: 'studio.component.barcode.v' })}</span>
					</Fragment>
				</ToolItem>
				<ToolItem
					className={`${styles.item} ${styles['item-qr-code']}`}
					type={SHAPE_TYPES.CODE_QR}
					id={generatorId(SHAPE_TYPES.CODE_QR)}
					addComponent={addComponent}
				>
					<Fragment>
						<img src={require('@/assets/studio/code_qr.svg')} />
						<span>{formatMessage({ id: 'studio.component.qrcode' })}</span>
					</Fragment>
				</ToolItem>
			</div>
		</Fragment>
	);
}
