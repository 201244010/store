export const SHAPE_TYPES = {
    RECT: 'Rect',
    RECT_FIX: 'Rect@Fix',
    CIRCLE: 'Circle',
    TRIANGLE: 'Triangle',
    TEXT: 'Text',
    HLine: 'HLine',
    VLine: 'VLine',
    IMAGE: 'IMAGE',
    PRICE_NORMAL: 'PRICE@NORMAL',
    PRICE_SUPER: 'PRICE@SUPER',
    PRICE_SUB: 'PRICE@SUB',
};

export const SIZES = {
    HEADER_HEIGHT: 60,
    TOOL_BOX_WIDTH: 260,
    DEFAULT_RECT_STROKE_WIDTH: 0,
    DEFAULT_RECT_WIDTH: 60,
    DEFAULT_RECT_HEIGHT: 60,
    DEFAULT_RECT_CORNER_RADIUS: 0,
    DEFAULT_IMAGE_WIDTH: 20,
    DEFAULT_IMAGE_HEIGHT: 20,
    DEFAULT_IMAGE_CONTAINER_HEIGHT: 96,
    DEFAULT_IMAGE_CONTAINER_WIDTH: 160,
    DEFAULT_IMAGE_STROKE_WIDTH: 30,
    DEFAULT_PRICE_CONTAINER_WIDTH: 180,
    DEFAULT_PRICE_CONTAINER_HEIGHT: 32,
    DEFAULT_CIRCLE_RADIUS: 30,
    DEFAULT_MAX_CANVAS_LENGTH: 10000,
    DEFAULT_H_LINE_WIDTH: 100,
    DEFAULT_V_LINE_HEIGHT: 50,
    DEFAULT_LINE_STROKE_WIDTH: 3,
    DEFAULT_TEXT_CONTAINER_HEIGHT: 36,
    DEFAULT_TEXT_CONTAINER_WIDTH: 200,
    DEFAULT_TEXT_LETTER_SPACING: 0
};

export const COLORS = {
    DEFAULT_STROKE_COLOR: 'black',
    DEFAULT_RECT_BG_COLOR: 'red',
    DEFAULT_RECT_STROKE_COLOR: 'black',
    DEFAULT_TEXT_COLOR: 'black',
    DEFAULT_TEXT_BG_COLOR: 'opacity'
};

export const FORMATS = {
    DEFAULT_TEXT_ALIGN: 'left',
    DEFAULT_TEXT_FONT_FAMILY: 'Zfull-GB',
    DEFAULT_TEXT_FONT_SIZE: 18,
    DEFAULT_TEXT_FONT_STYLE: 'normal',
    DEFAULT_TEXT_DECORATION: ''
};

const fillMap = {
    [SHAPE_TYPES.RECT]: COLORS.DEFAULT_RECT_BG_COLOR,
    [SHAPE_TYPES.TEXT]: COLORS.DEFAULT_TEXT_COLOR
};
const widthMap = {
    [SHAPE_TYPES.RECT]: SIZES.DEFAULT_RECT_WIDTH,
    [SHAPE_TYPES.TEXT]: SIZES.DEFAULT_TEXT_CONTAINER_WIDTH
};
const heightMap = {
    [SHAPE_TYPES.RECT]: SIZES.DEFAULT_RECT_HEIGHT,
    [SHAPE_TYPES.TEXT]: SIZES.DEFAULT_TEXT_CONTAINER_HEIGHT
};
const strokeWidthMap = {
    [SHAPE_TYPES.RECT]: SIZES.DEFAULT_RECT_STROKE_WIDTH,
    [SHAPE_TYPES.VLine]: SIZES.DEFAULT_LINE_STROKE_WIDTH,
    [SHAPE_TYPES.HLine]: SIZES.DEFAULT_LINE_STROKE_WIDTH,
};
const strokeMap = {
    [SHAPE_TYPES.RECT]: COLORS.DEFAULT_STROKE_COLOR,
    [SHAPE_TYPES.VLine]: COLORS.DEFAULT_STROKE_COLOR,
    [SHAPE_TYPES.HLine]: COLORS.DEFAULT_STROKE_COLOR,
};
const letterSpacingMap = {
    [SHAPE_TYPES.TEXT]: SIZES.DEFAULT_TEXT_LETTER_SPACING,
};
const cornerRadiusMap = {
    [SHAPE_TYPES.RECT]: SIZES.DEFAULT_RECT_CORNER_RADIUS
};
const containerWidthMap = {
    [SHAPE_TYPES.TEXT]: SIZES.DEFAULT_TEXT_CONTAINER_WIDTH,
    [SHAPE_TYPES.IMAGE]: SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH,
    [SHAPE_TYPES.PRICE_NORMAL]: SIZES.DEFAULT_PRICE_CONTAINER_WIDTH,
};
const containerHeightMap = {
    [SHAPE_TYPES.TEXT]: SIZES.DEFAULT_TEXT_CONTAINER_HEIGHT,
    [SHAPE_TYPES.IMAGE]: SIZES.DEFAULT_IMAGE_CONTAINER_HEIGHT,
    [SHAPE_TYPES.PRICE_NORMAL]: SIZES.DEFAULT_PRICE_CONTAINER_HEIGHT,
};
const alignMap = {
    [SHAPE_TYPES.TEXT]: FORMATS.DEFAULT_TEXT_ALIGN,
    [SHAPE_TYPES.PRICE_NORMAL]: FORMATS.DEFAULT_TEXT_ALIGN,
};
const fontFamilyMap = {
    [SHAPE_TYPES.TEXT]: FORMATS.DEFAULT_TEXT_FONT_FAMILY,
    [SHAPE_TYPES.PRICE_NORMAL]: FORMATS.DEFAULT_TEXT_FONT_FAMILY,
};
const fontSizeMap = {
    [SHAPE_TYPES.TEXT]: FORMATS.DEFAULT_TEXT_FONT_SIZE,
    [SHAPE_TYPES.PRICE_NORMAL]: FORMATS.DEFAULT_TEXT_FONT_SIZE,
};
const fontStyleMap = {
    [SHAPE_TYPES.TEXT]: FORMATS.DEFAULT_TEXT_FONT_STYLE,
    [SHAPE_TYPES.PRICE_NORMAL]: FORMATS.DEFAULT_TEXT_FONT_STYLE,
};
const textBgMap = {
    [SHAPE_TYPES.TEXT]: COLORS.DEFAULT_TEXT_BG_COLOR,
    [SHAPE_TYPES.PRICE_NORMAL]: FORMATS.DEFAULT_TEXT_BG_COLOR,
};
const textDecorationMap = {
    [SHAPE_TYPES.TEXT]: FORMATS.DEFAULT_TEXT_DECORATION,
    [SHAPE_TYPES.PRICE_NORMAL]: FORMATS.DEFAULT_TEXT_DECORATION,
};
const screenMap = {
    1: {
        width: 212,
        height: 104,
        zoomScale: 3
    }
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
    fontStyle: fontStyleMap,
    textBg: textBgMap,
    textDecoration: textDecorationMap,
    screen: screenMap
};