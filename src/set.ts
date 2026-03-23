import { clamp } from "./tools";
import { isObject, isString } from "./type";

/**
 * 数组去重
 * @param array 
 * @returns 
 */
export function unrepetition<D = any>(array: D[], index?: string): D[] {
    if (isString(index)) {
        const maps = array.filter(item => isObject(item));
        if (maps.length) {
            const keys = unrepetition(maps.map(item => item[index]).filter(Boolean));
            return keys.reduce((a: D[], b: string, idx: number) => {
                const item = maps.find(item => item[index] === b) as any;
                return a.concat([item]);
            }, []);
        }
    }
    return [...new Set(array)];
}

/**
 * 交集
 * @param array1 
 * @param array2 
 * @returns 
 */
export function intersection<D = any>(array1: D[], array2: D[]) {
    const temp = [...array1].filter((a) => array2.some((b) => b === a));
    return [...new Set(temp)];
}

/**
 * 并集
 * @param array1 
 * @param array2 
 * @returns 
 */
export function union<D = any>(array1: D[], array2: D[]) {
    return [...new Set([...array1, ...array2])];
}

/**
 * 差集
 * @param array1 
 * @param array2 
 * @returns 
 */
export function difference<D = any>(array1: D[], array2: D[]) {
    const un = union(array1, array2);
    const int = intersection(array1, array2);
    return un.filter((u) => !int.some(i => i === u));
}

/**
 * 向数组指定索引插入元素
 * @param arr 要操作的数组
 * @param item 要插入的元素或元素数组
 * @param index 插入位置的索引
 * @param position 插入位置相对于索引的位置，'before' 表示在索引前插入，'after' 表示在索引后插入
 * @returns 插入元素后的新数组
 */
export function insertByIndex<T>(arr: T[], item: T | T[], index: number, position: 'before' | 'after' = 'after',) {
        const items = Array.isArray(item) ? item : [item];
    if (arr.length === 0) {
        return [...items];
    }

    const normalizedIndex = clamp(Math.trunc(index), 0, arr.length - 1);
    const insertIndex =
        position === 'before' ? normalizedIndex : normalizedIndex + 1;

    return [
        ...arr.slice(0, insertIndex),
        ...items,
        ...arr.slice(insertIndex),
    ];
}
