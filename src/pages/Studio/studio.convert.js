const fs = require('fs');

function convert(fileName) {
	const jsonBuffer = fs.readFileSync(`${__dirname}/${fileName}`);
	const jsonStr = jsonBuffer.toString();
	if (!jsonStr) {
		return;
	}
	const jsonObject = JSON.parse(jsonStr);

	let fixIndex;

	if (!jsonObject.layers || !jsonObject.layers.length) {
		return;
	}

	if (jsonObject.layers[0].hasConverted || jsonObject.layers[0].hasOwnProperty('startX')) {
		return;
	}

	const fillFields = [];

	for (let i = 0; i < jsonObject.layers.length; i++) {
		const layer = jsonObject.layers[i];
		if (layer.type === 'rect@fix') {
			fixIndex = i;
		}
		delete layer.lines;
		delete layer.x;
		delete layer.y;
		delete layer.name;
		delete layer.backType;
		delete layer.image;
		delete layer.imageType;
		delete layer.backIntStartX;
		delete layer.backIntStartY;
		delete layer.backSmallStartX;
		delete layer.backSmallStartY;

		if (layer.type) {
			const types = layer.type.split('@');
			layer.type = (types[0] || '').toLowerCase();
			if (layer.type.indexOf('price') > -1) {
				layer.subType = types[1];
			}
			if (layer.type.indexOf('line') > -1) {
				layer.type = 'line';
			}
		}
		layer.startX = layer.backStartX;
		delete layer.backStartX;
		layer.startY = layer.backStartY;
		delete layer.backStartY;
		layer.width = layer.backWidth;
		delete layer.backWidth;
		layer.height = layer.backHeight;
		delete layer.backHeight;

		if (layer.type === 'text' || layer.type === 'price') {
			layer.backgroundColor = layer.backBg;
			layer.fontColor = layer.fill;
			delete layer.backBg;
			delete layer.textBg;
			delete layer.fill;

			layer.bold = 0;
			layer.italic = 0;
			if (layer.fontStyle && (layer.fontStyle.indexOf('bold') > -1)) {
				layer.bold = 1;
			}
			if (layer.fontStyle && (layer.fontStyle.indexOf('italic') > -1)) {
				layer.italic = 1;
			}
			delete layer.fontStyle;

			layer.underline = 0;
			layer.strikethrough = 0;
			if (layer.textDecoration === 'underline') {
				layer.underline = 1;
			}
			if (layer.textDecoration === 'line-through') {
				layer.strikethrough = 1;
			}
			if (layer.underline && layer.strikethrough) {
				layer.strikethrough = 0;
			}
			delete layer.textDecoration;
		} else {
			delete layer.backBg;
			layer.backgroundColor = layer.fill;
			delete layer.fill;

			layer.strokeColor = layer.stroke;
			delete layer.stroke;
		}

		if (layer.bindField) {
			fillFields.push(layer.bindField);
		}

		if (!layer.hasConverted) {
			layer.bindField = layer.content;
			layer.content = layer.text;
			layer.hasConverted = true;
			delete layer.text;
		}
	}

	jsonObject.fillFields = fillFields;
	jsonObject.layers.splice(fixIndex, 1);
	jsonObject.layerCount = jsonObject.layers.length;

	fs.writeFileSync(`${__dirname}/${fileName}`, JSON.stringify(jsonObject));
}

fs.readdir(__dirname, (err, files) => {
	files.forEach(file => {
		if (file.indexOf('.json') > -1) {
			try {
				convert(file);
			} catch (e) {
				throw new Error(`${file}转换出错`);
			}
		}
	});
});
