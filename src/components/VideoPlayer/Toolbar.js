import React from 'react';
// import PropTypes from 'prop-types';
import { formatMessage } from 'umi/locale';
import { Button, DatePicker, Dropdown, Slider, Menu, Popover, Tooltip } from 'antd';
import moment from 'moment';

import styles from './Toolbar.less';

class Toolbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: false,
            datePickerVisiable: false,
        };

        this.changeDatePicker = this.changeDatePicker.bind(this);
    }

    changeDatePicker(visiable) {
        this.setState({
            datePickerVisiable: visiable,
        });
    }

    render() {
        const {
            play,
            progressbar,
            ppis,
            currentPPI,
            ppiChange,
            today,
            volume,
            playing,
            screenShot,
            isLive,
            isTrack,
            onDatePickerChange,
            canScreenShot,
            fullScreenStatus,
            backToLive,
            maxVolume,
            fullScreen,
            mute,
            changeVolume,
            volume: volumneValue,
        } = this.props;
        const { clicked, datePickerVisiable } = this.state;
        // console.log(today);

        let buttonNumber = 2; // 至少有音量调节和全屏显示；

        if (canScreenShot) {
            // 浏览器类型决定是否可以进行截图；
            buttonNumber++;
        }

        if (!isTrack) {
            // 片段模式下，不能切换分辨率，不能选择日期；
            buttonNumber += 2;
        }

        return (
            <div
                className={styles.toolbar}
                onMouseDown={() => {
                    this.setState({
                        clicked: true,
                    });
                }}
            >
                {
                    <div
                        className={`${styles['this-is-live']} ${
                            isLive && !clicked ? '' : styles.hidden
                        }`}
                    >
                        <div className={styles.text}>
                            {formatMessage({ id: 'videoPlayer.thisIsLive' })}
                        </div>
                    </div>
                }

                <div className={styles['play-control']}>
                    {/* {
						playing || isLive ? <Button disabled={ isLive } className={ styles['btn-play'] } shape="circle" onClick={ pause }></Button> : <Button disabled={ isLive } icon='play-circle' shape="circle" onClick={ play }></Button>
					} */}
                    <a
                        className={`${styles['button-play']} ${
                            playing || isLive ? styles.playing : ''
                        } ${!isTrack && isLive ? styles.disabled : ''}`}
                        href="javascript:void(0);"
                        onClick={play}
                    >
                        {formatMessage({ id: 'videoPlayer.play' })}
                    </a>
                </div>

                <div
                    className={`${styles['progressbar-control']} ${
                        styles[`control-items-${buttonNumber}`]
                    }`}
                >
                    {progressbar}
                </div>

                {!isTrack ? (
                    <div className={styles['ppis-control']}>
                        {/* <Select style={{ width: 90 }} onChange={ this.props.ppiChange }>
								{
									ppis.map((item) => {
										return(
											<Select.Option key={ item.value } value={ item.value }>{ item.name }</Select.Option>
										);
									})
								}
							</Select> */}
                        <div
                            className={styles.wrapper}
                            ref={wrapper => {
                                this.ppisWrapper = wrapper;
                            }}
                        />
                        {
                            <Dropdown
                                overlay={
                                    <Menu>
                                        {ppis.map(item => (
                                            <Menu.Item
                                                onClick={() => {
                                                    ppiChange(item.value);
                                                }}
                                                key={item.value}
                                            >
                                                {item.name}
                                            </Menu.Item>
                                        ))}
                                    </Menu>
                                }
                                overlayClassName={styles.dropdown}
                                placement="topCenter"
                                getPopupContainer={() => this.ppisWrapper}
                            >
                                <Button
                                    className={styles['button-ppis']}
                                    size="small"
                                    type="primary"
                                >
                                    {(() => {
                                        const current = ppis.filter(
                                            item => item.value === currentPPI
                                        );

                                        if (current.length > 0) {
                                            return current[0].name;
                                        }
                                        return ppis[0].name;
                                    })()}
                                </Button>
                            </Dropdown>
                        }
                    </div>
                ) : (
                    ''
                )}
                {!isTrack ? (
                    <div className={styles['calendar-control']}>
                        <div
                            className={styles.wrapper}
                            ref={wrapper => {
                                this.calendarWrapper = wrapper;
                            }}
                        />
                        <div className={styles.button}>
                            <Popover
                                content={
                                    <>
                                        <div
                                            ref={wrapper => (this.calendarPopupWrapper = wrapper)}
                                        />
                                        <DatePicker
                                            defaultValue={moment.unix(today)}
                                            getCalendarContainer={() => this.calendarPopupWrapper}
                                            disabledDate={current =>
                                                current > moment().endOf('day') ||
                                                current < moment().subtract(30, 'days')
                                            }
                                            onChange={time => {
                                                const date = time.set({
                                                    hour: 0,
                                                    minute: 0,
                                                    second: 0,
                                                    millisecond: 0,
                                                });
                                                this.changeDatePicker(false);
                                                onDatePickerChange(date.unix());
                                            }}
                                            open
                                            // onOpenChange={ this.changeDatePicker }
                                            dropdownClassName={styles['calendar-popup-dropdown']}
                                        />
                                    </>
                                }
                                overlayClassName={`${styles.dropdown} ${
                                    styles['calendar-dropdown']
                                }`}
                                placement="top"
                                getPopupContainer={() => this.calendarWrapper}
                                trigger="click"
                                visible={datePickerVisiable}
                                onVisibleChange={this.changeDatePicker}
                            >
                                <Tooltip
                                    overlayClassName={styles.tooltip}
                                    placement="top"
                                    getPopupContainer={() => this.calendarWrapper}
                                    title={formatMessage({ id: 'videoPlayer.pickDate' })}
                                >
                                    <a
                                        onClick={() => {
                                            this.changeDatePicker(true);
                                        }}
                                        className={styles['calendar-date']}
                                    >
                                        <span className={styles.text}>
                                            {moment.unix(today).date()}
                                        </span>
                                    </a>
                                </Tooltip>
                            </Popover>
                        </div>
                    </div>
                ) : (
                    ''
                )}

                {!canScreenShot ? (
                    ''
                ) : (
                    <div className={styles['screenshot-control']}>
                        <div
                            className={styles.wrapper}
                            ref={wrapper => (this.screenshotTooltip = wrapper)}
                        />
                        <Tooltip
                            overlayClassName={styles.tooltip}
                            placement="top"
                            getPopupContainer={() => this.screenshotTooltip}
                            title={formatMessage({ id: 'videoPlayer.videoScreenShot' })}
                        >
                            <a
                                className={styles['button-screenshot']}
                                onClick={screenShot}
                                href="javascript:void(0);"
                            >
                                {formatMessage({ id: 'vidoePlayer.screenShot' })}
                            </a>
                        </Tooltip>
                    </div>
                )}

                <div className={styles['volume-control']}>
                    <div
                        className={styles.wrapper}
                        ref={wrapper => {
                            this.volumeDropdown = wrapper;
                        }}
                    />

                    <Dropdown
                        className={styles['volume-dropdown']}
                        overlayClassName={styles.dropdown}
                        overlay={
                            <div className={styles['volume-bar']}>
                                <Slider
                                    className={styles['volume-slider']}
                                    vertical
                                    max={maxVolume}
                                    value={volumneValue}
                                    onChange={changeVolume}
                                />
                            </div>
                        }
                        placement="topCenter"
                        getPopupContainer={() => this.volumeDropdown}
                    >
                        <a
                            className={`${styles['button-volume']} ${
                                volume === 0 ? styles.muted : ''
                            }`}
                            href="javascript:void(0);"
                            onClick={mute}
                        >
                            {formatMessage({ id: 'videoPlayer.volume' })}
                        </a>
                    </Dropdown>
                </div>

                <div className={styles['fullscreen-control']}>
                    {/* <Button className='btn-fullscreen' icon='fullscreen' shape='circle' onClick={ this.props.fullScreen }></Button> */}
                    <div
                        className={styles.wrapper}
                        ref={wrapper => (this.fullScreenTooltip = wrapper)}
                    />
                    <Tooltip
                        overlayClassName={styles.tooltip}
                        placement="top"
                        getPopupContainer={() => this.fullScreenTooltip}
                        title={`${
                            fullScreenStatus
                                ? formatMessage({ id: 'videoPlayer.exitFullscreen' })
                                : formatMessage({ id: 'videoPlayer.enterFullscreen' })
                        }`}
                    >
                        <a
                            className={`${styles['button-fullscreen']} ${
                                fullScreenStatus ? styles.fullscreen : ''
                            }`}
                            href="javascript:void(0);"
                            onClick={fullScreen}
                        >
                            {formatMessage({ id: 'videoPlayer.enterFullscreen' })}
                        </a>
                    </Tooltip>
                </div>

                <div
                    className={`${styles['backtolive-control']} ${
                        !isTrack && !isLive ? '' : styles.hidden
                    }`}
                >
                    <Button onClick={backToLive} className={styles['button-backtolive']}>
                        {formatMessage({ id: 'videoPlayer.backToLive' })}
                    </Button>
                </div>
            </div>
        );
    }
}

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
