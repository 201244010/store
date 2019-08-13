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

	boundBoxFunc = (oldBoundBox, newBoundBox) => {
		const { componentsDetail, selectedShapeName, zoomScale } = this.props;
		const detail = componentsDetail[selectedShapeName];

		if (newBoundBox.width < 3) {
			newBoundBox.width = 3;
		}
		if (newBoundBox.height < (detail.fontSize || 1) * zoomScale) {
			newBoundBox.height = (detail.fontSize || 1) * zoomScale;
		}
		return newBoundBox;
	};

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
					boundBoxFunc={this.boundBoxFunc}
				/>
			);
		}
		if ([SHAPE_TYPES.LINE_H].includes(type)) {
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
		if ([SHAPE_TYPES.LINE_V].includes(type)) {
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
		if ([SHAPE_TYPES.RECT_FIX, SHAPE_TYPES.RECT_SELECT].includes(type)) {
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
				boundBoxFunc={this.boundBoxFunc}
			/>
		);
	}
}
