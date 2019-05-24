export const SHAPE_TYPES = {
	RECT: 'rect',
	RECT_FIX: 'rect@fix',
	CIRCLE: 'circle',
	TRIANGLE: 'triangle',
	TEXT: 'text',
	HLine: 'HLine',
	VLine: 'VLine',
	IMAGE: 'IMAGE',
	PRICE: 'price',
	PRICE_NORMAL: 'price@normal',
	PRICE_SUPER: 'price@super',
	PRICE_SUB: 'price@sub',
	PRICE_NORMAL_WHITE: 'price@normal@white',
	PRICE_SUPER_WHITE: 'price@super@white',
	PRICE_SUB_WHITE: 'price@sub@white',
	PRICE_NORMAL_BLACK: 'price@normal@black',
	PRICE_SUPER_BLACK: 'price@super@black',
	PRICE_SUB_BLACK: 'price@sub@black',
	CODE: 'barcode',
	CODE_H: 'barcode@h',
	CODE_V: 'barcode@v',
	CODE_QR: 'barcode@qr',
};

export const IMAGE_TYPES = [
	SHAPE_TYPES.IMAGE,
	SHAPE_TYPES.CODE_H,
	SHAPE_TYPES.CODE_V,
	SHAPE_TYPES.CODE_QR,
];
export const BARCODE_TYPES = [SHAPE_TYPES.CODE_H, SHAPE_TYPES.CODE_V, SHAPE_TYPES.CODE_QR];
export const NORMAL_PRICE_TYPES = [SHAPE_TYPES.PRICE_NORMAL_WHITE, SHAPE_TYPES.PRICE_NORMAL_BLACK];
export const NON_NORMAL_PRICE_TYPES = [
	SHAPE_TYPES.PRICE_SUPER_WHITE,
	SHAPE_TYPES.PRICE_SUB_WHITE,
	SHAPE_TYPES.PRICE_SUPER_BLACK,
	SHAPE_TYPES.PRICE_SUB_BLACK,
];

export const SIZES = {
	HEADER_HEIGHT: 60,
	TOOL_BOX_WIDTH: 260,
	DEFAULT_RECT_STROKE_WIDTH: 0,
	DEFAULT_RECT_WIDTH: 150,
	DEFAULT_RECT_HEIGHT: 50,
	DEFAULT_RECT_CORNER_RADIUS: 0,
	DEFAULT_IMAGE_WIDTH: 16,
	DEFAULT_IMAGE_HEIGHT: 16,
	DEFAULT_IMAGE_CONTAINER_HEIGHT: 48,
	DEFAULT_IMAGE_CONTAINER_WIDTH: 80,
	DEFAULT_IMAGE_STROKE_WIDTH: 30,
	DEFAULT_PRICE_CONTAINER_WIDTH: 60,
	DEFAULT_PRICE_CONTAINER_HEIGHT: 18,
	DEFAULT_CIRCLE_RADIUS: 30,
	DEFAULT_MAX_CANVAS_LENGTH: 10000,
	DEFAULT_H_LINE_WIDTH: 100,
	DEFAULT_V_LINE_HEIGHT: 50,
	DEFAULT_LINE_STROKE_WIDTH: 3,
	DEFAULT_TEXT_CONTAINER_WIDTH: 100,
	DEFAULT_TEXT_CONTAINER_HEIGHT: 18,
	DEFAULT_TEXT_LETTER_SPACING: 0,
	DEFAULT_CODE_H_CONTAINER_WIDTH: 95,
	DEFAULT_CODE_H_CONTAINER_HEIGHT: 14,
	DEFAULT_CODE_V_CONTAINER_WIDTH: 14,
	DEFAULT_CODE_V_CONTAINER_HEIGHT: 95,
	DEFAULT_CODE_QR_CONTAINER_WIDTH: 40,
	DEFAULT_CODE_QR_CONTAINER_HEIGHT: 40,
};

