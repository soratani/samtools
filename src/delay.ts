import { isPromise } from "./type";

interface Curry<T extends any[], R> {
  (...args: T): R | Promise<R>
}

export function delay<T extends any[], R>(fun: Curry<T, R>, timer = 1000): Curry<T, R> {
  return (...args: T) => {
    const task = new Promise<R>((resolve, reject) => {
      let time: any = setTimeout(() => {
        const data = fun(...args);
        if (isPromise(data)) {
          data.then(resolve).catch(reject);
        } else {
          resolve(data);
        }
        clearTimeout(time);
        time = undefined;
      }, timer);
    }) as unknown as R;
    return task;
  };
}