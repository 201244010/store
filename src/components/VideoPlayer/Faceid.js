import React from 'react';
// import moment from 'moment';

import styles from './Faceid.less';


class Faceid extends React.Component{
	render () {
		const { current, faceidRects } = this.props;
		console.log('faceidRects=', faceidRects);
		console.log('current=', current); // current约每250ms更新一次
		// const currentVideoTime = moment(baseTime*1000 + Math.round(current)).format('YYYY-MM-DD HH:mm:ss.SSS');
		// console.log('currentVideoTime=', currentVideoTime);
		const tmp = faceidRects.filter(item => {
			// console.log('timestamp: ', item.timestamp);
			// console.log('timestamp - current=', item.timestamp - current); // current约每250ms更新一次
			// if ( current - 300 < item.timestamp && item.timestamp < current + 500){
			// console.log(item.timestamp - 300, current, item.timestamp + 1000);
			// if (item.timestamp + 300 < current && current < item.timestamp + 900) {
			// 	return true;
			// }
<<<<<<< HEAD
			// if (item.timestamp < current - 300 && current - 900 < item.timestamp) {
			// 	return true;
			// }

			// if (item.timestamp < current + 300 && current - 300 < item.timestamp) {
			// 	return true;
			// }
=======
>>>>>>> test
			if (item.timestamp < current + 100 && current - 500 < item.timestamp) {
				return true;
			}
			// if (item.timestamp < current + 200 && current - 400 < item.timestamp) {
			// 	return true;
			// }

			// if (item.timestamp < current + 110 && current - 490 < item.timestamp) {
			// 	return true;
			// }
			return false;
		});

		// console.log(tmp, current);

		tmp.sort((a, b) => {
			if (a.id !== b.id) {
				return a.id - b.id; // id从小到大排
			}
			return b.timestamp - a.timestamp; // 时间戳从大到小排
		});

		const rects = [];
		const hash = {};
		let i = 0;
		tmp.forEach(item => {
			// item.dateTime = moment(baseTime * 1000 + item.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS');
			if (hash[item.id] !== true) {
				rects.push(item);
				hash[item.id] = true;
				i++;
			} else if (Math.abs(item.timestamp - current) < Math.abs(rects[i-1].timestamp - current)) {
				rects[i-1] = item;
			}
		});

		console.log('finally rects=', rects);
		// console.log('finally hash=', hash);

		return (
			<div className={styles['faceid-container']} ref={(container) => this.container = container}>
				{
					!this.container ? '' :
						rects.map((item, index) => {
							// 任何分辨率下，设备端都按1080分辨率来上报人脸框，此处写成固定的1080下换算
							const pixelRatio = '16:9';
							const currentPPI = 1080;

							const ps = pixelRatio.split(':');
							const p = ps.map(obj => parseInt(obj, 10));

							const pixelHeight = parseInt(currentPPI, 10);
							const pixelWidth = p[0]*pixelHeight/p[1];

							const elementWidth = this.container.offsetWidth;
							const elementHeight = this.container.offsetHeight;

							let position = {};

							if (p[0]/p[1] > elementWidth/elementHeight) {
								// 例如16:9 elementWidth是实际值
								const elementVideoHeight = p[1]/p[0]*elementWidth; // 实际视频部分的高度
								const left = Math.ceil(item.left/pixelWidth*elementWidth);
								const width = Math.ceil((item.right - item.left)/pixelWidth*elementWidth);

								// console.log(elementWidth, elementVideoHeight, elementHeight);
								const top = Math.ceil(item.top/pixelHeight*elementVideoHeight + (elementHeight-elementVideoHeight)/2);
								const height = Math.ceil((item.bottom - item.top)/pixelHeight*elementVideoHeight);

								// console.log('left,top,width,height: ',left,top,width,height);
								position = {
									left,
									width,
									top,
									height,
									opacity: 1
								};
							}else{
								// 例如1：1 elementHeight 是实际值
								const elementVideoWidth = p[0]/p[1]*elementHeight;

								const left = Math.ceil(item.left/pixelWidth*elementVideoWidth + (elementWidth-elementVideoWidth)/2);
								const width = Math.ceil((item.right - item.left)/pixelWidth*elementVideoWidth);

								const top = Math.ceil(item.top/pixelHeight*elementHeight);
								const height = Math.ceil((item.bottom - item.top)/pixelHeight*elementHeight);

								position = {
									left,
									width,
									top,
									height,
									opacity: 1
								};
							}

							return (
								<div
									key={index}
									style={
										position
									}
									className={styles['faceid-rectangle']}
								>
									<div className={`${styles['corner-top-left']} ${ styles.corner}`}>
										<div className={styles.border} />
									</div>
									<div className={`${styles['corner-top-right']} ${ styles.corner}`}>
										<div className={styles.border} />
									</div>
									<div className={`${styles['corner-bottom-left']} ${ styles.corner}`}>
										<div className={styles.border} />
									</div>
									<div className={`${styles['corner-bottom-right']} ${ styles.corner}`}>
										<div className={styles.border} />
									</div>
								</div>
							);
						})
				}
			</div>
		);
	}
};

export default Faceid;