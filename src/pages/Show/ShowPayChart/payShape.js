import { Shape } from 'bizcharts';

export function shape(maxItem) {
	Shape.registerShape('interval', 'sliceShape', {
		draw(cfg, container) {
			const {
				points,
				origin: { _origin },
				color,
			} = cfg;
			const origin = _origin;
			const xWidth = points[2].x - points[1].x;
			let path = [];
			path.push([
				'M',
				origin.item !== maxItem.item ? points[0].x : points[0].x - xWidth * 0.2,
				points[0].y,
			]);
			path.push([
				'L',
				origin.item !== maxItem.item ? points[1].x : points[1].x - xWidth * 0.2,
				points[1].y,
			]);
			path.push([
				'L',
				origin.item !== maxItem.item
					? points[0].x + xWidth
					: points[0].x + xWidth * 1.2,
				points[2].y,
			]);
			path.push([
				'L',
				origin.item !== maxItem.item
					? points[0].x + xWidth
					: points[0].x + xWidth * 1.2,
				points[3].y,
			]);
			path.push('Z');
			path = this.parsePath(path);
			return container.addShape('path', {
				attrs: {
					fill: color,
					path,
				},
			});
		},
	});
}

export const COLORS = {
	POINT_COLOR: {
		ZHI_FU_BAO: '#2D59F4',
		WECHAT: '#2DE29A',
		QR_CODE: '#FFDF66',
		CARD: '#FFC489',
		CASH: '#BB99FF',
		OTHER: '#6666FF',
	},
	FILL_COLOR: {
		ZHI_FU_BAO: 'l(45) 0:#66BDFF 1:#3D84FF',
		WECHAT: 'l(45) 0:#5EFFC9 1:#00FF99',
		QR_CODE: 'l(45) 0:#FFB366 1:#FFE16B',
		CARD: 'l(45) 0:#FF8989 1:#FF9B82',
		CASH: 'l(45) 0:#AA80FF 1:#CC99FF',
		OTHER: 'l(45) 0:#827DFF 1:#6670FF',	
	},
	STROKE: '#FFFFFF',
	SHADOW_LIGHT: 'rgba(255,255,255,1)',
	SHADOW_NOR: 'transparent',
	GEOM_COLOR: 'rgba(125,158,250,0.16)',
};
