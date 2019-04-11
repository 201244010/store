import React from 'react';
import NavLink from 'umi/navlink';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

const Breadcrumbs = ({ breadcrumbs }) => (
  <div>
    {breadcrumbs.map(({ match, breadcrumb }) => (
      <span key={match.url}>
        <NavLink to={match.url}>{breadcrumb}</NavLink>
      </span>
    ))}
  </div>
);
export default withBreadcrumbs()(Breadcrumbs);
