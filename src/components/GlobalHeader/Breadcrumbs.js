import React from 'react';
import NavLink from 'umi/navlink';
import { formatMessage } from 'umi/locale';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import * as styles from './index.less';

const formatBreadcrumbs = (breadcrumbs, menuData, prefix = 'menu') => {
	console.log(breadcrumbs);
	console.log('hei menu data: ', menuData);

	return breadcrumbs
		.slice(1)
		.map(breadcrumb => {
			const formattedBread = { ...breadcrumb };
			const {
				match: { path, url },
				key,
			} = breadcrumb;
			const menuId = key.slice(1).replace(/\//g, '.');
			const formattedPath = path.slice(1).replace(/\//g, '.');
			const pathName = formatMessage({ id: `${prefix}.${menuId}` });

			const firstLevelMenu = menuData.find(menu => menu.path === key);
			if (firstLevelMenu) {
				const { children = [] } = firstLevelMenu;
				console.log('firstLevelMenu', children);
				formattedBread.match.realPath = (children[0] || {}).path || url;
			}

			formattedBread.pathName = pathName === `${prefix}.${formattedPath}` ? null : pathName;
			return formattedBread;
		})
		.filter(breadcrumb => !!breadcrumb.pathName);
};

const Breadcrumbs = ({ breadcrumbs, menuData }) => {
	const formattedBreadcrumbs = formatBreadcrumbs(breadcrumbs, menuData);
	const len = formattedBreadcrumbs.length;
	return (
		<div className="bread-wrapper">
			{formattedBreadcrumbs.map(({ match, pathName }, index) => (
				<span key={match.url} className={index === len - 1 ? styles['bread-current'] : ''}>
					<NavLink to={match.realPath || match.url}>{pathName}</NavLink>
					{index < len - 1 && <i className={styles['bread-slash']}>/</i>}
				</span>
			))}
		</div>
	);
};

export default withBreadcrumbs()(Breadcrumbs);
