import { Link, LinkNode } from "../link_node";

describe('单向链表', () => {
    const link = new Link(1, 1);
    it('单向链表尾插入', () => {
        link.insert(new LinkNode(2, 2));
        const node = link.get(2);
        expect(node?.next).toBe(undefined);
    });
    it('单项链表头插入', () => {
        link.insert(new LinkNode(3, 3), true);
        const node = link.get(3);
        expect(node?.next?.value).toBe(1);
    })
    it('单项链表删除', () => {
        link.remove(2);
        const node = link.get(2);
        expect(node).toBe(null);
    });
    it('单项链表指定节点插入', () => {
        link.nodeInsert(3,new LinkNode(6, 6));
        const node = link.get(3);
        expect(node?.next?.value).toBe(6);
    })
    it('单项链表指定节点头部插入', () => {
        link.nodeInsert(6, new LinkNode(7, 7), true);
        const node = link.get(7);
        expect(node?.next?.value).toBe(6);
    })
})