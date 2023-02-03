interface Curry<T extends any[], R> {
  (...args: T): R
}

export function delay<T extends any[], R>(fun: Curry<T, R>, timer = 1000): Curry<T, R> {
  return (...args: T) => {
    const data = fun(...args);
    if (data instanceof Promise) {
      return new Promise((resolve, reject) => {
        let time: any = setTimeout(() => {
          data.then(resolve).catch(reject);
          clearTimeout(time);
          time = undefined;
        }, timer);
      }) as unknown as R;
    }
    return data;
  };
}