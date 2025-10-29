import { cloneDeep, every, filter, isEqual, isEqualWith, reduce } from "lodash";
import { isArray, isNull, isObject, isString, isUndefined, type } from "./type";

export function isDeepEqual(a: any, b: any) {
    function isEqualKeys(keys: string[], _keys: string[]) {
        const sk = keys.sort();
        const _sk = _keys.sort();
        return isEqual(sk, _sk);
    }

    return isEqualWith(a, b, (n, o) => {
        if (type(n) !== type(o)) return false;
        if (isObject(n)) {
            const nk = Object.keys(n);
            const ok = Object.keys(o);
            if (nk.length !== ok.length || !isEqualKeys(nk, ok)) return false;
            return every(nk, (key) => isDeepEqual(n[key], o[key]));
        }
        if (isArray(n)) {
            if (n.length !== o.length) return false;
            return every(n, (item, index) => {
                return isDeepEqual(item, o[index]);
            })
        }
        if (isUndefined(n)) return isUndefined(o);
        if (isNull(n)) return isNull(o);
        return isEqual(n, o);
    })
}

export function deepDelete(data: any, path: string) {
    const clone = cloneDeep(data);
    if (!path || !isString(path)) return clone;
    const paths = filter(path.split('.'), Boolean);
    if (!paths.length) return clone;
    const key = paths.shift() as string;
    if (isObject(clone)) {
        if (paths.length) {
            clone[key] = deepDelete(clone[key], paths.join('.'));
        } else {
            delete clone[key];
        }
        return clone;
    }
    if (isArray(clone)) {
        if (paths.length) {
            clone[key] = deepDelete(clone[key], paths.join('.'));
        } else {
            clone.splice(Number(key), 1);
        }
        return clone;
    }
    return clone;
}

export function insertArray(arr: any[], index: number, item: any) {
    if (!Array.isArray(arr)) return arr;
    const clone = cloneDeep(arr);
    clone.splice(index, 0, item);
    return clone;
}

export function parseTemplateToOptions(source: string, template: string): Record<string, any>[] {
    // 提取 value 中所有 ${...} 的内容（capture group）
    const valueTokens: string[] = [];
    const valueRe = /\$\{\s*([^}]*)\s*\}/g;
    let m: RegExpExecArray | null;
    while ((m = valueRe.exec(template ?? '')) !== null) {
        valueTokens.push(m[1] as any);
    }

    // 从 label 中按 + 或 - 分割出每个子 label（去除周围空白）
    const rawLabels: string[] = source
        ? source.split(/\s*[+-]\s*/).map(s => s.trim()).filter(Boolean)
        : [];

    // 清理 label：去掉中英文括号并 trim
    const cleanLabel = (s: string) => s.replace(/[()（）]/g, '').trim();
    const labels: string[] = rawLabels.map(cleanLabel);

    // 尝试从 label 中获取运算符序列（如 ['-','+']），若 label 没有则从 template 中获取
    const opsFromLabel = source ? (source.match(/[+-]/g) || []) : [];
    const opsFromValue = template ? (template.match(/[+-]/g) || []) : [];
    const ops = opsFromLabel.length ? opsFromLabel : opsFromValue;

    // 解析单个 token -> number | null
    const parseValue = (token: string | undefined): number | null => {
        if (token == null) return null;
        const t = token.trim();
        if (t === '' || t.toLowerCase() === 'null') return null;
        const n = Number(t);
        return Number.isFinite(n) ? n : null;
    };

    const len = Math.max(labels.length, valueTokens.length);
    const result: any[] = [];

    for (let i = 0; i < len; i++) {
        const label = labels[i] ?? '';
        const raw = valueTokens[i]; // 这是 ${...} 内部的原始内容
        const value = parseValue(raw);

        result.push({ label, value });
    }

    return result;
}

export function mergeTemplateToSource(source: string, template: string): string {
    if (typeof source !== 'string' || typeof template !== 'string') return template;

    // 正则：匹配 "/" 后的 "[可选左括号] 左操作数 - 右操作数 [可选右括号]"
    // 它尽量容忍两边是否有括号与空白。
    const regex = /\/\s*(?:\(\s*)?([^()\/-]+?)\s*-\s*([^()\/]+?)(?:\s*\))?/g;

    const leftOperands: any[] = [];
    let m: any;
    while ((m = regex.exec(source)) !== null) {
        // m[1] 是分母的左操作数
        leftOperands.push(m[1].trim());
    }

    if (!leftOperands.length) {
        // 没找到可替换的值，直接返回模板（或可选择抛错）
        return template;
    }

    // 替换模板中的 ${null} 或 独立的 null（按遇到的顺序）
    let idx = 0;
    const replaced = template.replace(/\$\{null\}|\bnull\b/g, (match) => {
        if (idx >= leftOperands.length) {
            // 如果替换次数超过提取的值数量，保持原样或使用最后一个值，这里选择保持原样
            return match;
        }
        const val = leftOperands[idx++];
        return val;
    });

    return replaced;
}