/**
 * utils.js 测试用例
 */

import { isUrl } from '../src/utils/utils';

test('isUrl function test - http url: ', () => expect(isUrl('http://www.baidu.com')).toBe(true));
test('isUrl function test - https url: ', () => expect(isUrl('https://www.baidu.com')).toBe(true));
