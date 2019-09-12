import { Shape } from 'bizcharts';

Shape.registerShape('interval', 'rateShape', {
	getPoints(pointInfo) {
		const { x, y, y0, size } = pointInfo;
		const n = 60;
		const unit = size / n;
		return [
			{ x: x - (n / 3) * unit, y: y0 },
			{ x: x - (n / 2.5) * unit, y: y - y0 < unit ? y0 : y0 + unit },
			{ x: x - (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y0 : y0 + (n / 20) * unit },
			{ x: x - (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y0 : y0 + (n / 6) * unit },
			{ x: x - (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y0 : y0 + (n / 3) * unit },
			{ x: x - (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y : y - (n / 3) * unit },
			{ x: x - (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y : y - (n / 6) * unit },
			{ x: x - (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y : y - (n / 20) * unit },
			{ x: x - (n / 2.5) * unit, y: y - y0 < unit ? y : y - unit },
			{ x: x - (n / 3) * unit, y },
			{ x: x + (n / 3) * unit, y },
			{ x: x + (n / 2.5) * unit, y: y - y0 < unit ? y : y - unit },
			{ x: x + (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y : y - (n / 20) * unit },
			{ x: x + (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y : y - (n / 6) * unit },
			{ x: x + (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y : y - (n / 3) * unit },
			{ x: x + (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y0 : y0 + (n / 3) * unit },
			{ x: x + (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y0 : y0 + (n / 6) * unit },
			{ x: x + (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y0 : y0 + (n / 20) * unit },
			{ x: x + (n / 2.5) * unit, y: y - y0 < unit ? y0 : y0 + unit },
			{ x: x + (n / 3) * unit, y: y0 },
		];
	},
	draw(cfg, container) {
		const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
		const polygon = container.addShape('polygon', {
			attrs: {
				points: [
					[points[0].x, points[0].y],
					[points[1].x, points[1].y],
					[points[2].x, points[2].y],
					[points[3].x, points[3].y],
					[points[4].x, points[4].y],
					[points[5].x, points[5].y],
					[points[6].x, points[6].y],
					[points[7].x, points[7].y],
					[points[8].x, points[8].y],
					[points[9].x, points[9].y],
					[points[10].x, points[10].y],
					[points[11].x, points[11].y],
					[points[12].x, points[12].y],
					[points[13].x, points[13].y],
					[points[14].x, points[14].y],
					[points[15].x, points[15].y],
					[points[16].x, points[16].y],
					[points[17].x, points[17].y],
					[points[18].x, points[18].y],
					[points[19].x, points[19].y],
				],
				shadowColor: cfg.style.shadowColor,
				shadowBlur: cfg.style.shadowBlur,
				shadowOffsetX: cfg.style.shadowOffsetX,
				shadowOffsetY: cfg.style.shadowOffsetY,
				fill: cfg.color,
			},
		});
		return polygon;
	},
});

export const COLORS = {
	NOW_COLOR: 'l(90) 0:#6CBBFF 1:#6CBBFF',
	NOR_COLOR: 'l(90) 0:#667ECC 1:#3D6DCC',
	LIGHT_SHADOW: '#1A56FF',
	NOR_SHADOW: 'transparent',
};

export const X_TEXT_STYLE = {
	textAlign: 'center',
	fill: '#FFFFFF',
	fontSize: '14',
	fontWeight: '400',
};
export const Y_TEXT_STYLE = {
	fill: '#FFFFFF',
	fontSize: '12',
	fontWeight: 'lighter',
};
export const Y_LINE_STYLE = {
	stroke: 'rgba(114,134,217,0.20)',
	lineWidth: 1,
	lineDash: [1, 0],
};

export const LIST = [
	{
		time: 8,
		flowCount: 0,
	},
	{
		time: 9,
		flowCount: 0,
	},
	{
		time: 10,
		flowCount: 0,
	},
	{
		time: 11,
		flowCount: 0,
	},
	{
		time: 12,
		flowCount: 0,
	},
	{
		time: 13,
		flowCount: 0,
	},
	{
		time: 14,
		flowCount: 0,
	},
	{
		time: 15,
		flowCount: 0,
	},
	{
		time: 16,
		flowCount: 0,
	},
	{
		time: 17,
		flowCount: 0,
	},
	{
		time: 18,
		flowCount: 0,
	},
	{
		time: 19,
		flowCount: 0,
	},
];