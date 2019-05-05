import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
// import SelectLang from '@/components/SelectLang';
import pathToRegexp from 'path-to-regexp';
import * as styles from './SunmiLayout.less';

class SunmiLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bgClass: 'login-bg',
        };
    }

    componentDidMount() {
        const {
            location: { pathname },
        } = window;
        const gaosBg = ['storeRelate', 'merchantCreate'];

        if (gaosBg.some(path => pathname.indexOf(path) > -1)) {
            this.setState({
                bgClass: 'login-gaos-bg',
            });
        }
    }

    componentWillReceiveProps() {
        const {
            location: { pathname },
        } = window;

        const gaosBg = ['storeRelate', 'merchantCreate'];

        if (gaosBg.some(path => pathname.indexOf(path) > -1)) {
            this.setState({
                bgClass: 'login-gaos-bg',
            });
        }
    }

    matchParamsPath = (pathname, breadcrumbNameMap) => {
        const pathKey = Object.keys(breadcrumbNameMap).find(key =>
            pathToRegexp(key).test(pathname)
        );
        return breadcrumbNameMap[pathKey];
    };

    getPageTitle = (pathname, breadcrumbNameMap) => {
        const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

        if (!currRouterData) {
            return 'SUNMI STORE';
        }
        const pageName = formatMessage({
            id: currRouterData.locale || currRouterData.name,
            defaultMessage: currRouterData.name,
        });

        return `${pageName} - SUNMI STORE`;
    };

    render() {
        const { bgClass } = this.state;
        const {
            location: { pathname },
            children,
            breadcrumbNameMap,
        } = this.props;

        return (
            <>
                <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
                    <div className={`${styles.wrapper} ${styles[bgClass]}`}>
                        <div className={styles['header-bar']}>
                            <div className={styles.logo} />
                            {/* <div className={styles['lang-wrapper']}> */}
                            {/* <SelectLang className={styles['drop-down']} /> */}
                            {/* </div> */}
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.content}>{children}</div>
                        <div className={styles['footer-bar']}>
                            <span>{formatMessage({ id: 'layout.user.footer' })}</span>
                        </div>
                    </div>
                </DocumentTitle>
            </>
        );
    }
}

export default connect(({ menu }) => ({
    breadcrumbNameMap: menu.breadcrumbNameMap,
}))(SunmiLayout);
