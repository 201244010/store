import React, { Component } from 'react';
import { Transformer } from 'react-konva';
import { getTypeByName } from '@/utils/studio';
import { SHAPE_TYPES, IMAGE_TYPES } from '@/constants/studio';

export default class MTransformer extends Component {
    componentDidMount() {
        this.checkNode();
    }

    componentDidUpdate() {
        this.checkNode();
    }

    checkNode() {
        // here need to manually attach or detach Transformer node
        const stage = this.transformer.getStage();
        const { selectedShapeName } = this.props;

        const selectedNode = stage.findOne(`.${selectedShapeName}`);
        // do nothing if selected node is already attached
        if (selectedNode === this.transformer.node()) {
            return;
        }

        if (selectedNode) {
            // attach to another node
            this.transformer.attachTo(selectedNode);
        } else {
            // remove transformer
            this.transformer.detach();
        }
        this.transformer.getLayer().batchDraw();
    }

    render() {
        const { selectedShapeName } = this.props;
        const type = getTypeByName(selectedShapeName);

        if (IMAGE_TYPES.includes(type)) {
            return (
                <Transformer
                    ref={node => {
                        this.transformer = node;
                    }}
                    anchorSize={6}
                    anchorCornerRadius={3}
                    rotateAnchorOffset={20}
                    rotateEnabled={false}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                />
            );
        }
        if ([SHAPE_TYPES.HLine].includes(type)) {
            return (
                <Transformer
                    ref={node => {
                        this.transformer = node;
                    }}
                    anchorSize={6}
                    anchorCornerRadius={3}
                    rotateAnchorOffset={20}
                    rotateEnabled={false}
                    enabledAnchors={['middle-right', 'middle-left']}
                />
            );
        }
        if ([SHAPE_TYPES.VLine].includes(type)) {
            return (
                <Transformer
                    ref={node => {
                        this.transformer = node;
                    }}
                    anchorSize={6}
                    anchorCornerRadius={3}
                    rotateAnchorOffset={20}
                    rotateEnabled={false}
                    enabledAnchors={['top-center', 'bottom-center']}
                />
            );
        }
        if ([SHAPE_TYPES.RECT_FIX].includes(type)) {
            return (
                <Transformer
                    ref={node => {
                        this.transformer = node;
                    }}
                    anchorSize={6}
                    anchorCornerRadius={3}
                    rotateAnchorOffset={20}
                    rotateEnabled={false}
                    enabledAnchors={[]}
                />
            );
        }
        return (
            <Transformer
                ref={node => {
                    this.transformer = node;
                }}
                anchorSize={6}
                anchorCornerRadius={3}
                rotateAnchorOffset={20}
                rotateEnabled={false}
                ignoreStroke
            />
        );
    }
}
