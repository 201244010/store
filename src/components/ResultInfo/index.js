import React, { Component } from 'react';
import { Button } from 'antd';
import BigIcon from '@/components/BigIcon';
import styles from './index.less';

class ResultInfo extends Component {
    constructor(props) {
        super(props);
        const { countInit } = this.props;
        this.countDownTimer = null;
        this.state = {
            count: countInit,
        };
    }

    componentDidMount() {
        this.countDown();
    }

    componentWillUnmount() {
        clearInterval(this.countDownTimer);
    }

    countComplete = () => {
        const { countDone = null } = this.props;
        if (countDone) {
            countDone();
        }
    };

    countDown = () => {
        const { tick = 1000 } = this.props;
        clearInterval(this.countDownTimer);
        this.countDownTimer = setInterval(() => {
            const { count } = this.state;
            if (count <= 0) {
                clearInterval(this.countDownTimer);
                this.countComplete();
            } else {
                this.setState({
                    count: count - 1,
                });
            }
        }, tick);
    };

    render() {
        const { count } = this.state;
        const { title, description, wrapperStyle = {}, CustomIcon = null } = this.props;
        return (
            <div className={styles['result-wrapper']}>
                <BigIcon
                    {...{
                        type: 'check',
                        wrapperStyle: {
                            width: '80px',
                            height: '80px',
                            border: '100%',
                            margin: '0 auto',
                            backgroundImage: 'linear-gradient(-180deg, #CDF76A 0%, #6DD13B 100%)',
                            ...wrapperStyle,
                        },
                        CustomIcon,
                    }}
                />
                <div className={styles['result-title']}>{title}</div>
                <div className={styles['result-action-wrapper']}>
                    <Button className={styles['action-btn']} block onClick={this.countComplete}>
                        {`${count}`}
                        {description}
                    </Button>
                </div>
            </div>
        );
    }
}

export default ResultInfo;
