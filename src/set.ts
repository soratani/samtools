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

