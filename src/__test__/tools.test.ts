import { parseOperatorsTokens } from '../tools';

describe('工具方法测试', () => {
    it('计算公式拆分算子', () => {
        const expr = parseOperatorsTokens('( 总体物品总售价1- 总功能测试修复数量)/ ( 物品总售价 - 修复物品测试计算) + 总测试计算公式新增');
        expect(expr).toEqual(['总体物品总售价1', '总功能测试修复数量', '物品总售价', '修复物品测试计算', '总测试计算公式新增']);
    })
});