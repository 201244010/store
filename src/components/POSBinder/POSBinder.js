import React from 'react';
import { Alert } from 'antd';
import Draggable from 'react-draggable';
import { formatMessage } from 'umi/locale';

import styles from './POSBinder.less';



class POSBinder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			bounds: {
				width: '100%',
				height: '100%'
			},
			list: [],
			showInfo: true
		};

		this.setBounds = this.setBounds.bind(this);
		this.renderBlocks = this.renderBlocks.bind(this);

		this.generatePosition = this.generatePosition.bind(this);
		this.generateShape = this.generateShape.bind(this);

		this.onDragStop = this.onDragStop.bind(this);
		this.onResizeHandler = this.onResizeHandler.bind(this);
	}



	componentDidMount() {
		const { posList } = this.props;

		this.onResizeHandler();
		window.addEventListener('resize', this.onResizeHandler);

		// message.info('请拖动下方虚线框已框选对应收银设备。');
		this.renderBlocks(posList);
	}

	componentWillReceiveProps(newProps) {
		const { posList } = newProps;

		this.renderBlocks(posList, newProps);
	}

	onResizeHandler() {
		const { pixelRatio } = this.props;
		this.setBounds(pixelRatio);

		setTimeout(() => {
			this.renderBlocks();
		}, 0);
	}

	onDragStop(dragger, sn) {
		const { list } = this.state;
		// const { getPosition } = this.props;
		const wrapperHeight = this.wrapper.offsetHeight;

		const result = list.map((item) => {
			if (sn === item.sn) {
				item.top = parseInt(dragger.y * 1080 / wrapperHeight, 10);
				item.left = parseInt(dragger.x * 1080 / wrapperHeight, 10);
			}
			return item;
		});

		// console.log('onDragStop: ', result);

		this.setState({
			list: result
		});

		// if (getPosition) {
		// 	getPosition(result);
		// };

	}

	setBounds(pixelRatio) {
		const p = pixelRatio.split(':');
		const { container } = this;

		if (!container) {
			// 当取不到时，退出处理；
			return;
		}

		const containerHeight = container.offsetHeight;
		const containerWidth = container.offsetWidth;

		let wrapperHeight;
		let wrapperWidth;
		let wrapperMarginTop = 0;

		if (p[0] / p[1] > containerWidth / containerHeight) {
			// 容器宽度不够，上下居中
			wrapperHeight = containerWidth * p[1] / p[0];
			wrapperMarginTop = (containerHeight - wrapperHeight) / 2;
		} else {
			// 容器高度不够，左右居中
			wrapperWidth = containerHeight * p[0] / p[1];
		}

		this.setState({
			bounds: {
				width: wrapperWidth,
				height: wrapperHeight,
				marginTop: wrapperMarginTop
			}
		});
	};

	getPosition = () => {
		const { list } = this.state;
		return list;
	}

	generatePosition(sn) {
		const { list } = this.state;

		const wrapperHeight = this.wrapper.offsetHeight;

		const position = list.filter((obj) => obj.sn === sn)[0];

		if (position) {
			return {
				x: position.left * wrapperHeight / 1080,
				y: position.top * wrapperHeight / 1080
			};
		}
		return {
			x: 0,
			y: 0
		};

	}

	generateShape(sn) {
		const { list } = this.state;
		const wrapperHeight = this.wrapper.offsetHeight;

		const position = list.filter((obj) => obj.sn === sn)[0];

		if (position) {
			return {
				width: position.width * wrapperHeight / 1080,
				height: position.height * wrapperHeight / 1080
			};
		}
		return {
			width: 0,
			height: 0
		};
	}


	renderBlocks(posList, props) {
		const { editing, /* getPosition */ } = props || this.props;
		const { list } = this.state;
		const tList = posList || list;

		const elist = tList.map(item => ({
			sn: item.sn,
			editing: editing.includes(item.sn),
			top: item.top,
			left: item.left,
			width: item.width,
			height: item.height
		}));

		this.setState({
			list: elist
		});

		// getPosition(list);
	}

	render() {
		const { background } = this.props;

		const { list, bounds, showInfo } = this.state;

		// console.log(list);

		return (
			<div
				className={
					styles['pos-binder']
				}
				onClick={
					() => {
						this.setState({
							showInfo: false
						});
					}
				}
				ref={
					container => this.container = container
				}
			>
				{
					showInfo ?
						<div className={styles.info}>
							<Alert
								className={styles.alert}
								message={formatMessage({id: 'posList.notificationDesc'})}
								type='info'
								showIcon
								closable
								onClose={
									() => {
										this.setState({
											showInfo: false
										});
									}
								}
							/>
						</div>
						: ''
				}

				<div className={styles['ipc-background']}>
					<div
						className={styles['img-wrapper']}
						style={
							bounds
						}
					>
						{
							background ?
								<img alt='IPC' src={background} />
								: ''
						}
					</div>

				</div>
				<div
					className={
						`wrapper ${styles.wrapper}`
					}
					ref={
						wrapper => this.wrapper = wrapper
					}
					style={
						bounds
					}
				>
					{
						list.map((pos) => {
							if (pos.editing) {
								return (
									<Draggable
										key={pos.sn}
										bounds='.wrapper'
										position={
											this.generatePosition(pos.sn)
										}
										onStop={
											(e, dragger) => {
												this.onDragStop(dragger, pos.sn);
											}
										}
									>
										<div
											title={pos.sn}
											className={
												// `${styles['pos-block']} ${list.length === 1 ? styles.single : ''}`
												styles['pos-block']
											}
											style={
												this.generateShape(pos.sn)
											}
										>
											<span
												className={
													styles.text
												}
											>
												{`SN:${pos.sn}`}
											</span>
										</div>
									</Draggable>
								);
							}
							return (
								<div
									key={pos.sn}
									title={pos.sn}
									className={
										`${styles['pos-block']} ${styles['no-editing']}`
									}
									style={
										(() => {
											const position = this.generatePosition(pos.sn);
											const shape = this.generateShape(pos.sn);
											return {
												top: position.y,
												left: position.x,
												...shape
											};
										})()
									}
								>
									<span
										className={
											styles.text
										}
									>
										{`SN:${pos.sn}`}
									</span>
								</div>
							);

						})
					}
				</div>
			</div>
		);
	}
}

export default POSBinder;