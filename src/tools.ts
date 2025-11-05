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

function escapeHtml(s: string) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * 精确匹配数组中的项并在文本中高亮（只匹配完整项，不匹配项的子串）。
 * 对中文项使用“非汉字/非单词字符”作为边界判断，保证如“物品总售价”不会匹配到“总体物品总售价”的中间部分。
 *
 * 返回值为 HTML 字符串，匹配部分被包裹为 `<tag class="className">...</tag>`，其余部分做 HTML 转义。
 */
export function highlightMatchesToHtml(
    text: string | null | undefined,
    terms: string[] | null | undefined,
    options?: { tag?: string; className?: string }
): string {
    if (text == null) return '';
    const tlist = (terms || []).filter(Boolean);
    if (!tlist.length) return escapeHtml(text);

    const tag = options?.tag || 'mark';
    const className = options?.className || 'samtools-highlight';

    // 去重并按长度降序，优先匹配长项
    const unique = Array.from(new Set(tlist)).sort((a, b) => b.length - a.length);
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const alt = unique.map(esc).join('|');

    // 我们使用前后边界为 非汉字或非单词字符 的模式来保证精确匹配
    // 捕获前缀 (可能为空) 以及目标项以便在重建字符串时保留前缀
    const re = new RegExp(`(^|[^\\p{Script=Han}\\w])(${alt})(?=$|[^\\p{Script=Han}\\w])`, 'gu');

    let lastIndex = 0;
    let out = '';
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        const idx = m.index;
        const prefix = m[1] || '';
        const matched = m[2];
        // append non-matched chunk
        if (idx > lastIndex) out += escapeHtml(text.slice(lastIndex, idx));
        // append prefix (可能是一个符号或空字符串)
        out += escapeHtml(prefix);
        // append highlighted match
        out += `<${tag} class="${escapeHtml(className)}">${escapeHtml(matched)}</${tag}>`;
        lastIndex = idx + prefix.length + matched.length;
    }
    if (lastIndex < text.length) out += escapeHtml(text.slice(lastIndex));
    return out;
}


export function insertBetweenImmutable<D = any>(arr: D[], filler: (index: number) => D) {
    const n = arr.length;
    if (n === 0) return [];
    if (n === 1) return [arr[0]]; // 无“中间”可以插入

    const out: D[] = [];
    for (let i = 0; i < n; i++) {
        out.push(arr[i]);
        if (i !== n - 1) out.push(filler(i));
    }
    return out;
}

export function interchangeById<T extends Record<string, any> = any>(
    arr: T[] | (string | number)[],
    idA: string | number,
    idB: string | number,
    idKey = 'id',
): T[] | (string | number)[] {
    // 处理简单值数组（string/number）和对象数组
    const isPrimitive = typeof arr[0] !== 'object' || arr[0] === null;

    const findIndex = (id: string | number) =>
        isPrimitive
            ? (arr as (string | number)[]).indexOf(id)
            : (arr as T[]).findIndex((x) => x[idKey] === id);

    const i = findIndex(idA);
    const j = findIndex(idB);
    if (i === -1 || j === -1 || i === j) return arr.slice(); // 返回浅拷贝（或可直接 return arr）

    const copy = arr.slice();
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
    return copy;
}