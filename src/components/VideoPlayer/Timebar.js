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

		this.days = 1;	// 用来向前记录渲染了多少日期；
		this.oneHourWidth = 60;

		this.generateTime = this.generateTime.bind(this);
	}

	componentWillMount() {
		const { current } = this.props;

		this.getDuration(current);
		this.generateTime();
	}

	componentDidMount() {
		this.setPosition();
	}

	componentWillReceiveProps(props) {
		const { current } = props;
		const { timeStart } = this.state;
		// console.log(current, this.state.timeStart);
		if (current < timeStart){
			this.getDuration(current);
			this.generateTime();
		}
		this.setPosition(current);
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
		const days = Math.ceil((moment().unix() - current)/(24*60*60)) + 1;
		// 时间如果有误差，可能出现小于0，至少得是1；
		this.days = days <= 0 ? 1: days;
	}

	setPosition(timestamp) {
		let { current } = this.props;
		current = timestamp || current;
		const { timeStart } = this.state;

		if (this.wrapper) {
			// console.log('position: ', moment.unix(current).format('YYYY-MM-DD HH:mm:ss'));
			const x = Math.ceil((timeStart - current)*this.oneHourWidth/(60*60)+this.wrapper.offsetWidth/2);

			this.setState({
				position: {
					x,
					y: 0
				}
			});
		}
	}

	generateTime() {
		// const { onTimeChange } = this.props;
		const { days } = this;
		// console.log('generateTime', days);
		// 标尺左侧更长的时间线；
		// const timeStart = moment.unix(currentTime).subtract(24*days, 'hours').set({
		const timeStart = moment().subtract(24*days, 'hours').set({
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

		const { onChange, current } = this.props;
		onChange(current);
	}


	render() {
		let { sources } = this.props;
		const { onChange, current } = this.props;
		const { dragging, timestamp, direction, timeStart, timeEnd, position } = this.state;

		sources = sources || [];
		// console.log('timebar sources: ', sources);

		const { oneHourWidth } = this;

		// console.log('current: ', moment.unix(current).format('YYYY-MM-DD HH:mm:ss'));

		return(
			<div className={styles['timebar-container']}>

				<div className={`${styles.container} ${dragging ? styles.dragging : ''}`}>
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
								(() => {
									if (this.wrapper){
										const left = Math.ceil((timeStart - moment().unix())*oneHourWidth/(60*60))+this.wrapper.offsetWidth/2;

										return {
											right: 0,
											left
										};
									};

									return {
										left: 0,
										right: 0
									};
								})()
							}
							onStart={
								(e, dragger) => {
									// console.log('dragger.x: ',dragger.x);
									const time = ((Math.abs(dragger.x) + this.wrapper.offsetWidth/2 )/oneHourWidth)*60*60 + timeStart;
									this.setState({
										dragging: true,
										timestamp: time
									});
								}
							}
							onDrag={
								(e, dragger) => {
									const { x, lastX, deltaX } = dragger;
									if (Math.abs(deltaX) > 0 ) {

										const time = ((Math.abs(x) + this.wrapper.offsetWidth/2 )/oneHourWidth)*60*60 + timeStart;
										let drct = 'left';
										if ( x <= lastX){
											drct = 'right';
										};
										this.firstTime = false;

										this.setState({
											timestamp: time,
											direction: drct
										});
									}
								}
							}
							onStop={
								(e, dragger) => {
									const time = ((Math.abs(dragger.x) + this.wrapper.offsetWidth/2 )/oneHourWidth)*60*60 + timeStart;

									this.setState({
										timestamp: time,
										dragging: false
									});

									// console.log('onStop: ', time, dragger.x, this.days);

									if (dragger.x === 0 && this.days < 31){

										// 到左侧尽头了，需要判断是否渲染前面的时间
										this.days++;
										this.generateTime();

									}

									// 因为设置了position，所以需要手动确定位置；
									if (onChange){
										onChange(time);
									}else{
										this.setPosition(time);
									}
								}
							}
						>
							<div>
								<Scaleplate
									timeStart={timeStart}
									timeEnd={timeEnd}
									dragging={dragging}
									sources={sources}
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
							<span>{ moment.unix(timestamp).format('HH:mm:ss') }</span>
						</>
					}
				>
					<div className={styles.pointer}>
						<div className={styles['pointer-wrapper']} ref={(wrapper) => { this.pointerWrapper = wrapper; }} />
					</div>
				</Tooltip>

			</div>

		);
	}
};


export default VideoPlayerProgressBar;