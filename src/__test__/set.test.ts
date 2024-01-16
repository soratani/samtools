import { unrepetition, intersection, union, difference } from '../set';


describe('集合测试', () => {
    it('字符串元素去重', () => {
        const array = ['a', 'b', 'c', 'd', 'a', 'a', 'b'];
        const newArray = unrepetition(array);
        expect(newArray).toStrictEqual(['a', 'b', 'c', 'd'])
    });
    it('数字元素去重', () => {
        const array = [1, 2, 3, 4, 5, 6, 7, 8, 9,1,2,10];
        const newArray = unrepetition(array);
        expect(newArray).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    });
    it('对象去重', () => {
        const array = [{ id: 1, name: 'book' }, { id: 2, name: 'book2' }, { id: 1, name: 'book3' }]
        const newArray = unrepetition(array, 'id');
        expect(newArray).toStrictEqual([{ id: 1, name: 'book' }, { id: 2, name: 'book2' }])
    });
    it('交集', () => {
        const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9,1,2,10];
        const array2 = [1, 2, 3, 4, 5,1,2,10, 11, 12,13];
        const newArray = intersection(array1, array2);
        expect(newArray).toStrictEqual([1, 2, 3, 4, 5, 10])
    });
    it('并集', () => {
        const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9,1,2,10];
        const array2 = [1, 2, 3, 4, 5,1,2,10, 11, 12,13];
        const newArray = union(array1, array2);
        expect(newArray).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    });
    it('差集', () => {
        const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9,1,2,10];
        const array2 = [1, 2, 3, 4, 5,1,2,10, 11, 12,13];
        const newArray = difference(array1, array2);
        expect(newArray).toStrictEqual([6, 7, 8, 9, 11, 12, 13]);
    });
});