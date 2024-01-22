import { system, version } from '../platform';

describe('系统信息获取测试', () => {
    it("获取系统名", () => {
        const useAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        const info = system(useAgent);
        expect(info).toEqual('mac');
    })
    it('mac获取系统版本', () => {
        const useAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        const _version = version(useAgent);
        expect(_version).toEqual('10.15.7');
    })
    it('ios获取系统版本', () => {
        const useAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';
        const _version = version(useAgent);
        expect(_version).toEqual('16.6');
    })
    it('android获取系统版本', () => {
        const useAgent = 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36';
        const _version = version(useAgent);
        expect(_version).toEqual('8.0.0');
    })
    it('windows获取系统版本', () => {
        const useAgent = 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 550) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263';
        const _version = version(useAgent);
        console.log(_version)
        expect(_version).toEqual('unknown');
    })
})