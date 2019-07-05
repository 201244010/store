module.exports = {
	parser: 'babel-eslint',
	extends: ['airbnb', 'prettier', 'plugin:compat/recommended'],
	env: {
		browser: true,
		node: true,
		es6: true,
		mocha: true,
		jest: true,
		jasmine: true,
	},
	globals: {
		APP_TYPE: true,
		page: true,
	},
	rules: {
		'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
		'react/jsx-wrap-multilines': 0,
		'react/prop-types': 0,
		'react/forbid-prop-types': 0,
		'react/jsx-one-expression-per-line': 0,
		'react/no-array-index-key': 0,
		'jsx-a11y/mouse-events-have-key-events': 0,
		'import/prefer-default-export': 0,
		'no-param-reassign': 0,
		'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
		'jsx-a11y/no-noninteractive-element-interactions': 0,
		'jsx-a11y/click-events-have-key-events': 0,
		'jsx-a11y/no-static-element-interactions': 0,
		'jsx-a11y/anchor-is-valid': 0,
		'jsx-a11y/alt-text': 0,
		'linebreak-style': 0,
		'no-script-url': 0,
		'no-return-assign': 0,
		'array-callback-return': 0,
		'global-require': 0,
		'import/no-dynamic-require': 0,
		'no-plusplus': 0,
		'no-undef': 0,
		'import/no-mutable-exports': 0,
		'camelcase': 1,
		'react/jsx-indent': ['error', 'tab', { 'props': 4 }],
		'react/jsx-indent-props': ['error', 'tab'],
		'react/no-find-dom-node': 0,
		'react/prefer-stateless-function': 0,
		'semi': ['error', 'always'],
		'no-underscore-dangle': 0,
		'import/no-extraneous-dependencies': 0,
		'quotes': [2, 'single'],
		'indent': ['error', 'tab', {
			'SwitchCase': 1
		}]
	},
	settings: {
		polyfills: ['fetch', 'promises', 'url'],
	},
};