export const COLORS = {
	DEFAULT_STROKE_COLOR: 'black',
	DEFAULT_RECT_BG_COLOR: 'black',
	DEFAULT_RECT_STROKE_COLOR: 'black',
	DEFAULT_TEXT_COLOR: 'black',
	DEFAULT_TEXT_BG_COLOR: 'white',
	DEFAULT_PRICE_WHITE_BG_COLOR: 'white',
	DEFAULT_PRICE_BLACK_BG_COLOR: 'black',
	DEFAULT_PRICE_WHITE_TEXT_COLOR: 'black',
	DEFAULT_PRICE_BLACK_TEXT_COLOR: 'white',
};

export const FORMATS = {
	DEFAULT_TEXT_ALIGN: 'left',
	DEFAULT_TEXT_FONT_FAMILY: 'Zfull-GB',
	DEFAULT_TEXT_FONT_SIZE: 14,
	DEFAULT_TEXT_FONT_STYLE: 'normal',
	DEFAULT_TEXT_DECORATION: '',
	DEFAULT_PRICE_FONT_SIZE: 18,
	DEFAULT_PRICE_SMALL_FONT_SIZE: 12,
};

const fillMap = {
	[SHAPE_TYPES.RECT]: COLORS.DEFAULT_RECT_BG_COLOR,
	[SHAPE_TYPES.RECT_FIX]: COLORS.DEFAULT_RECT_BG_COLOR,
	[SHAPE_TYPES.TEXT]: COLORS.DEFAULT_TEXT_COLOR,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: COLORS.DEFAULT_PRICE_WHITE_TEXT_COLOR,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: COLORS.DEFAULT_PRICE_WHITE_TEXT_COLOR,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: COLORS.DEFAULT_PRICE_WHITE_TEXT_COLOR,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: COLORS.DEFAULT_PRICE_BLACK_TEXT_COLOR,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: COLORS.DEFAULT_PRICE_BLACK_TEXT_COLOR,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: COLORS.DEFAULT_PRICE_BLACK_TEXT_COLOR,
};
const widthMap = {
	[SHAPE_TYPES.RECT]: SIZES.DEFAULT_RECT_WIDTH,
	[SHAPE_TYPES.RECT_FIX]: SIZES.DEFAULT_RECT_WIDTH,
	[SHAPE_TYPES.TEXT]: SIZES.DEFAULT_TEXT_CONTAINER_WIDTH,
	[SHAPE_TYPES.IMAGE]: SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.CODE_H]: SIZES.DEFAULT_CODE_H_CONTAINER_WIDTH,
	[SHAPE_TYPES.CODE_V]: SIZES.DEFAULT_CODE_V_CONTAINER_WIDTH,
	[SHAPE_TYPES.CODE_QR]: SIZES.DEFAULT_CODE_QR_CONTAINER_WIDTH,
};
const heightMap = {
	[SHAPE_TYPES.RECT]: SIZES.DEFAULT_RECT_HEIGHT,
	[SHAPE_TYPES.RECT_FIX]: SIZES.DEFAULT_RECT_HEIGHT,
	[SHAPE_TYPES.TEXT]: SIZES.DEFAULT_TEXT_CONTAINER_HEIGHT,
	[SHAPE_TYPES.IMAGE]: SIZES.DEFAULT_IMAGE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.CODE_H]: SIZES.DEFAULT_CODE_H_CONTAINER_HEIGHT,
	[SHAPE_TYPES.CODE_V]: SIZES.DEFAULT_CODE_V_CONTAINER_HEIGHT,
	[SHAPE_TYPES.CODE_QR]: SIZES.DEFAULT_CODE_QR_CONTAINER_HEIGHT,
};
const strokeWidthMap = {
	[SHAPE_TYPES.RECT]: SIZES.DEFAULT_RECT_STROKE_WIDTH,
	[SHAPE_TYPES.RECT_FIX]: SIZES.DEFAULT_RECT_STROKE_WIDTH,
	[SHAPE_TYPES.VLine]: SIZES.DEFAULT_LINE_STROKE_WIDTH,
	[SHAPE_TYPES.HLine]: SIZES.DEFAULT_LINE_STROKE_WIDTH,
};
const strokeMap = {
	[SHAPE_TYPES.RECT]: COLORS.DEFAULT_STROKE_COLOR,
	[SHAPE_TYPES.RECT_FIX]: COLORS.DEFAULT_STROKE_COLOR,
	[SHAPE_TYPES.VLine]: COLORS.DEFAULT_STROKE_COLOR,
	[SHAPE_TYPES.HLine]: COLORS.DEFAULT_STROKE_COLOR,
};
const letterSpacingMap = {
	[SHAPE_TYPES.TEXT]: SIZES.DEFAULT_TEXT_LETTER_SPACING,
};
const cornerRadiusMap = {
	[SHAPE_TYPES.RECT]: SIZES.DEFAULT_RECT_CORNER_RADIUS,
	[SHAPE_TYPES.RECT_FIX]: SIZES.DEFAULT_RECT_CORNER_RADIUS,
};
const containerWidthMap = {
	[SHAPE_TYPES.RECT]: SIZES.DEFAULT_RECT_WIDTH,
	[SHAPE_TYPES.RECT_FIX]: SIZES.DEFAULT_RECT_WIDTH,
	[SHAPE_TYPES.TEXT]: SIZES.DEFAULT_TEXT_CONTAINER_WIDTH,
	[SHAPE_TYPES.IMAGE]: SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
	[SHAPE_TYPES.CODE_H]: SIZES.DEFAULT_CODE_H_CONTAINER_WIDTH,
	[SHAPE_TYPES.CODE_V]: SIZES.DEFAULT_CODE_V_CONTAINER_WIDTH,
	[SHAPE_TYPES.CODE_QR]: SIZES.DEFAULT_CODE_QR_CONTAINER_WIDTH,
};
const containerHeightMap = {
	[SHAPE_TYPES.RECT]: SIZES.DEFAULT_RECT_HEIGHT,
	[SHAPE_TYPES.RECT_FIX]: SIZES.DEFAULT_RECT_HEIGHT,
	[SHAPE_TYPES.TEXT]: SIZES.DEFAULT_TEXT_CONTAINER_HEIGHT,
	[SHAPE_TYPES.IMAGE]: SIZES.DEFAULT_IMAGE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
	[SHAPE_TYPES.CODE_H]: SIZES.DEFAULT_CODE_H_CONTAINER_HEIGHT,
	[SHAPE_TYPES.CODE_V]: SIZES.DEFAULT_CODE_V_CONTAINER_HEIGHT,
	[SHAPE_TYPES.CODE_QR]: SIZES.DEFAULT_CODE_QR_CONTAINER_HEIGHT,
};
const alignMap = {
	[SHAPE_TYPES.TEXT]: FORMATS.DEFAULT_TEXT_ALIGN,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: FORMATS.DEFAULT_TEXT_ALIGN,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: FORMATS.DEFAULT_TEXT_ALIGN,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: FORMATS.DEFAULT_TEXT_ALIGN,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: FORMATS.DEFAULT_TEXT_ALIGN,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: FORMATS.DEFAULT_TEXT_ALIGN,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: FORMATS.DEFAULT_TEXT_ALIGN,
};
const fontFamilyMap = {
	[SHAPE_TYPES.TEXT]: FORMATS.DEFAULT_TEXT_FONT_FAMILY,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: FORMATS.DEFAULT_TEXT_FONT_FAMILY,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: FORMATS.DEFAULT_TEXT_FONT_FAMILY,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: FORMATS.DEFAULT_TEXT_FONT_FAMILY,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: FORMATS.DEFAULT_TEXT_FONT_FAMILY,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: FORMATS.DEFAULT_TEXT_FONT_FAMILY,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: FORMATS.DEFAULT_TEXT_FONT_FAMILY,
};
const fontSizeMap = {
	[SHAPE_TYPES.TEXT]: FORMATS.DEFAULT_TEXT_FONT_SIZE,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: FORMATS.DEFAULT_PRICE_FONT_SIZE,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: FORMATS.DEFAULT_PRICE_FONT_SIZE,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: FORMATS.DEFAULT_PRICE_FONT_SIZE,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: FORMATS.DEFAULT_PRICE_FONT_SIZE,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: FORMATS.DEFAULT_PRICE_FONT_SIZE,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: FORMATS.DEFAULT_PRICE_FONT_SIZE,
};
const smallFontSizeMap = {
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: FORMATS.DEFAULT_PRICE_SMALL_FONT_SIZE,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: FORMATS.DEFAULT_PRICE_SMALL_FONT_SIZE,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: FORMATS.DEFAULT_PRICE_SMALL_FONT_SIZE,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: FORMATS.DEFAULT_PRICE_SMALL_FONT_SIZE,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: FORMATS.DEFAULT_PRICE_SMALL_FONT_SIZE,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: FORMATS.DEFAULT_PRICE_SMALL_FONT_SIZE,
};
const fontStyleMap = {
	[SHAPE_TYPES.TEXT]: FORMATS.DEFAULT_TEXT_FONT_STYLE,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: FORMATS.DEFAULT_TEXT_FONT_STYLE,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: FORMATS.DEFAULT_TEXT_FONT_STYLE,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: FORMATS.DEFAULT_TEXT_FONT_STYLE,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: FORMATS.DEFAULT_TEXT_FONT_STYLE,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: FORMATS.DEFAULT_TEXT_FONT_STYLE,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: FORMATS.DEFAULT_TEXT_FONT_STYLE,
};
const textBgMap = {
	[SHAPE_TYPES.TEXT]: COLORS.DEFAULT_TEXT_BG_COLOR,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: COLORS.DEFAULT_PRICE_WHITE_BG_COLOR,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: COLORS.DEFAULT_PRICE_WHITE_BG_COLOR,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: COLORS.DEFAULT_PRICE_WHITE_BG_COLOR,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: COLORS.DEFAULT_PRICE_BLACK_BG_COLOR,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: COLORS.DEFAULT_PRICE_BLACK_BG_COLOR,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: COLORS.DEFAULT_PRICE_BLACK_BG_COLOR,
};
const textDecorationMap = {
	[SHAPE_TYPES.TEXT]: FORMATS.DEFAULT_TEXT_DECORATION,
	[SHAPE_TYPES.PRICE_NORMAL_WHITE]: FORMATS.DEFAULT_TEXT_DECORATION,
	[SHAPE_TYPES.PRICE_SUPER_WHITE]: FORMATS.DEFAULT_TEXT_DECORATION,
	[SHAPE_TYPES.PRICE_SUB_WHITE]: FORMATS.DEFAULT_TEXT_DECORATION,
	[SHAPE_TYPES.PRICE_NORMAL_BLACK]: FORMATS.DEFAULT_TEXT_DECORATION,
	[SHAPE_TYPES.PRICE_SUPER_BLACK]: FORMATS.DEFAULT_TEXT_DECORATION,
	[SHAPE_TYPES.PRICE_SUB_BLACK]: FORMATS.DEFAULT_TEXT_DECORATION,
};
const screenMap = {
	1: {
		width: 212,
		height: 104,
		zoomScale: 3,
	},
	2: {
		width: 296,
		height: 152,
		zoomScale: 2,
	},
	3: {
		width: 400,
		height: 300,
		zoomScale: 1.5,
	},
};
const imageUrlMap = {
	[SHAPE_TYPES.IMAGE]: require('@/assets/studio/image.svg'),
	[SHAPE_TYPES.CODE_H]: require('@/assets/studio/code_h.png'),
	[SHAPE_TYPES.CODE_V]: require('@/assets/studio/code_v.png'),
	[SHAPE_TYPES.CODE_QR]: require('@/assets/studio/code_qr.png'),
};

export const MAPS = {
	fill: fillMap,
	width: widthMap,
	height: heightMap,
	strokeWidth: strokeWidthMap,
	stroke: strokeMap,
	letterSpacing: letterSpacingMap,
	cornerRadius: cornerRadiusMap,
	containerWidth: containerWidthMap,
	containerHeight: containerHeightMap,
	align: alignMap,
	fontFamily: fontFamilyMap,
	fontSize: fontSizeMap,
	smallFontSize: smallFontSizeMap,
	fontStyle: fontStyleMap,
	textBg: textBgMap,
	textDecoration: textDecorationMap,
	screen: screenMap,
	imageUrl: imageUrlMap,
};
