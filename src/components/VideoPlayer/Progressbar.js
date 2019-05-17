import React from 'react';
import moment from 'moment';
import { Form, Slider } from 'antd';
import styles from './Progressbar.less';

class VideoPlayerProgressBar extends React.Component {
    render() {
        const { current, duration, form, onChange } = this.props;

        const { getFieldDecorator } = form;
        // console.log('duration, current', duration, current);
        return (
            <div className={styles['progressbar-container']}>
                <span className={`${styles.time} ${styles.current}`}>
                    {moment('1970-01-01T00:00:00.000')
                        .second(current)
                        .format('mm:ss')}
                </span>

                <Form.Item className={styles['percentage-container']}>
                    {getFieldDecorator('percentage')(
                        <Slider
                            min={0}
                            max={100}
                            tipFormatter={null}
                            onChange={value => {
                                const time = (value / 100) * duration;
                                onChange(time);
                            }}
                        />
                    )}
                </Form.Item>

                <span className={`${styles.time} ${styles.duration}`}>
                    {moment('1970-01-01T00:00:00.000')
                        .second(duration)
                        .format('mm:ss')}
                </span>
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        const { current, duration } = props;

        return {
            percentage: Form.createFormField({
                value: parseInt((current / duration) * 100, 10),
            }),
        };
    },
})(VideoPlayerProgressBar);
