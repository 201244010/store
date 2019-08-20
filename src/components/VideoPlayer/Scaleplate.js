import React from 'react';
import moment from 'moment';
// import _ from 'lodash';
import styles from './Scaleplate.less';

class Scaleplate extends React.Component{

	constructor(props) {
		super(props);

		this.renderedTimestamp = 0;	// 记录上次绘制时的左侧时间戳

	}

	// shouldComponentUpdate(nextProps) {
	// 	// console.log(this.renderedTimestamp, nextProps.timeStart);
	// 	// return this.renderedTimestamp - nextProps.timeStart >= 24*60*60;
	// 	const { sources } = this.props;
	// 	return this.renderedTimestamp !== nextProps.timeStart || sources.length === 0;
	// }
	// componentDidUpdate() {
	// 	console.log('scale updated.');
	// }

	render () {
		const { /* sources, */timeSlots: blocks, timeStart, timeEnd, dragging } = this.props;
		// const { timeArray } = this.state;
		const len = Math.ceil((timeEnd - timeStart)/(60*60));
		// console.log('scaleplate sources: ', sources);
		const timeArray = [];
		for (let index = 0; index < len; index++){
			const timestamp = timeEnd - 60*60*index;
			timeArray.push({
				timestamp,
				dragging: true
			});
		};

		timeArray.sort((a, b) => a.timestamp - b.timestamp);

		this.renderedTimestamp = timeStart;

		const oneHourWidth = 60;
		const lineWidth = oneHourWidth*(timeArray.length+24)+1; // 增加1天的空白量，在新增渲染时，保持顺滑
		// const blocks = [];
		// sources.reduce((target, item) => {

		// 	const { timeStart: start, timeEnd: end } = item;
		// 	if (!target.timeStart) {
		// 		return {
		// 			timeStart: start,
		// 			timeEnd: end
		// 		};
		// 	};

		// 	if (start - target.timeEnd < 60 ) {
		// 		// 小于一分钟就认为是连续的
		// 		target.timeEnd = end;
		// 	}else{
		// 		blocks.push(target);
		// 		return {
		// 			timeStart: start,
		// 			timeEnd: end
		// 		};
		// 	};
		// 	return target;
		// }, {});

		// console.log('blocks', blocks);

		return (
			<div className={`${styles['time-line-container']} ${dragging ? styles.dragging : ''}`}>
				<div
					className={`${styles['time-line']} ${dragging ? styles.dragging : ''}`}
					style={{
						width: lineWidth
					}}
				>
					<div className={styles['time-line-wrapper']}>
						{

							timeArray.map((item, index) =>
								// console.log('run map.');
								(
									<div key={item.timestamp || index} className={[ styles['hour-block'] , moment.unix(item.timestamp).format('YYYY-MM-DD_HH:mm')].join(' ')}>

										<div className={styles.short} />
										<div className={styles.short} />
										<div className={styles.short} />
										<div className={styles.short} />
										<div className={styles.short} />

										<div className={styles.high}>
											<div className={styles.tag}>
												{
													moment.unix(item.timestamp).format('HH:mm')
												}
											</div>
										</div>

									</div>
								)
							)
						}
					</div>

					<div className={styles.sources}>
						{
							blocks.map((source, index) => (
								<div
									key={source.name || index}
									className={styles.block}
									data-time-start={moment.unix(source.timeStart).format('YYYY-MM-DD HH:mm:ss')}
									data-time-end={moment.unix(source.timeEnd).format('YYYY-MM-DD HH:mm:ss')}
									style={(() =>
										// console.log(moment.unix(source.timeEnd).format('YYYY-MM-DD HH:mm:ss'));
										({
											// left: `${Math.ceil((timeEnd - source.timeStart)*oneHourWidth/3600)}px`,
											right: `${Math.floor((timeEnd - source.timeEnd)*oneHourWidth/3600)}px`,
											// right: Math.ceil((timeEnd - source.timeEnd)*oneHourWidth/3600)+'px',
											width: `${Math.floor((source.timeEnd - source.timeStart)*oneHourWidth/3600)}px`
										})
									)()}
								/>
							))
						}
					</div>
				</div>
			</div>
		);
	}
}

export default Scaleplate;