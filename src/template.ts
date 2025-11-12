import { cloneDeep } from "./tools";


function escapeHtml(s: string) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


/**
 * 从模版和原文中解析出id和label对象数组
 * @param source 
 * @param template 
 * @param opts 
 * @returns 
 */
export function parseTemplateToOptions(source: string, template: string, opts?: { keepBraces?: boolean }) {
    const keepBraces = !!opts?.keepBraces;
    if (!template) return { text: '', items: [] };
    const cleanLabel = (s: string) => (s ?? '').replace(/[()（）]/g, '').trim();
    const valueTokens: string[] = [];
    const valRe = /\$\{\s*([^}]*)\s*\}/g;
    let m: RegExpExecArray | null;
    while ((m = valRe.exec(template)) !== null) {
        valueTokens.push(m[1] as any);
    }
    const labelSegmentsRaw = source ? source.split(/[+\-−*/]/) : [];
    const labelSegments = labelSegmentsRaw.map(s => cleanLabel(s));
    const len = Math.max(valueTokens.length, labelSegments.length);
    const items: any[] = [];
    for (let i = 0; i < len; i++) {
        const raw = valueTokens[i] ?? '';
        const label = labelSegments[i] ?? '';
        const value = Number(raw);
        items.push({ label, value: isNaN(value) ? null : value });
    }
    let index = 0;
    const text = template.replace(/\$\{\s*([^}]*)\s*\}/g, (match, inner) => {
        const token = inner == null ? '' : String(inner).trim();
        const mappedLabel = items[index] ? (items[index] as any).label : '';
        index += 1;
        if (token === '' || token.toLowerCase() === 'null') {
            return keepBraces ? `\${${mappedLabel}}` : mappedLabel;
        }
        return match;
    });

    return { text, items };
}

/**
 * 合并模版和原文讲模版中未解析出来的位置替换为原文
 * @param source 
 * @param template 
 * @returns 
 */
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
    return options.reduce((tpl, opt) => {
        const has = template.includes('${' + opt.value + '}');
        if (has) tpl;
        return tpl.replace('${' + opt.label + '}', '${' + opt.value + '}');
    }, cloneDeep(template));
}

export function mergeTemplateFromOptions(template: string, options: { label: string, value: any }[]) {
    return options.reduce((tpl, opt) => {
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