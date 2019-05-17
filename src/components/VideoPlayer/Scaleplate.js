import React from 'react';
import moment from 'moment';
// import _ from 'lodash';
import styles from './Scaleplate.less';

class Scaleplate extends React.Component{

	constructor(props) {
		super(props);

		this.renderedTimestamp = 0;	// 记录上次绘制时的左侧时间戳

	}

	shouldComponentUpdate(nextProps) {
		// console.log(this.renderedTimestamp, nextProps.timeStart);
		// return this.renderedTimestamp - nextProps.timeStart >= 24*60*60;
		return this.renderedTimestamp !== nextProps.timeStart;
	}
	// componentDidUpdate() {
	// 	console.log('scale updated.');
	// }

	render () {
		const { sources, timeStart, timeEnd } = this.props;
		// const { timeArray } = this.state;
		const len = Math.ceil((timeEnd - timeStart)/(60*60));

		const timeArray = [];
		for (let index = 0; index < len; index++){
			const timestamp = timeEnd - 60*60*index;

			timeArray.push({
				timestamp,
				dragging: true
			});
		};

		timeArray.sort((a, b ) => a.timestamp - b.timestamp);

		this.renderedTimestamp = timeStart;

		const oneHourWidth = 60;
		const lineWidth = oneHourWidth*timeArray.length+1;

		return (
			<div
				className={styles['time-line']}
				style={{
					width: lineWidth
				}}
			>
				<div className={styles['timeline-wrapper']}>
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
						sources.map((source, index) => (
							<div 
								key={source.name || index}
								className={styles.block}
								style={(() => 
									// console.log(moment.unix(source.timeEnd).format('YYYY-MM-DD HH:mm:ss'));
									 ({
										// left: Math.ceil((source.timeStart - timeOriginal)*oneHourWidth/3600)+'px',
										right: `${Math.ceil((timeEnd - source.timeEnd)*oneHourWidth/3600)}px`,
										// right: Math.ceil((timeEnd - source.timeEnd)*oneHourWidth/3600)+'px',
										width: `${Math.ceil(1*oneHourWidth/3600)}px`
									})
								)()}
							/>
						))
					}
				</div>
			</div>
		);
	}
}

export default Scaleplate;