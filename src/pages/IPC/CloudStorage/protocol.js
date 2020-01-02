import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import styles from './Protocol.less';

class ServiceProtocol extends React.Component{
	render(){
		return(
			<div className={styles['protocol-container']}>
				<h2 className={styles.title}>{formatMessage({id:'protocol.title'})}</h2>
				<div className={styles['protocol-content']}>
					<p>{formatMessage({id: 'protocol.dear.user'})}</p>
					<p>{formatMessage({id: 'protocol.before.buy.tips.one'})}</p>
					<p>{formatMessage({id: 'protocol.before.buy.tips.two'})}</p>
					<p>{formatMessage({id: 'protocol.before.buy.tips.three'})}</p>

					<h3>{formatMessage({id: 'protocol.sub.title.first'})}</h3>
					<p>{formatMessage({id: 'protocol.first.chapter.pre'})}</p>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id: 'protocol.first.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.first.chapter.second'})}</li>
						<li>{formatMessage({id: 'protocol.first.chapter.third'})}</li>
						<li>{formatMessage({id: 'protocol.first.chapter.fourth'})}</li>
						<li>{formatMessage({id: 'protocol.first.chapter.fifth'})}</li>
						<li>{formatMessage({id: 'protocol.first.chapter.sixth'})}</li>
						<li>{formatMessage({id: 'protocol.first.chapter.seventh'})}</li>
					</ol>
					<h3>{formatMessage({id: 'protocol.sub.title.second'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id:'protocol.second.chapter.first'})}</li>
						<li>{formatMessage({id:'protocol.second.chapter.second'})}</li>
						<li>{formatMessage({id:'protocol.second.chapter.third'})}</li>
					</ol>
					<h3>{formatMessage({id:'protocol.sub.title.third'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id: 'protocol.third.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.third.chapter.second'})}</li>
						<li>{formatMessage({id: 'protocol.third.chapter.third'})}</li>
						<li>{formatMessage({id: 'protocol.third.chapter.fourth'})}</li>
						<li>{formatMessage({id: 'protocol.third.chapter.fifth'})}</li>
						<ol className={styles['ol-secondary']}>
							<li>{formatMessage({id:'protocol.third.chapter.fifth.sub.first'})}</li>
							<li>{formatMessage({id: 'protocol.third.chapter.fifth.sub.second'})}</li>
							<li>{formatMessage({id: 'protocol.third.chapter.fifth.sub.third'})}</li>
						</ol>
					</ol>
					<h3>{formatMessage({id:'protocol.sub.title.fourth'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id:'protocol.fourth.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.fourth.chapter.second'})}</li>
						<li>{formatMessage({id: 'protocol.fourth.chapter.third'})}</li>
						<ol className={styles['ol-secondary']}>
							<li>{formatMessage({id:'protocol.fourth.chapter.third.sub.first'})}</li>
							<li>{formatMessage({id: 'protocol.fourth.chapter.third.sub.second'})}</li>
							<li>{formatMessage({id: 'protocol.fourth.chapter.third.sub.third'})}</li>
							<li>{formatMessage({id: 'protocol.fourth.chapter.third.sub.fourth'})}</li>
						</ol>
						<li>{formatMessage({id: 'protocol.fourth.chapter.fourth'})}</li>
						<li>{formatMessage({id: 'protocol.fourth.chapter.fifth'})}</li>
					</ol>
					<h3>{formatMessage({id: 'protocol.sub.title.fifth'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id: 'protocol.fifth.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.fifth.chapter.second'})}</li>
						<ol className={styles['ol-secondary']}>
							<li>{formatMessage({id:'protocol.fifth.chapter.second.sub.first'})}</li>
							<li>{formatMessage({id: 'protocol.fifth.chapter.second.sub.second'})}</li>
							<li>{formatMessage({id: 'protocol.fifth.chapter.second.sub.third'})}</li>
							<li>{formatMessage({id: 'protocol.fifth.chapter.second.sub.fourth'})}</li>
						</ol>
						<li>{formatMessage({id: 'protocol.fifth.chapter.third'})}</li>
						<li>{formatMessage({id: 'protocol.fifth.chapter.fourth'})}</li>
						<li>{formatMessage({id: 'protocol.fifth.chapter.fifth'})}</li>
						<li>{formatMessage({id: 'protocol.fifth.chapter.sixth'})}</li>
						<li>{formatMessage({id: 'protocol.fifth.chapter.seventh'})}</li>
					</ol>
					<h3>{formatMessage({id: 'protocol.sub.title.sixth'})}</h3>
					<p>{formatMessage({id: 'protocol.sixth.chapter.first'})}</p>
					<h3>{formatMessage({id: 'protocol.sub.title.seventh'})}</h3>
					<p>{formatMessage({id: 'protocol.seventh.chapter.pre'})}</p>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id: 'protocol.seventh.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.seventh.chapter.second'})}</li>
						<li>{formatMessage({id: 'protocol.seventh.chapter.third'})}</li>
					</ol>
					<h3>{formatMessage({id: 'protocol.sub.title.eighth'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id: 'protocol.eighth.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.eighth.chapter.second'})}</li>
					</ol>
					<h3>{formatMessage({id: 'protocol.sub.title.ninth'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id: 'protocol.ninth.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.ninth.chapter.second'})}</li>
						<li>{formatMessage({id: 'protocol.ninth.chapter.third'})}</li>
					</ol>
				</div>
			</div>
		);
	}
}

export default ServiceProtocol;