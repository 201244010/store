export default class FontDetector {
	constructor() {
		this.baseFonts = ['monospace', 'sans-serif', 'serif'];
		this.testString = 'mmmmmmmmmmlli';
		this.testSize = '72px';
		this.h = document.getElementsByTagName('body')[0];
		this.s = document.createElement('span');
		this.defaultWidth = {};
		this.defaultHeight = {};

		this.s.style.fontSize = this.testSize;
		this.s.innerHTML = this.testString;

		this.baseFonts.forEach(baseFont => {
			this.s.style.fontFamily = baseFont;
			this.h.appendChild(this.s);
			this.defaultWidth[baseFont] = this.s.offsetWidth;
			this.defaultHeight[baseFont] = this.s.offsetHeight;
			this.h.removeChild(this.s);
		});
	}

	detect = (font) => {
		let detected = false;

		this.baseFonts.forEach(baseFont => {
			this.s.style.fontFamily = `${font},${baseFont}`;
			this.h.appendChild(this.s);
			const matched = this.s.offsetWidth !== this.defaultWidth[baseFont] || this.s.offsetHeight !== this.defaultHeight[baseFont];
			this.h.removeChild(this.s);
			detected = detected || matched;
		});

		return detected;
	}

	static loadFont = () => {
		const fontUrl = 'https://store.test.sunmi.com/static/Zfull-GB.ttf';
		const newStyle = document.createElement('style');
		newStyle.appendChild(document.createTextNode(`
			@font-face {
				font-family: 'Zfull-GB';
				src: url('${fontUrl}');
			}
		`));
		document.head.appendChild(newStyle);
	}
}
