import { Shape } from 'bizcharts';
import { DASHBOARD } from '@/pages/DashBoard/constants';

const { PURCHASE_ORDER } = DASHBOARD;

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
		[PURCHASE_ORDER[0]]: 'point-zhiFuBao',
		[PURCHASE_ORDER[1]]: 'point-weChat',
		[PURCHASE_ORDER[2]]: 'point-qrCode',
		[PURCHASE_ORDER[3]]: 'point-card',
		[PURCHASE_ORDER[4]]: 'point-cash',
		[PURCHASE_ORDER[5]]: 'point-other',
	},
	FILL_COLOR: {
		[PURCHASE_ORDER[0]]: 'l(45) 0:#66BDFF 1:#3D84FF',
		[PURCHASE_ORDER[1]]: 'l(45) 0:#5EFFC9 1:#00FF99',
		[PURCHASE_ORDER[2]]: 'l(45) 0:#FFB366 1:#FFE16B',
		[PURCHASE_ORDER[3]]: 'l(45) 0:#FF8989 1:#FF9B82',
		[PURCHASE_ORDER[4]]: 'l(45) 0:#AA80FF 1:#CC99FF',
		[PURCHASE_ORDER[5]]: 'l(45) 0:#827DFF 1:#6670FF',	
	},
	STROKE: '#FFFFFF',
	SHADOW_LIGHT: 'rgba(255,255,255,1)',
	SHADOW_NOR: 'transparent',
	GEOM_COLOR: 'rgba(125,158,250,0.16)',
};
