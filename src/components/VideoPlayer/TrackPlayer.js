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
		const { url, hasAudio } = this.props;
		const { videoplayer } = this;

		videoplayer.src(url, hasAudio);
	}

	componentDidUpdate = (oldProps) => {
		const { url, hasAudio } = this.props;
		const { videoplayer } = this;

		if (
			url
			&& (oldProps.url !== url || hasAudio !== oldProps.hasAudio)
		   ) {
			console.log('更新播放器');
			videoplayer.src(url, hasAudio);
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

	onCanPlay = () => {
		const { showPaymentInfo } = this.props;
		console.log('onCanPlay', this.generateDuration());
		if(showPaymentInfo) {
			showPaymentInfo();
		}
		this.setState({
			duration: this.generateDuration()
		});
	}

	render () {
		const { current, duration } = this.state;

		return (
			<VideoPlayer
				ref={player => this.videoplayer = player}
				playHandler={this.playHandler}
				onPlay={this.onCanPlay}
				onCanPlay={this.onCanPlay}
				onCanplayThrough={this.onCanPlay}

				onTimeUpdate={this.onTimeUpdate}
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