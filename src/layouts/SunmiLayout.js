import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import SelectLang from '@/components/SelectLang';
import pathToRegexp from 'path-to-regexp';
import * as styles from './SunmiLayout.less';

class UserLayout extends React.PureComponent {
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
        const {
            location: { pathname },
            children,
            breadcrumbNameMap,
        } = this.props;

        return (
            <>
                <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
                    <div className={styles.wrapper}>
                        <div className={styles['header-bar']}>
                            <div className={styles.logo}>SUNMI</div>
                            <div className={styles['lang-wrapper']}>
                                <SelectLang />
                            </div>
                        </div>
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
}))(UserLayout);
