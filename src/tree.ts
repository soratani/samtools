import { cloneDeep, get, isArray, omit } from "lodash";

export function findNodeFormKey<D = any>(key: string, nodes: D[], id: string) {
  if (!id) return undefined;
  const tree = cloneDeep(nodes);
  const queue = [...tree];

  while (queue.length > 0) {
    const node = queue.shift() as D;
    const children = get(node, 'children', []) as D[];
    if (node[key] === id) {
      return node;
    }
    if (children.length > 0) {
      queue.push(...children);
    }
  }
  return undefined;
}

export function updateNodeFormKey<D = any>(key: string, nodes: D[], id: string, value: any) {
  const tree = cloneDeep(nodes);
  const queue = [...tree];
  while (queue.length > 0) {
    const node = queue.shift() as D;
    const children = get(node, 'children', []) as D[];
    if (node[key] === id) {
      Object.assign(node as any, value);
      return tree;
    }
    if (children.length > 0) {
      queue.push(...children);
    }
  }
  return null;
}

export function deleteNodeFormKey<D = any>(key: string, nodes: D[], id: string) {
  const tree = cloneDeep(nodes);
  const queue = [...tree];
  while (queue.length > 0) {
    const node = queue.shift() as any;
    if (node[key] === id) {
      return [];
    }
    if (isArray(node.children)) {
      const newChildren: any[] = [];
      for (let child of node.children) {
        const result = deleteNodeFormKey(key, [child], id);
        if (result.length) {
          newChildren.push(...result);
        }
      }
      node.children = newChildren;
    }
    if (isArray(node.children)) {
      queue.push(...node.children);
    }
  }
  return tree;
}

export function toList<D = any>(nodes: D[]) {
  const tree = cloneDeep(nodes);
  const result: any[] = [];
  const queue = [...tree];
  while (queue.length > 0) {
    const node = queue.shift() as D;
    const children = get(node, 'children', []) as D[];
    result.push(omit(node as any, 'children'));
    if (children.length) {
      queue.push(...children);
    }
  }
  return result;
}

export function slice<T extends Record<string, any>>(tree: T[] | T, level: number, childrenKey = 'children',) {
  if (level < 1) return undefined;

  // 使用 while 实现广度优先层级裁剪
  const process = (nodes: T[], maxLevel: number): T[] => {
    let currentLevel = 1;
    let queue = nodes.map(node => ({ ...node }));
    let result = queue;

    while (currentLevel < maxLevel) {
      let nextLevelNodes: T[] = [];
      for (let node of queue) {
        const n = node as Record<string, any>;
        if (Array.isArray(n[childrenKey])) {
          // 复制子节点
          n[childrenKey] = n[childrenKey].map((child: T) => ({ ...child }));
          nextLevelNodes.push(...n[childrenKey]);
        } else {
          delete n[childrenKey];
        }
      }
      queue = nextLevelNodes;
      currentLevel++;
    }
    // 超出层级的 children 置空
    for (let node of queue) {
      const n = node as Record<string, any>;
      if (n[childrenKey]) {
        delete n[childrenKey];
      }
    }
    return result;
  };

  if (Array.isArray(tree)) {
    return process(tree, level);
  }
  return process([tree], level)[0];
}