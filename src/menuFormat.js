import routerConfig from '../config/router';

const formatRouter = routers => {
	let result = {};

	routers.forEach(router => {
		const { id, path, routes } = router;

		if (id) {
			result[id] = path;
		}

		if (routes && routes.length > 0) {
			const childRoutes = formatRouter(routes);
			result = {
				...result,
				...childRoutes,
			};
		}
	});

	return result;
};

export default formatRouter(routerConfig);
