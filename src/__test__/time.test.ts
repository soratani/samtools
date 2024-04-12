import { Time } from "../time";

describe("时间测试", () => {
  it("正确时间", () => {
    const time1 = new Date("2024-04-12").getTime();
    const time = Time.verification("2024-04-12");
    expect(time).toEqual(time1);
  });
});
