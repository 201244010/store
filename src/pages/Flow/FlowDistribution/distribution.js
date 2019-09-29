import { Shape } from 'bizcharts';

Shape.registerShape('interval', 'distributionShape', {
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

export const GENDERS = {
	0: 'unknow',
	1: 'male',
	2: 'female',
};

export function getLabel(lang) {
	const label = {
		textStyle: {
			textAlign: 'start',
			fill: '#A5A7B1',
			fontSize: '14',
			textBaseline: 'middle',
		},
		autoRotate: true,
	};

	if (lang === 'en-US') {
		label.offset = 25;
	} else {
		label.offset = 16;
	}

	return label;
}

export const COLORS = {
	GENDER: '#344166',
	MALE: '#667ECC',
	MALE_LIGHT: '#6CBBFF',
	FEMALE: 'rgba(255,128,128,0.6)',
	FEMALE_LIGHT: '#FF8080',
	NOR_SHADOW: 'transparent',
	MALE_SHADOW: '#1A56FF',
	FEMALE_SHADOW: 'rgba(255,26,26,0.5)',
};
