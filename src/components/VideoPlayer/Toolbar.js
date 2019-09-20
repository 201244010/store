import React from 'react';
import _ from 'lodash';

import { formatMessage } from 'umi/locale';
import { Button, DatePicker, Dropdown, Slider, Menu, Popover, Tooltip } from 'antd';
import moment from 'moment';

import styles from './Toolbar.less';


class Toolbar extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			clicked: false,
			datePickerVisiable: false
		};

		this.changeDatePicker = this.changeDatePicker.bind(this);
	}

	shouldComponentUpdate(oldProps, oldState) {
		const { today, progressbar } = this.props;

		const isEqualProps = _.isEqual({
			...oldProps,
			today: 0,
			progressbar: null,
			slots: oldProps.progressbar.props.timeSlots
		}, {
			...this.props,
			today: 0,
			progressbar: null,
			slots: progressbar.props.timeSlots
		});

		const isEqualState = _.isEqual(oldState, this.state);

		if (isEqualProps && isEqualState) {
			const { progressbar: oldBar } = oldProps;

			if (progressbar.props.duration !== oldBar.props.duration) {
				return true;
			}

			if (progressbar.props.current !== oldBar.props.current) {
				return true;
			}

			if (Math.abs(today - oldProps.today) <= 24*3600) {
				return false;
			}

			return true;
		}
		return true;
	}

	changeDatePicker(visiable) {
		this.setState({
			datePickerVisiable: visiable
		});
	}

	render () {
		const {
			play, progressbar, ppis,
			currentPPI, ppiChange, ppiChanged, canPPIChange,
			isLive,
			today, playing, playBtnDisabled,
			showDatePicker, onDatePickerChange,
			canScreenShot, screenShot,
			backToLive, showBackToLive,
			fullScreen, fullScreenStatus,
			maxVolume, mute, changeVolume, volume: volumneValue
		} = this.props;

		const { clicked, datePickerVisiable } = this.state;

		let buttonNumber = 2;	// 至少有音量调节和全屏显示；

		if (canScreenShot) {
			// 浏览器类型决定是否可以进行截图；
			buttonNumber += 1;
		}

		if (showDatePicker) {
			// 能选择日期；
			buttonNumber += 1;
		}

		if (canPPIChange) {
			// 能切换分辨率；
			buttonNumber += 1;
		}


		const t = ppis.filter((item) => item.value === currentPPI);
		let modeText = '';
		if (t.length > 0) {
			modeText = t[0].name;
		}

		return(
			<div
				className={styles.toolbar}
				onMouseDown={() => {
					this.setState({
						clicked: true
					});
				}}
			>
				{
					// 当前处于直播状态的提示
					<div className={`${ styles['this-is-live'] } ${ isLive && !clicked ? '' : styles.hidden }`}>
						<div className={styles.text}>{ formatMessage({ id: 'videoPlayer.thisIsLive'}) }</div>
					</div>
				}

				{
					canPPIChange ?
						// 分辨率切换成功提示；
						<div className={`${ styles['this-is-live'] } ${ isLive && ppiChanged ? '' : styles.hidden }`}>
							<div className={styles.text}>
								{
									formatMessage({id: 'videoPlayer.ppiChanged'}).replace('%mode%', modeText)
								}
							</div>
						</div>
						: ''
				}

				<div className={`${styles.control} ${styles['play-control']}`}>

					<a className={`${styles.button} ${styles['button-play']} ${  playing ? styles.playing : ''} ${ playBtnDisabled ? styles.disabled : '' }`} onClick={play}>
						{
							formatMessage({ id: 'videoPlayer.play' })
						}
					</a>
				</div>

				<div className={`${styles.control} ${styles['progressbar-control']} ${ styles[`control-items-${buttonNumber}`]}`}>
					{ progressbar }
				</div>

				{
					canPPIChange ?
						<div className={`${styles.control} ${styles['ppis-control']}`}>
							<div
								className={styles.wrapper}
								ref={(wrapper) => {
									this.ppisWrapper = wrapper;
								}}
							/>
							{
								<Dropdown
									disabled={!isLive}
									overlay={
										<Menu
											selectedKeys={[`${currentPPI}`]}
										>
											{
												ppis.map((item) => (
													<Menu.Item
														onClick={() => {
															ppiChange(item.value);
														}}
														key={`${item.value}`}
													>
														{ item.name }
													</Menu.Item>
												))
											}
										</Menu>
									}
									overlayClassName={styles.dropdown}
									placement="topCenter"
									getPopupContainer={() => this.ppisWrapper}
								>
									<Button
										className={`${styles['button-ppis']}`}
										disabled={!isLive}
										size='small'
										type='primary'
									>
										{
											(() => {
												const current = ppis.filter(item => item.value === currentPPI);

												if (current.length > 0){
													return current[0].name;
												}
												return ppis[0].name;
											})()
										}
									</Button>
								</Dropdown>
							}
						</div>
						: ''
				}
				{

					showDatePicker ?
						<div className={`${styles.control} ${styles['calendar-control']}`}>
							<div
								className={styles.wrapper}
								ref={(wrapper) => {
									this.calendarWrapper = wrapper;
								}}
							/>
							<div className={styles.button}>
								<Popover
									content={
										(
											<>
												<div ref={wrapper => this.calendarPopupWrapper = wrapper} />
												<DatePicker

													value={moment.unix(today)}

													getCalendarContainer={() => this.calendarPopupWrapper}

													disabledDate={(current) => current > moment().endOf('day') || current < moment().subtract(30, 'days')}

													onChange={(time) => {
														const date = time.set({
															hour: 0,
															minute: 0,
															second: 0,
															millisecond: 0
														});

														this.changeDatePicker(false);

														onDatePickerChange(date.unix());
													}}
													open
													// onOpenChange={ this.changeDatePicker }
													dropdownClassName={styles['calendar-popup-dropdown']}
												/>
											</>
										)
									}
									overlayClassName={`${styles.dropdown} ${ styles['calendar-dropdown'] }`}
									placement='top'
									getPopupContainer={() => this.calendarWrapper}

									trigger='click'
									visible={datePickerVisiable}
									onVisibleChange={this.changeDatePicker}
								>
									<Tooltip
										overlayClassName={styles.tooltip}
										placement='top'
										getPopupContainer={() => this.calendarWrapper}
										title={
											formatMessage({ id: 'videoPlayer.pickDate' })
										}
									>
										<a
											onClick={() => {
												this.changeDatePicker(true);
											}}
											className={`${styles.button} ${styles['calendar-date']}`}
										>
											<span className={styles.text}>
												{ moment.unix(today).date() }
											</span>
										</a>
									</Tooltip>
								</Popover>
							</div>
						</div>
						: ''

				}

				{
					canScreenShot ?
						<div className={`${styles.control} ${styles['screenshot-control']}`}>
							<div className={styles.wrapper} ref={(wrapper) => this.screenshotTooltip = wrapper} />
							<Tooltip
								overlayClassName={styles.tooltip}
								placement='top'
								getPopupContainer={() => this.screenshotTooltip}
								title={
									formatMessage({ id: 'videoPlayer.videoScreenShot' })
								}
							>
								<a className={`${styles.button} ${styles['button-screenshot']}`} onClick={screenShot}>
									{
										formatMessage({ id: 'vidoePlayer.screenShot' })
									}
								</a>
							</Tooltip>
						</div>
						: ''
				}

				<div className={`${styles.control} ${styles['volume-control']}`}>
					<div
						className={styles.wrapper}
						ref={(wrapper) => {
							this.volumeDropdown = wrapper;
						}}
					/>

					<Dropdown
						className={styles['volume-dropdown']}
						overlayClassName={styles.dropdown}
						overlay={
							<div className={styles['volume-bar']}>
								<Slider className={styles['volume-slider']} vertical max={maxVolume} value={volumneValue} onChange={changeVolume} />
							</div>
						}
						placement="topCenter"
						getPopupContainer={() => this.volumeDropdown}
					>
						<a className={`${styles.button} ${styles['button-volume']} ${ volumneValue === 0 ? styles.muted : ''}`} onClick={mute}>
							{
								formatMessage({ id: 'videoPlayer.volume' })
							}
						</a>
					</Dropdown>
				</div>


				<div className={`${styles.control} ${styles['fullscreen-control']}`}>
					{/* <Button className='btn-fullscreen' icon='fullscreen' shape='circle' onClick={ this.props.fullScreen }></Button> */}
					<div className={styles.wrapper} ref={(wrapper) => this.fullScreenTooltip = wrapper} />
					<Tooltip
						overlayClassName={styles.tooltip}
						placement='top'
						getPopupContainer={() => this.fullScreenTooltip}
						title={
							`${ fullScreenStatus ? formatMessage({ id: 'videoPlayer.exitFullscreen' }) : formatMessage({ id: 'videoPlayer.enterFullscreen' }) }`
						}
					>
						<a className={`${styles.button} ${styles['button-fullscreen']} ${ fullScreenStatus ? styles.fullscreen : ''}`} onClick={fullScreen}>
							{
								formatMessage({ id: 'videoPlayer.enterFullscreen' })
							}
						</a>
					</Tooltip>
				</div>


				<div className={`${styles.control} ${styles['backtolive-control']} ${ showBackToLive ? '' : styles.hidden }`}>
					<Button onClick={backToLive} className={styles['button-backtolive']}>{ formatMessage({ id: 'videoPlayer.backToLive'}) }</Button>
				</div>

			</div>
		);
	}
};

// Toolbar.propTypes = {
// 	play: PropTypes.func.isRequired,
// 	playing: PropTypes.bool.isRequired,
// 	mute: PropTypes.func.isRequired,
// 	volume: PropTypes.number,
// 	maxVolume: PropTypes.number,

// 	changeVolume: PropTypes.func.isRequired,

// 	screenShot: PropTypes.func.isRequired,
// 	canScreenShot: PropTypes.bool.isRequired,

// 	fullScreen: PropTypes.func.isRequired,
// 	fullScreenStatus: PropTypes.bool.isRequired,

// 	ppis: PropTypes.array.isRequired,
// 	ppiChange: PropTypes.func.isRequired,


// 	onDatePickerChange: PropTypes.func.isRequired,

// 	backToLive: PropTypes.func.isRequired
// };

export default Toolbar;