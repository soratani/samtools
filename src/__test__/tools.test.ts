import { highlightMatchesToHtml, parseOperatorsTokens } from '../tools';

describe('工具方法测试', () => {
    it('计算公式拆分算子', () => {
        const expr = parseOperatorsTokens('( 总体物品总售价1- 总功能测试修复数量)/ ( 物品总售价 - 修复物品测试计算) + 总测试计算公式新增');
        expect(expr).toEqual(['总体物品总售价1', '总功能测试修复数量', '物品总售价', '修复物品测试计算', '总测试计算公式新增']);
    })
    it('计算公式算子高亮', () => {
        const html = highlightMatchesToHtml('( 总体物品总售价- 总功能测试修复数量)/ ( 物品总售价 - 修复物品测试计算) + 总测试计算公式新增', ['总体物品总售价1', '总功能测试修复数量', '物品总售价', '修复物品测试计算', '总测试计算公式新增'], {
            tag: 'span',
            className: 'highlight',
        })
        expect(html).toEqual('( 总体物品总售价- <span class="highlight">总功能测试修复数量</span>)/ ( <span class="highlight">物品总售价</span> - <span class="highlight">修复物品测试计算</span>) + <span class="highlight">总测试计算公式新增</span>')
    })
});