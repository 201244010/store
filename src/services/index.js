export function genService(fetchApi) {
	return (url, normalizeOptions = o => o) => (options) => {
		const opts = {
			method: 'POST',
			body: normalizeOptions(options)
		};

		return fetchApi(url, opts).then(response => response.json());
	};
}

