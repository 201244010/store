import React, { Component } from 'react';
import { Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import { getLocationParam } from '@/utils/utils';
import * as styles from './index.less';

export default class ZoomIcon extends Component {
	handleZoom = type => {
		const { zoomScale, zoomOutOrIn } = this.props;
		let realZoomScale = zoomScale + (type === 'out' ? 0.1 : -0.1);
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
	};

	render() {
		const { zoomScale } = this.props;

		return (
			<div className={styles['zoom-icon-wrapper']}>
				<div className={styles['zoom-icon']}>
					<Icon type="minus" onClick={() => this.handleZoom('in')} />
					<span id="zoomScale">{(zoomScale * 100).toFixed()}%</span>
					<Icon type="plus" style={{background: '#5085e3', color: '#fff'}} onClick={() => this.handleZoom('out')} />
				</div>
				<span className={styles.name}>{formatMessage({ id: 'studio.action.zoom' })}</span>
			</div>
		);
	}
}
