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
					<p>{formatMessage({id: 'protocol.before.buy.tips'})}</p>
					<h3>{formatMessage({id: 'protocol.sub.title.first'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id: 'protocol.first.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.first.chapter.second'})}</li>
						<li>{formatMessage({id: 'protocol.first.chapter.third'})}</li>
						<li>{formatMessage({id: 'protocol.first.chapter.fourth'})}</li>
					</ol>
					<h3>{formatMessage({id: 'protocol.sub.title.second'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id:'protocol.second.chapter.first'})}</li>
						<li>{formatMessage({id:'protocol.second.chapter.second'})}</li>
					</ol>
					<h3>{formatMessage({id:'protocol.sub.title.third'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id: 'protocol.third.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.third.chapter.second'})}</li>
						<ol className={styles['ol-secondary']}>
							<li>{formatMessage({id:'protocol.third.chapter.second.sub.first'})}</li>
							<li>{formatMessage({id: 'protocol.third.chapter.second.sub.second'})}</li>
							<li>{formatMessage({id: 'protocol.third.chapter.second.sub.third'})}</li>
							<li>{formatMessage({id: 'protocol.third.chapter.second.sub.fourth'})}</li>
							<li>{formatMessage({id: 'protocol.third.chapter.second.sub.fifth'})}</li>
							<li>{formatMessage({id: 'protocol.third.chapter.second.sub.sixth'})}</li>
							<li>{formatMessage({id: 'protocol.third.chapter.second.sub.seventh'})}</li>
							<li>{formatMessage({id: 'protocol.third.chapter.second.sub.eighth'})}</li>
							<li>{formatMessage({id: 'protocol.third.chapter.second.sub.ninth'})}</li>
						</ol>
						<p>{formatMessage({id:'protocol.third.chapter.second.extra.msg'})}</p>
						<li>{formatMessage({id: 'protocol.third.chapter.third'})}</li>
					</ol>
					<h3>{formatMessage({id:'protocol.sub.title.fourth'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id:'protocol.fourth.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.fourth.chapter.second'})}</li>
						<li>{formatMessage({id: 'protocol.fourth.chapter.third'})}</li>
						<li>{formatMessage({id: 'protocol.fourth.chapter.fourth'})}</li>
					</ol>
					<h3>{formatMessage({id: 'protocol.sub.title.fifth'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id: 'protocol.fifth.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.fifth.chapter.second'})}</li>
					</ol>
					<h3>{formatMessage({id: 'protocol.sub.title.sixth'})}</h3>
					<p>{formatMessage({id: 'protocol.sixth.chapter.first'})}</p>
					<h3>{formatMessage({id: 'protocol.sub.title.seventh'})}</h3>
					<ol className={styles['ol-first']}>
						<li>{formatMessage({id: 'protocol.seventh.chapter.first'})}</li>
						<li>{formatMessage({id: 'protocol.seventh.chapter.second'})}</li>
						<li>{formatMessage({id: 'protocol.seventh.chapter.third'})}</li>
						<li>{formatMessage({id: 'protocol.seventh.chapter.fourth'})}</li>
					</ol>
				</div>
			</div>
		);
	}
}

export default ServiceProtocol;