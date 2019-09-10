import { Shape } from 'bizcharts';

export function shape(lightType, chartName) {
	Shape.registerShape('interval', chartName, {
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
				origin.item !== lightType ? points[0].x : points[0].x - xWidth * 0.15,
				points[0].y,
			]);
			path.push([
				'L',
				origin.item !== lightType ? points[1].x : points[1].x - xWidth * 0.15,
				points[1].y,
			]);
			path.push([
				'L',
				origin.item !== lightType
					? points[0].x + xWidth
					: points[0].x + xWidth * 1.15,
				points[2].y,
			]);
			path.push([
				'L',
				origin.item !== lightType
					? points[0].x + xWidth
					: points[0].x + xWidth * 1.15,
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

export const lightColor = 'l(45) 0:#66BDFF 1:#3D84FF';
export const normalColor = 'transparent';
export const lightShadow = 'rgba(255,255,255,1)';
export const normalShadow = 'transparent';
export const geomColor = 'rgba(125,158,250,0.16)';
