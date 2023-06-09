
class Node<V = any> {
    constructor(value: V) {
        this.value = value;
    }
    value: V;
    next?: Node;
}

export default class LinkNode<V = any> {
    constructor(value: V) {
        this.head = new Node(value);
    }
    head: Node<V>;

    /**
     * 插入
     * @param value 值
     * @param head 是否头插入
     */
    insert(value: V, head = false) {
        const node = new Node(value);
        if(head) {
            node.next = this.head;
            this.head = node;
            return this.head;
        } else {
            let next = this.head.next;
            if(!next) {
                this.head.next = node;
                return this.head;
            }
            while(next.next) {
                next = next.next;
            }
            next.next = node;
        }
        return this.head;
    }
    /**
     * 指定节点插入
     * @param value 
     * @param callback 
     * @param head 
     * @returns 
     */
    nodeInsert(value:V, callback: (v: V) => boolean, head = false) {
        const node = new Node(value);
        let headNode = this.head;
        let current = headNode.next;
        let status = callback(headNode.value);
        if(head) {
            if(status) {
                node.next = headNode;
                this.head = node;
                return this.head;
            }
            while(!status && current) {
                status = callback(current.value);
                if(!status) {
                    headNode = current;
                    current = current.next;
                }
            }
            if(status && current) {
                node.next = current;
                headNode.next = node;
            }  
            return this.head;
        } else {
            if(status) {
                node.next = current;
                headNode.next = node;
                return this.head;
            }
            while(!status && current) {
                status = callback(current.value);
                if(!status) {
                    headNode = current;
                    current = current.next;
                }
            }
            if(status && current) {
                headNode = current;
                current = current.next;
                headNode.next = node;
                node.next = current;
            }  
            return this.head;
        }
    }
    remove(callback:(v:V) => boolean) {
        let head = this.head;
        let current = head.next;
        let status = callback(head.value);
        if(status) {
            this.head = this.head.next;
            return this.head;
        }
        while(!status && current) {
            status = callback(current.value);
            if(!status) {
                head = current;
                current = current.next;
            }
        }
        if(status && current) {
            current = current.next;
            head.next = current;
        }
        return this.head;
    }
    get(callback: (value: V) => boolean) {
        let node = this.head;
        let status = false
        while(!status && node) {
            status = callback(node.value);
            if(!status) {
                node = node.next;
            }
        }
        if(status && node) {
            return node;
        }
        return null;
    }
}