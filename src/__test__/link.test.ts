import { LinkNode } from "../link_node";

describe('单向链表', () => {
    const link = new LinkNode(1);
    it('单向链表尾插入', () => {
        link.insert(2);
        const node = link.get((v) => v === 2);
        expect(node.next).toBe(undefined);
    });
    it('单项链表头插入', () => {
        link.insert(3, true);
        const node = link.get((v) => v === 3);
        expect(node.next.value).toBe(1);
    })
    it('单项链表删除', () => {
        link.remove((v) => v === 2);
        const node = link.get((v) => v === 2);
        expect(node).toBe(null);
    });
    it('单项链表指定节点插入', () => {
        link.nodeInsert(6, (v) => v === 3);
        const node = link.get((v) => v === 3);
        expect(node.next.value).toBe(6);
    })
    it('单项链表指定节点头部插入', () => {
        link.nodeInsert(7, (v) => v === 6, true);
        const node = link.get((v) => v === 7);
        expect(node.next.value).toBe(6);
    })
})