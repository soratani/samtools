import { cloneDeep, every, filter, find, isEqual, isEqualWith, reduce } from "lodash";
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

export function parseTemplateToOptions(source: string, template: string, opts?: { keepBraces?: boolean }) {
    const keepBraces = !!opts?.keepBraces;

    if (!template) return { text: '', items: [] };

    // 规范化运算符（支持 Unicode minus）
    const normalizeOp = (ch: string) => (ch === '−' ? '-' : ch);

    // 清理 label 片段：去掉中英文括号并 trim
    const cleanLabel = (s: string) => (s ?? '').replace(/[()（）]/g, '').trim();

    // 1) 提取 template 中所有 ${...} 内部内容（按出现顺序）
    const valueTokens: string[] = [];
    const valRe = /\$\{\s*([^}]*)\s*\}/g;
    let m: RegExpExecArray | null;
    while ((m = valRe.exec(template)) !== null) {
        valueTokens.push(m[1] as any);
    }

    // 2) 从 source 全局按运算符分割出片段（保持顺序）
    //    注意：这里简单按 + - × / 这些符号切分，能对应 value 中的 ${...} 出现顺序
    const labelSegmentsRaw = source ? source.split(/[+\-−*/]/) : [];
    const labelSegments = labelSegmentsRaw.map(s => cleanLabel(s));

    // 4) 构造 items（按 valueTokens 的数量逐项对应 labelSegments）
    const len = Math.max(valueTokens.length, labelSegments.length);
    const items: any[] = [];
    for (let i = 0; i < len; i++) {
        const raw = valueTokens[i] ?? '';
        const label = labelSegments[i] ?? '';
        const value = Number(raw);
        items.push({ label, value: isNaN(value) ? null : value });
    }

    // 5) 用 replacer 逐个替换 template 中的 ${...}：
    //    如果 token 是 null/'' -> 用对应 label (或 `${label}`) 替换；否则保留原样
    let index = 0;
    const text = template.replace(/\$\{\s*([^}]*)\s*\}/g, (match, inner) => {
        const token = inner == null ? '' : String(inner).trim();
        const mappedLabel = items[index] ? (items[index] as any).label : '';
        index += 1;
        if (token === '' || token.toLowerCase() === 'null') {
            return keepBraces ? `\${${mappedLabel}}` : mappedLabel;
        }
        return match; // 保留原来的 ${...}
    });

    return { text, items };
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


export function replaceTemplateFromOptions(template: string, options: { label: string, value: any }[]) {
    return reduce(options, (tpl, opt) => {
        const has = template.includes('${' + opt.value + '}');
        if (has) tpl;
        return tpl.replace('${' + opt.label + '}', '${' + opt.value + '}');
    }, cloneDeep(template));
}

export function mergeTemplateFromOptions(template: string, options: { label: string, value: any }[]) {
    return reduce(options, (tpl, opt) => {
        const has = template.includes('${' + opt.value + '}');
        if (has) return tpl.replace('${' + opt.value + '}', opt.label);
        return tpl;
    }, cloneDeep(template));
}


export function parseOperatorsTokens(expr: string | null | undefined): string[] {
    if (expr == null) return [];
    return expr
        .split(/[+\-*/()]/)
        .map((s) => s.trim())
        .filter(Boolean);
}