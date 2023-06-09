export class LinkNode<V = any> {
    constructor(id: string | number,value: V) {
        this.value = value;
        this.id = id;
    }
    id: any;
    value: V;
    next?: LinkNode;
    pre?: LinkNode;
}