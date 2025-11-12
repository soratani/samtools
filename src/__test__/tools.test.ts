import { get, cloneDeep } from '../tools';

describe('工具方法测试', () => {
    it('get方法测试', () => {
        const target  = get({ a: { b: { c: [12,1,2,4] } } }, 'a.b.c.2', 2);
        expect(target).toEqual(2);
    })
    it('cloneDeep方法测试', () => {
        const source = { a: { b: { c: [12,1,2,4] } } };
        const target = cloneDeep(source);
        // target.a.b.c[3] = 5;
        expect(target).toEqual(source);
    })
});