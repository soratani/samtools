import {make, parseQuery, parseUrl, mergeQueryToURL} from '../query';

describe('query测试', () => {
    it('make函数根据对象生成query字符串',() => {
        const data = { a:1, b:'c', d: 2 };
        const query = make(data);
        expect(query).toEqual('?a=1&b=c&d=2')
    })
    it('parseQuery函数解析query字符串', () => {
        const data = 'http://www.baidu.com?a=1&b=c&d=2';
        const query = parseQuery(data);
        expect(query).toStrictEqual({ a:1, b:'c', d: 2 })
    })
    it('parseUrl函数解析query字符串', () => {
        const data = 'http://www.baidu.com?a=1&b=c&d=2';
        const url = parseUrl(data);
        expect(url).toStrictEqual("http://www.baidu.com")
    })
    it('mergeQueryToURL函数向url中添加参数', () => {
        const data = {a:1, b:'c', d: 2};
        const url = mergeQueryToURL('http://www.baidu.com?asd=asd&c=1323', data);
        expect(url).toEqual("http://www.baidu.com?asd=asd&c=1323&a=1&b=c&d=2")
    })
})