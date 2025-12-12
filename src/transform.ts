import { cloneDeep, get, ListToTreeSchema, TreeChildren } from '.';
import { isArray, isEmpty, isNull, isNum, isObject, isUndefined } from './type';

function schemaToObj(obj: any, schema?: ListToTreeSchema) {
  if (!isObject(obj) || !schema || !isObject(schema) || isEmpty(schema)) return obj;
  const keys = Object.entries(schema);
  return Object.entries(obj).reduce((a: any, b: [string, any]) => {
    const [key, value] = b;
    const sch = keys.find((k) => k[0] === key);
    if (isArray(sch) && !!sch && !!sch[1]) {
      a[sch[1]] = value;
    }
    return a;
  }, {});
}

export function listToTree<P = any, I = string, PI = string>(
  list: P[],
  id: I,
  parentId: PI,
  value: any,
  schema?: ListToTreeSchema,
): TreeChildren<P>[] {
  if (!list || !list.length) return [];
  const root = list.filter((l: any) => {
    if (!value) return !l[parentId];
    return l[parentId] == value;
  });
  const childrens = list.filter((l: any) => l[parentId] !== value);
  return root.map((r: any) => {
    return {
      ...schemaToObj(r, schema),
      children: listToTree(childrens, id, parentId, r[id], schema)
    }
  })
}

export function enumToList<K = number, V = string>(params: any): [K, V][] {
  if (isEmpty(params)) return [];
  const list: [K, V][] = [];
  for (const key in params) {
    if (isNum(params[key])) list.push([params[key] as any, key as any]);
  }
  return list;
}

export function enumToOptions(params: any = {}) {
  return Object.entries(params).reduce((a: { label: string, value: any }[], b) => {
    const num = Number(b[0]);
    if (!isNum(num)) return a.concat([{ label: b[0], value: b[1] }]);
    return a;
  }, [])
}

export function isNotEmpty(data: any) {
  if(isEmpty(data)) return data;
  if(isObject(data)) {
    return Object.keys(data).reduce((pre, key) => {
      if (isUndefined(data[key]) || isNull(data[key])) return pre;
      if(isObject(data[key]) || isArray(data[key])) {
        pre[key] = isNotEmpty(data[key]);
      } else if (!isEmpty(data[key])) {
        pre[key] = data[key];
      }
      return pre;
    }, {});
  }
  if (isArray(data)) {
    return data.map((item) => {
      if (isObject(item) || isArray(item)) return isNotEmpty(item);
      return item;
    })
  }
  return data;
}

export function conversMenusPath<D = any, P = string, C = string>(data: D[], key: P, child: C, prefix?: string) {
  if (!data || !data.length) return data;
  return data.map((item: any) => {
    const clone = cloneDeep(item);
    const children = get(clone, child as string, []);
    const mergePath = [prefix, item[key]].filter(Boolean).join('/')
    const path = mergePath.split('/').filter(Boolean).join('/');
    clone[key] = path.startsWith('/') ? path : `/${path}`;
    if (children.length) {
      clone[child] = conversMenusPath(children, key, child, clone[key]);
    }
    return clone;
  })
}