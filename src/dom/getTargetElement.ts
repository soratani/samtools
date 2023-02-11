import { isFunc } from "../type";
import { BasicTarget, TargetType, TargetValue } from "./interface";



export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) {
  if (!isBrowser) {
    return undefined;
  }

  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetValue<T>;

  if (isFunc(target)) {
    targetElement = target();
  } else {
    targetElement = target;
  }

  return targetElement;
}
