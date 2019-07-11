module.exports = {
	// testURL: 'http://localhost:8000',
	// preset: 'jest-puppeteer',
	moduleFileExtensions: ['js', '/index.js'],
	testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
	moduleDirectories:['node_modules'],
	moduleNameMapper: {
		'^umi/locale$': '<rootDir>/node_modules/umi-plugin-locale',
		'^umi-utils$': '<rootDir>/node_modules/umi/lib/utils',
		'^umi(.*)$': '<rootDir>/node_modules/umi/lib$1',
		'@/(.*)$': '<rootDir>/src/$1',
	},
};
