import React from 'react';
import Progressbar from './Progressbar';
import VideoPlayer from './VideoPlayer';


class TrackPlayer extends React.Component{
	constructor (props) {
		super(props);

		this.state = {
			current: 0,
			duration: 0
		};
	}

	componentDidMount = () => {
		const { url, autoPlay = true } = this.props;
		const { videoplayer } = this;

		videoplayer.src(url);
		if(!autoPlay){
			this.pause();
		}
	}

	componentDidUpdate = (oldProps) => {
		const { url, autoPlay = tru } = this.props;
		const { videoplayer } = this;

		if (url && oldProps.url !== url) {
			videoplayer.src(url);
			if(!autoPlay){
				this.pause();
			}
		}
	}

	play = () => {
		const { videoplayer } = this;
		videoplayer.play();
	}

	pause = () => {
		const { videoplayer } = this;
		videoplayer.pause();
	}

	setCurrentTime = (timestamp) => {
		const { videoplayer } = this;
		videoplayer.setCurrentTime(timestamp);
	}

	playHandler = () => {
		const { videoplayer } = this;
		if (videoplayer.paused()){
			videoplayer.play();
		}else{
			videoplayer.pause();
		}
	}

	generateDuration = () => {
		const { videoplayer } = this;
		const { defaultDuration } = this.props;
		return videoplayer.generateDuration() || defaultDuration || 0;
	}

	onTimeUpdate = (current) => {
		this.setState({
			current,
			duration: this.generateDuration()
		});
	}

	// onPlay = () => {
	// 	const duration = this.generateDuration();

	// 	this.setState({
	// 		duration
	// 	});
	// }

	render () {
		const { current, duration } = this.state;

		return (
			<VideoPlayer
				ref={player => this.videoplayer = player}
				playHandler={this.playHandler}
				onTimeUpdate={this.onTimeUpdate}
				// onPlay={this.onPlay}
				{...this.props}

				progressbar={
					<Progressbar
						current={current}
						duration={duration}
						onChange={this.setCurrentTime}
					/>
				}
			/>
		);
	}

};

export default TrackPlayer;