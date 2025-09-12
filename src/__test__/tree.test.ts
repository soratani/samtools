import { slice, toList } from '../tree';

describe('树功能测试', () => {
    it('转数组', () => {
        const test = [{
            id: 1,
            name: '1',
            children: [{
                id: 11,
                name: '11',
                children: [{
                    id: 111,
                    name: '111'
                }]
            }, {
                id: 12,
                name: '12'
            }]
        }, {
            id: 2,
            name: '2',
            children: [{
                id: 21,
                name: '21',
            }]
        }];
        const res = [
            { id: 1, name: '1' },
            { id: 2, name: '2' },
            { id: 11, name: '11' },
            { id: 12, name: '12' },
            { id: 21, name: '21' },
            { id: 111, name: '111' }
        ];
        const list = toList(test);
        expect(list).toEqual(res);
    })

    it('slice', () => {
            const test = [{
        id: 1,
        name: '1',
        children: [{
            id: 11,
            name: '11',
            children: [{
                id: 111,
                name: '111'
            }]
        }, {
            id: 12,
            name: '12'
        }]
    }, {
        id: 2,
        name: '2',
        children: [{
            id: 21,
            name: '21',
        }]
    }];
    const newTree = slice(test, 1);
    expect(newTree).toEqual([{
        id: 1,
        name: '1',
    }, {
        id: 2,
        name: '2',
    }])
    })
})