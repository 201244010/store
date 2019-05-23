import React from 'react';
import NavLink from 'umi/navlink';
import { formatMessage } from 'umi/locale';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import * as styles from './index.less';

const formatBreadcrumbs = (breadcrumbs, prefix = 'menu') =>
	breadcrumbs
		.slice(1)
		.map(breadcrumb => {
			const formattedBread = { ...breadcrumb };
			const {
				match: { path },
			} = breadcrumb;
			const menuId = breadcrumb.key.slice(1).replace(/\//g, '.');
			const formattedPath = path.slice(1).replace(/\//g, '.');
			const pathName = formatMessage({ id: `${prefix}.${menuId}` });

			formattedBread.pathName = pathName === `${prefix}.${formattedPath}` ? null : pathName;
			return formattedBread;
		})
		.filter(breadcrumb => !!breadcrumb.pathName);

const Breadcrumbs = ({ breadcrumbs }) => {
	const formattedBreadcrumbs = formatBreadcrumbs(breadcrumbs);
	const len = formattedBreadcrumbs.length;
	return (
		<div className={styles['bread-wrapper']}>
			{formattedBreadcrumbs.map(({ match, pathName }, index) => (
				<span key={match.url} className={index === len - 1 ? styles['bread-current'] : ''}>
					<NavLink to={match.url}>{pathName}</NavLink>
					{index < len - 1 && <i className={styles['bread-slash']}>/</i>}
				</span>
			))}
		</div>
	);
};

export default withBreadcrumbs()(Breadcrumbs);
