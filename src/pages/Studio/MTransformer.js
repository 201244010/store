import React, { Component } from 'react';
import { Transformer } from 'react-konva';
import { getTypeByName } from '@/utils/studio';
import { SHAPE_TYPES } from '@/constants/studio';

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

		if (detail.type !== SHAPE_TYPES.LINE_V) {
			if (newBoundBox.width < (detail.fontSize || 10) * zoomScale) {
				newBoundBox.width = (detail.fontSize || 10) * zoomScale;
				return oldBoundBox;
			}
		}
		if (detail.type !== SHAPE_TYPES.LINE_H) {
			if (newBoundBox.height < (detail.fontSize || 10) * zoomScale) {
				newBoundBox.height = (detail.fontSize || 10) * zoomScale;
				return oldBoundBox;
			}
		}
		if (detail.type === SHAPE_TYPES.CODE_H) {
			if (newBoundBox.height > newBoundBox.width - 10) {
				return oldBoundBox;
			}
		}
		if (detail.type === SHAPE_TYPES.CODE_V) {
			if (newBoundBox.width > newBoundBox.height - 10) {
				return oldBoundBox;
			}
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

		if ([SHAPE_TYPES.IMAGE, SHAPE_TYPES.CODE_QR].includes(type)) {
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
		if ([SHAPE_TYPES.CODE_H].includes(type)) {
			return (
				<Transformer
					ref={node => {
						this.transformer = node;
					}}
					anchorSize={6}
					anchorCornerRadius={3}
					rotateAnchorOffset={20}
					rotateEnabled={false}
					enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center']}
					boundBoxFunc={this.boundBoxFunc}
				/>
			);
		}
		if ([SHAPE_TYPES.CODE_V].includes(type)) {
			return (
				<Transformer
					ref={node => {
						this.transformer = node;
					}}
					anchorSize={6}
					anchorCornerRadius={3}
					rotateAnchorOffset={20}
					rotateEnabled={false}
					enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-right', 'middle-left']}
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
					boundBoxFunc={this.boundBoxFunc}
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
					boundBoxFunc={this.boundBoxFunc}
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
