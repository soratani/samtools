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

export function parseTemplateToOptions(source: string, template: string) {
    if (!template) return { text: template || '', options: [] };

    // helper: normalize minus and clean label piece
    const normalizeOp = (ch: any) => (ch === '−' ? '-' : ch);
    const cleanLabelPiece = (s: any) => (s || '').replace(/[()（）]/g, '').trim();

    // 1) 提取 value tokens（${...} 内部）
    const valueTokens: any[] = [];
    const valueRe = /\$\{\s*([^}]*)\s*\}/g;
    let m;
    while ((m = valueRe.exec(template)) !== null) {
        valueTokens.push(m[1] as any); // 例如 '8718' 或 'null'
    }

    // 2) 提取 label 的分段（按 + 或 - 分割）
    // 注意：split 会把括号内项也拆开成对应顺序（与 value tokens 顺序一致）
    const rawLabelPieces = source
        ? source.split(/\s*[+\-−]\s*/).map((s) => cleanLabelPiece(s)).filter(Boolean)
        : [];

    // 3) 提取运算符序列（优先用 label 中的运算符）
    const opsFromLabel = source ? Array.from(source.matchAll(/[+\-−]/g)).map(x => normalizeOp(x[0])) : [];
    const opsFromValue = template ? Array.from(template.matchAll(/[+\-−]/g)).map(x => normalizeOp(x[0])) : [];
    const ops = opsFromLabel.length ? opsFromLabel : opsFromValue;

    // 4) 解析 token -> number|null
    const parseToken = (tok: any) => {
        if (tok == null) return null;
        const t = String(tok).trim();
        if (t === '' || t.toLowerCase() === 'null') return null;
        const n = Number(t);
        return Number.isFinite(n) ? n : null;
    };

    // 5) 构建 options（按 value tokens 数量）
    const len = Math.max(valueTokens.length, rawLabelPieces.length);
    const options: any = [];
    for (let i = 0; i < len; i++) {
        const label = rawLabelPieces[i] ?? '';
        const raw = valueTokens[i] ?? '';
        const value = parseToken(raw);
        options.push({ label, raw, value });
    }

    // 6) 用 replace 逐个替换 template 中的 ${...}：如果 token 内容为 null/'' 则替换为对应 label（或 `${label}`）
    let idx = 0;
    const text = template.replace(/\$\{\s*([^}]*)\s*\}/g, (match: any, inner: any) => {
        const token = inner == null ? '' : String(inner).trim();
        const labelForThis = options[idx] ? (options[idx].label || '') : '';
        idx += 1;

        if (token === '' || token.toLowerCase() === 'null') {
            return '${' + labelForThis + '}'; // 如果需要保留花括号，可以改为 `${labelForThis}`
        }
        // 否则保留原来的 ${...}（或者你也可以返回数字）
        return match;
    });

    return {
        text,
        options,
    };
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


export function replaceTemplateFromOptions(template: string, options: {label: string, value: any}[]) {
    return reduce(options, (tpl, opt) => {
        const has = template.includes('${' + opt.value + '}');
        if (has) tpl;
        return tpl.replace('${' + opt.label + '}', '${' + opt.value + '}');
    }, cloneDeep(template));
}