import React, {Fragment} from 'react';
import {Group, Rect, Text, Line, Image} from 'react-konva';
import {SHAPE_TYPES, SIZES, MAPS} from '@/constants/studio';

export default function generateShape(option) {
    let shape;

    switch (option.type) {
        case SHAPE_TYPES.RECT:
            shape = (
                <Rect
                    {
                        ...{
                            name: option.name,
                            x: option.x,
                            y: option.y,
                            width: MAPS.width[SHAPE_TYPES.RECT] * option.zoomScale,
                            height: MAPS.height[SHAPE_TYPES.RECT] * option.zoomScale,
                            scaleX: option.scaleX,
                            scaleY: option.scaleY,
                            fill: option.fill,
                            stroke: option.strokeWidth ? option.stroke : 'rgba(0, 0, 0, 0)',
                            strokeWidth: option.strokeWidth,
                            cornerRadius: option.cornerRadius,
                            strokeScaleEnabled: false,
                            draggable: true,
                            onTransform: option.onTransform,
                            onMouseOver: () => {
                                document.body.style.cursor = 'pointer';
                            },
                            onMouseOut: () => {
                                document.body.style.cursor = 'default';
                            }
                        }
                    }
                />
            );
            break;
        case SHAPE_TYPES.TEXT:
            shape = (
                <Group>
                    <Rect
                        {
                            ...{
                                name: option.name,
                                x: option.x,
                                y: option.y,
                                width: MAPS.containerWidth[SHAPE_TYPES.TEXT] * option.zoomScale,
                                height: MAPS.containerHeight[SHAPE_TYPES.TEXT] * option.zoomScale,
                                scaleX: option.scaleX,
                                scaleY: option.scaleY,
                                fill: option.textBg,
                                opacity: option.textBg === 'opacity' ? 0 : 1,
                                draggable: true,
                                onTransform: option.onTransform,
                                onDblClick: option.onDblClick
                            }
                        }
                    />
                    <Text
                        {
                            ...{
                                name: option.name,
                                x: option.x,
                                y: option.y,
                                text: option.text,
                                fontFamily: option.fontFamily,
                                fontSize: option.fontSize * option.zoomScale,
                                fontStyle: option.fontStyle,
                                textDecoration: option.textDecoration,
                                fill: option.fill,
                                align: option.align,
                                letterSpacing: option.letterSpacing,
                                width: MAPS.containerWidth[SHAPE_TYPES.TEXT] * option.scaleX * option.zoomScale,
                                height: MAPS.containerHeight[SHAPE_TYPES.TEXT] * option.zoomScale,
                                lineHeight: MAPS.containerHeight[SHAPE_TYPES.TEXT] / option.fontSize,
                                draggable: true,
                                onDblClick: option.onDblClick
                            }
                        }
                    />
                </Group>
            );
            break;
        case SHAPE_TYPES.HLine:
            shape = (
                <Line
                    {
                        ...{
                            name: option.name,
                            x: option.x,
                            y: option.y,
                            stroke: option.stroke,
                            strokeWidth: option.strokeWidth * option.zoomScale,
                            scaleX: option.scaleX,
                            scaleY: option.scaleY,
                            points: [0, 0, SIZES.DEFAULT_H_LINE_WIDTH, 0],
                            draggable: true,
                            onTransform: option.onTransform,
                            onMouseOver: () => {
                                document.body.style.cursor = 'pointer';
                            },
                            onMouseOut: () => {
                                document.body.style.cursor = 'default';
                            }
                        }
                    }
                />
            );
            break;
        case SHAPE_TYPES.VLine:
            shape = (
                <Line
                    {
                        ...{
                            name: option.name,
                            x: option.x,
                            y: option.y,
                            stroke: option.stroke,
                            strokeWidth: option.strokeWidth * option.zoomScale,
                            scaleX: option.scaleX,
                            scaleY: option.scaleY,
                            points: [0, 0, 0, SIZES.DEFAULT_V_LINE_HEIGHT],
                            draggable: true,
                            onTransform: option.onTransform,
                            onMouseOver: () => {
                                document.body.style.cursor = 'pointer';
                            },
                            onMouseOut: () => {
                                document.body.style.cursor = 'default';
                            }
                        }
                    }
                />
            );
            break;
        case SHAPE_TYPES.IMAGE:
            if (option.imageType === 'default') {
                shape = (
                    <Group>
                        <Rect
                            {
                                ...{
                                    name: option.name,
                                    x: option.x,
                                    y: option.y,
                                    width: MAPS.containerWidth[SHAPE_TYPES.IMAGE] * option.zoomScale,
                                    height: MAPS.containerHeight[SHAPE_TYPES.IMAGE] * option.zoomScale,
                                    scaleX: option.scaleX,
                                    scaleY: option.scaleY,
                                    fill: '#d9d9d9',
                                    draggable: true,
                                    onTransform: option.onTransform,
                                    onDblClick: option.onDblClick
                                }
                            }
                        />
                        <Image
                            {
                                ...{
                                    x: option.x + (SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.scaleX * option.zoomScale - SIZES.DEFAULT_IMAGE_WIDTH) / 2,
                                    y: option.y + (SIZES.DEFAULT_IMAGE_CONTAINER_HEIGHT * option.scaleY * option.zoomScale - SIZES.DEFAULT_IMAGE_HEIGHT) / 2,
                                    width: SIZES.DEFAULT_IMAGE_WIDTH * option.zoomScale,
                                    height: SIZES.DEFAULT_IMAGE_HEIGHT * option.zoomScale,
                                    image: option.image,
                                }
                            }
                        />
                        {
                            option.selected ?
                                <Fragment>
                                    <Rect
                                        {
                                            ...{
                                                x: option.x + (SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.scaleX * option.zoomScale - 180) / 2,
                                                y: option.y - 50,
                                                width: 180,
                                                height: 32,
                                                fill: '#5085E3',
                                                cornerRadius: 16
                                            }
                                        }
                                    />
                                    <Text
                                        {
                                            ...{
                                                x: option.x + (SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.scaleX * option.zoomScale - 180) / 2,
                                                y: option.y - 50,
                                                width: 180,
                                                height: 32,
                                                lineHeight: 2.5,
                                                align: 'center',
                                                fontSize: 14,
                                                fill: '#fff',
                                                text: '双击更换图片'
                                            }
                                        }
                                    />
                                </Fragment> :
                                null
                        }
                    </Group>
                );
            } else {
                shape = (
                    <Group>
                        <Image
                            {
                                ...{
                                    name: option.name,
                                    x: option.x,
                                    y: option.y,
                                    width: SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.zoomScale,
                                    height: SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.ratio * option.zoomScale,
                                    scaleX: option.scaleX,
                                    scaleY: option.scaleY,
                                    image: option.image,
                                    ratio: option.ratio,
                                    draggable: true,
                                    onTransform: option.onTransform,
                                    onDblClick: option.onDblClick
                                }
                            }
                        />
                        {
                            option.selected ?
                                <Fragment>
                                    <Rect
                                        {
                                            ...{
                                                x: option.x + (SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.scaleX * option.zoomScale - 180) / 2,
                                                y: option.y - 50,
                                                width: 180,
                                                height: 32,
                                                fill: '#5085E3',
                                                cornerRadius: 16
                                            }
                                        }
                                    />
                                    <Text
                                        {
                                            ...{
                                                x: option.x + (SIZES.DEFAULT_IMAGE_CONTAINER_WIDTH * option.scaleX * option.zoomScale - 180) / 2,
                                                y: option.y - 50,
                                                width: 180,
                                                height: 32,
                                                lineHeight: 2.5,
                                                align: 'center',
                                                fontSize: 14,
                                                fill: '#fff',
                                                text: '双击更换图片'
                                            }
                                        }
                                    />
                                </Fragment> :
                                null
                        }
                    </Group>
                );
            }
            break;
        case SHAPE_TYPES.PRICE_NORMAL:
            shape = (
                <Group>
                    <Rect
                        {
                            ...{
                                name: option.name,
                                x: option.x,
                                y: option.y,
                                width: MAPS.containerWidth[option.type] * option.zoomScale,
                                height: MAPS.containerHeight[option.type] * option.zoomScale,
                                scaleX: option.scaleX,
                                scaleY: option.scaleY,
                                fill: option.textBg,
                                opacity: option.textBg === 'opacity' ? 0 : 1,
                                draggable: true,
                                onTransform: option.onTransform,
                                onDblClick: option.onDblClick
                            }
                        }
                    />
                    <Text
                        {
                            ...{
                                name: option.name,
                                x: option.x,
                                y: option.y,
                                text: '111111111.',
                                fontFamily: option.fontFamily,
                                fontSize: option.fontSize * option.zoomScale,
                                fontStyle: option.fontStyle,
                                textDecoration: option.textDecoration,
                                fill: option.fill,
                                align: option.align,
                                letterSpacing: option.letterSpacing,
                                width: MAPS.containerWidth[option.type] * option.scaleX * option.zoomScale,
                                height: MAPS.containerHeight[option.type] * option.zoomScale,
                                lineHeight: MAPS.containerHeight[option.type] / option.fontSize,
                                draggable: true,
                                onDblClick: option.onDblClick
                            }
                        }
                    />
                    <Text
                        {
                            ...{
                                name: option.name,
                                x: option.x + 88,
                                y: option.y + 7,
                                text: '00',
                                fontFamily: option.fontFamily,
                                fontSize: 12 * option.zoomScale,
                                fontStyle: option.fontStyle,
                                textDecoration: option.textDecoration,
                                fill: option.fill,
                                align: option.align,
                                letterSpacing: option.letterSpacing,
                                width: MAPS.containerWidth[option.type] * option.scaleX * option.zoomScale,
                                height: MAPS.containerHeight[option.type] * option.zoomScale,
                                lineHeight: MAPS.containerHeight[option.type] / option.fontSize,
                                draggable: true,
                                onDblClick: option.onDblClick
                            }
                        }
                    />
                </Group>
            );
            break;
        default:
            throw new Error('没有匹配的Shape');
    }

    return (
        <Fragment key={option.name}>
            {shape}
        </Fragment>
    )
}