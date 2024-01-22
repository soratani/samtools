import { get, pick, omit } from '../database';

describe('数据操作', () => {
    it('get函数获取对象数据', () => {
        const object = { a: 1, b: { c: 1 }, d: [0,1,2,3] };
        const data = get(object, 'a', [1]);
        expect(data).toEqual(1);
    });
    it('get函数默认值', () => {
        const object = { a: 1, b: { c: 1 }, d: [0,1,2,3] };
        const data = get(object, 'a.c', [1]);
        expect(data).toStrictEqual([1]);
    });
    it('get函数无key情况', () => {
        const object = { a: 1, b: { c: 1 }, d: [0,1,2,3] };
        const data = get(object, '', [1]);
        expect(data).toStrictEqual([1]);
    });
    it('pick函数测试', () => {
        const object = { a: 1, b: 2, c: 3, d: 4, e: 5 };
        const item = pick(object, ['a', 'b', 'c']);
        expect(item).toStrictEqual({ a:1, b: 2, c:3 });
    });
    it('omit函数测试', () => {
        const object = { a: 1, b: 2, c: 3, d: 4, e: 5 };
        const item = omit(object, ['a', 'b', 'c']);
        expect(item).toStrictEqual({ d: 4, e: 5 });
    });
})