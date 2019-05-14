import React, { Component } from 'react';
import * as styles from './index.less';

const nameMap = {
    save: '保存',
    check: '检查',
    preStep: '上一步',
    nextStep: '下一步',
    wrapper: '外壳',
    view: '预览',
    history: '版本',
};

export default class ButtonIcon extends Component {
    render() {
        const { name, onClick } = this.props;

        return (
            <div className={styles['button-icon']} onClick={onClick}>
                <div className={styles['button-icon-img']}>
                    <img src={require(`@/assets/studio/${name}.svg`)} alt="" />
                </div>
                <span className={styles.name}>{nameMap[name]}</span>
            </div>
        );
    }
}
