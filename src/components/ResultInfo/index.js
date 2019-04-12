import React, { Component } from 'react';
import { Result } from 'ant-design-pro';
import router from 'umi/router';
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

  goNext = path => {
    router.push(path);
  };

  countDown = () => {
    const { tick = 1000, path = '/' } = this.props;
    clearInterval(this.countDownTimer);
    this.countDownTimer = setInterval(() => {
      const { count } = this.state;
      if (count <= 0) {
        this.goNext(path);
      } else {
        this.setState({
          count: count - 1,
        });
      }
    }, tick);
  };

  render() {
    const { count } = this.state;
    const { title, description } = this.props;
    return (
      <Result
        className={styles['result-wrapper']}
        type="success"
        title={<div className={styles['result-title']}>{title}</div>}
        description={
          <div className={styles['result-content']}>
            <span className={styles['result-count']}>{`${count}`}</span>
            {description}
          </div>
        }
      />
    );
  }
}

export default ResultInfo;
