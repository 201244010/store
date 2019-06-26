import React from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import Draggable from 'react-draggable';

import Scaleplate from './Scaleplate';

import styles from './Timebar.less';

class VideoPlayerProgressBar extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			timestamp: 0, 	// js计算的时间点，标记视频播放的点；
			direction: 'left', 	// 拖拽的方向；
			dragging: false,	// 标记是否正在拖拽；
			// current: 0,
			position: {
				x: 0,
				y: 0
			},

			timeStart: 0,
			timeEnd: 0
		};

		this.days = 10;	// 用来向前记录渲染了多少日期；

		this.onDragChangeTimeout = 0;
		this.oneHourWidth = 60;

		this.generateTime = this.generateTime.bind(this);
		this.setHover = this.setHover.bind(this);

		// this.firstTime = true;
	}

	componentWillMount() {
		const { current } = this.props;

		this.getDuration(current);
		this.generateTime();
	}

	componentDidMount() {
		this.setPosition();

		window.addEventListener('resize', () => {
			this.setPosition();
		});
	}

	componentWillReceiveProps(props) {
		const { current } = props;
		const { timeStart, dragging, /* timestamp */ } = this.state;
		const { offsetWidth } = this.wrapper;
		const gap = offsetWidth/this.oneHourWidth/2*60*60;

		console.log(gap);

		console.log('componentWillReceiveProps: ', current, timeStart, timeStart+gap);
		if (current < timeStart + gap){
			this.getDuration(current);
			this.generateTime();
		}

		// console.log('Timerbar componentWillReceiveProps: ', current);
		if (!dragging) {
			this.setPosition(current);
		}
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	// console.log(nextProps);
	// 	return this.firstTime === true || this.state.timestamp !== nextState.timestamp || this.state.dragging !== nextState.dragging;
	// }

	// componentDidUpdate() {
	// 	const { current } = this.props;

	// 	// if (current){
	// 	// 	console.log('timebar updated.', current, moment.unix(current).format('YYYY-MM-DD HH:mm:ss'));
	// 	// }

	// }

	getDuration(current) {
		// 返回当前时间与传入的current的时间差；
		const days = Math.ceil((moment().unix() - current)/(24*60*60));
		// 时间如果有误差，可能出现小于0，至少得是1；
		this.days = days <= 0 ? 2: days;
		// console.log(days, current, moment().unix());
	}

	setHover(hover) {
		this.setState({
			hover
		});
	}

	setPosition(timestamp) {
		let { current } = this.props;
		current = timestamp || current;
		const { timeEnd } = this.state;

		if (this.wrapper) {
			// console.log('setPosition: time: ', current, this.wrapper.offsetWidth, moment.unix(current).format('YYYY-MM-DD HH:mm:ss'));
			const x = Math.ceil((timeEnd - current)*this.oneHourWidth/(60*60)+this.wrapper.offsetWidth/2);
			this.setState({
				position: {
					x,
					y: 0
				}
			});
		}
	}

	generateTime = () => {
		// const { onTimeChange } = this.props;
		const { days } = this;
		// 标尺左侧更长的时间线；
		// const timeStart = moment.unix(currentTime).subtract(24*days, 'hours').set({
		const timeStart = moment().subtract(24*(days+1), 'hours').set({
			minute: 0,
			second: 0,
			millisecond: 0
		}).unix(); // .subtract(1, 'day');

		// 标尺右侧的时间终点；
		// 无论从输入的当前时间是什么时候，始终需要渲染到从现在到未来24小时后的时间；
		const timeEnd = moment().add(24, 'hours').set({
			minute: 0,
			second: 0,
			millisecond: 0
		}).unix();

		this.setState({
			timeStart,
			timeEnd
		});

		// onTimeChange({
		// 	timeStart,
		// 	timeEnd
		// });
		// console.log(moment.unix(timeStart).format('YYYY-MM-DD HH:mm:ss'), moment.unix(timeEnd).format('YYYY-MM-DD HH:mm:ss'));
		const { onGenerateTimeRange } = this.props;
		onGenerateTimeRange(timeStart, timeEnd);
	}

	getBounds = () => {
		const { wrapper, oneHourWidth } = this;
		const { timeStart, timeEnd } = this.state;
		if (wrapper){
			const left = Math.ceil((timeEnd - moment().unix())*oneHourWidth/(60*60))+this.wrapper.offsetWidth/2;
			const right = Math.ceil((timeEnd - timeStart)*oneHourWidth/(60*60));
			// console.log('right: ', left, right);
			return {
				left,
				right
			};
		};

		return {
			left: 0,
			right: 0
		};
	}

	onStartDrag = (e, dragger) => {
		const { oneHourWidth } = this;
		const { onStartDrag } = this.props;
		const { timeEnd } = this.state;

		clearTimeout(this.onDragChangeTimeout);
		// console.log('dragger.x: ',dragger.x);
		const time = timeEnd - ((Math.abs(dragger.x) - this.wrapper.offsetWidth/2 )/oneHourWidth)*60*60;
		this.setState({
			dragging: true,
			timestamp: time
		});

		// this.firstTime = false;
		onStartDrag(time);
	}

	onMoveDrag = (e, dragger) => {
		const { x, lastX, deltaX } = dragger;

		clearTimeout(this.onDragChangeTimeout);
		if (Math.abs(deltaX) > 0 ) {
			const { oneHourWidth } = this;
			const { timeEnd } = this.state;

			const time = timeEnd - ((Math.abs(x) - this.wrapper.offsetWidth/2 )/oneHourWidth)*60*60;
			let drct = 'left';
			if ( x <= lastX){
				drct = 'right';
			};
			// this.firstTime = false;

			this.setState({
				timestamp: time,
				direction: drct
			});
		}
	}

	onStopDrag = (e, dragger) => {
		const { oneHourWidth } = this;
		const { timeStart, timeEnd } = this.state;

		const time = timeEnd - ((Math.abs(dragger.x) - this.wrapper.offsetWidth/2 )/oneHourWidth)*60*60;
		const right = Math.ceil((timeEnd - timeStart)*oneHourWidth/(60*60));

		// console.log(moment.unix(time).format('YYYY-MM-DD HH:mm:ss'));
		this.setState({
			timestamp: time,
			dragging: false
		});

		// console.log('onStop: ', time, dragger.x, this.days);
		if (dragger.x === right && this.days < 31){
			// 到左侧尽头了，需要判断是否渲染前面的时间
			this.days += 1;
			this.generateTime();
		}

		// 因为设置了position，所以需要手动确定位置；
		const { onStopDrag } = this.props;
		if (onStopDrag) {
			onStopDrag(time);
		}else{
			this.setPosition(time);
		}

		// this.setPosition(time);
		// clearTimeout(this.onDragChangeTimeout);
		// this.onDragChangeTimeout = setTimeout(() => {
		// 	const { onStopDrag } = this.props;
		// 	clearTimeout(this.onDragChangeTimeout);
		// 	onStopDrag(time);
		// }, 1000);
	}


	render() {
		// let { sources } = this.props;
		const { current, timeSlots } = this.props;
		const { dragging, timestamp, direction, timeStart, timeEnd, position, hover } = this.state;

		// sources = sources || [];
		// console.log('timebar sources: ', sources);

		// const { oneHourWidth } = this;
		// console.log('current: ', moment.unix(current).format('YYYY-MM-DD HH:mm:ss'));

		return(
			<div
				className={`${styles['timebar-container']} ${hover || dragging ? styles.hover : ''}`}
				onMouseOver={() => {
					this.setHover(true);
				}}

				onMouseLeave={() => {
					this.setHover(false);
				}}
			>
				<div className={styles['timebar-wrapper']}>
					<div className={`${styles.container} ${hover || dragging ? styles.hover : ''}`}>
						<div
							className={styles.wrapper}
							ref={(wrapper) => {
								this.wrapper = wrapper;
							}}
						>
							<Draggable
								axis="x"
								position={
									position
								}
								bounds={
									this.getBounds()
								}
								onStart={
									this.onStartDrag
								}
								onDrag={
									this.onMoveDrag
								}
								onStop={
									this.onStopDrag
								}
							>

								<div
									style={
										{
											width: 1
										}
									}
								>
									<Scaleplate
										timeStart={timeStart}
										timeEnd={timeEnd}
										dragging={dragging || hover}
										// sources={sources}
										timeSlots={timeSlots}
										current={current}
									/>
								</div>

							</Draggable>
						</div>
					</div>


					<Tooltip
						overlayClassName={styles.tips}
						visible={dragging}
						getPopupContainer={() => this.pointerWrapper}
						placement='top'
						title={
							<>
								<span className={`${styles.icon} ${ direction === 'left' ? styles.backward : ''} }`} />
								<span>{ moment.unix(timestamp).format('HH:mm') }</span>
							</>
						}
					>
						<div className={styles.pointer}>
							<div className={styles['pointer-wrapper']} ref={(wrapper) => { this.pointerWrapper = wrapper; }} />
						</div>
					</Tooltip>
				</div>
			</div>

		);
	}
};


export default VideoPlayerProgressBar;