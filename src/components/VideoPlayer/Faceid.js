import React from 'react';
// import moment from 'moment';

import styles from './Faceid.less';


class Faceid extends React.Component{
	render () {
		const { current, faceidRects, pixelRatio, currentPPI } = this.props;
		// console.log(faceidRects);
		const times = faceidRects.filter(item => {
			// console.log(current, item.timestamp);
			if ( current < item.timestamp && item.timestamp < current + 500){
				return true;
			}
			return false;
		});

		times.sort((a, b) => a.id - b.id);

		let temp = null;
		const rects = [];
		times.forEach((item, index) => {
			if (index === 0) {
				temp = item;
				rects.push(item);
				return;
			}
			if (temp.id === item.id) {
				if (item.timestamp > temp.timestamp) {
					rects.splice(rects.length-1, 1, item);
				}
			}else{
				rects.push(item);
			}
			temp = item;
		});

		// console.log('faceid 获得的时间：', current, moment.unix(current).format('YYYY-MM-DD HH:mm:ss:SSS'));
		// rects.forEach(item => {
		// 	console.log('框的时间戳：', item.id, item.timestamp, moment.unix(item.timestamp).format('YYYY-MM-DD HH:mm:ss:SSS'));
		// });

		return (
			<div className={styles['faceid-container']} ref={(container) => this.container = container}>
				{/* <div style={ {
					color: 'white',
					fontSize: '12px'
				}}>{ current }</div> */}
				{/* <div className={ styles['faceid-wrapper'] }> */}
				{
					!this.container ? '' :
						rects.map((item, index) => {

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
				{/* </div> */}
			</div>
		);
	}
};

export default Faceid;