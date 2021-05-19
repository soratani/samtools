export function initArray(length: number) {
    const arr: number[] = new Array(length);
    for (let index = 0; index < arr.length; index++) {
        arr[index] = index;
    }
    return arr;
}