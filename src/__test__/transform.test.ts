import { isNotEmpty } from '../transform';

describe("转换函数测试", () => {
  it("去除空值", () => {
    const data = {
        deadline:undefined,
        declare_year: undefined,
        rank_ids: ['e490b849-5de8-4563-9faf-15c64b628d5c'],
        release_date: undefined,
    };
    expect(isNotEmpty(data)).toEqual({ rank_ids: [ 'e490b849-5de8-4563-9faf-15c64b628d5c' ] });
  });
});
