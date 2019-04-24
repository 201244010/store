import React, { PureComponent } from 'react';
import { formatMessage, setLocale, getLocale } from 'umi/locale';
import { Menu, Icon } from 'antd';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export default class SelectLang extends PureComponent {
    changeLang = ({ key }) => {
        setLocale(key);
    };

    render() {
        const { className } = this.props;
        const selectedLang = getLocale();
        const langMenu = (
            <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={this.changeLang}>
                <Menu.Item className={styles['menu-item']} key="zh-CN">
                    中国大陆
                </Menu.Item>
                <Menu.Item className={styles['menu-item']} key="en-US">
                    其他地区
                </Menu.Item>
            </Menu>
        );
        return (
            <HeaderDropdown overlay={langMenu} placement="bottomRight">
                <span className={classNames(styles.dropDown, className)}>
                    <Icon type="global" title={formatMessage({ id: 'navBar.area' })} />
                </span>
            </HeaderDropdown>
        );
    }
}
