import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { Icon } from 'antd';
import { connect } from 'dva';
import { GlobalFooter } from 'ant-design-pro';
import DocumentTitle from 'react-document-title';
// import SelectLang from '@/components/SelectLang';
import pathToRegexp from 'path-to-regexp';
import styles from './UserLayout.less';

const copyright = (
    <Fragment>
        Copyright <Icon type="copyright" /> {formatMessage({ id: 'layout.user.footer' })}
    </Fragment>
);

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
                    <div className={styles.container}>
                        {/* TODO 暂时隐去语言选择 */}
                        {/* <div className={styles.lang}> */}
                        {/* <SelectLang /> */}
                        {/* </div> */}
                        <div className={styles.content}>
                            <div className={styles['title-background']} />
                            {children}
                        </div>
                        <GlobalFooter copyright={copyright} />
                    </div>
                </DocumentTitle>
            </>
        );
    }
}

export default connect(({ menu }) => ({
    breadcrumbNameMap: menu.breadcrumbNameMap,
}))(UserLayout);
