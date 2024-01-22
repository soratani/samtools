import { get } from "./database";

type System = 'windows' | 'mac' | 'linux' | 'android' | 'ios' | 'blackberry' | 'symbian' | 'webos' | 'unknown' | 'windows-phone';

const system_map: Record<string, System> = {
    'Windows': 'windows',
    'Macintosh': 'mac',
    'Linux': 'linux',
    'Android': 'android',
    'iPhone': 'ios',
    'iPad': 'ios',
    'BlackBerry': 'blackberry',
    'BB10': 'blackberry',
    'SymbianOS': 'symbian',
    'Windows Phone': 'windows-phone',
    'webOS': 'webos',
};

function macVersion(useragent = navigator.userAgent) {
    const rule = /Mac OS X ([\d._]+)/;
    const match = get(rule.exec(useragent), '1');
    if (match) {
        const version = match.replace(/_/g, '.').replace(/\./g, ',').split(',').join('.');
        return version || 'unknown';
    }
    return 'unknown';
}

function windowsVersion(useragent = navigator.userAgent) {
    const rule = /Windows NT(\d+\.\d+)/i;
    const match = get(rule.exec(useragent), '1');
    return match || 'unknown';
}

function windowsPhoneVersion(useragent = navigator.userAgent) {
    const rule = /Windows Phone(\d+\.\d+)/i;
    const match = get(rule.exec(useragent), '1');
    return match || 'unknown';
}

function androidVersion(useragent = navigator.userAgent) {
    const rule = /Android (\d+(\.\d+)+(\.\d+)?)/i;
    const match = get(rule.exec(useragent), '1');
    return match || 'unknown';
}

function iosVersion(useragent = navigator.userAgent) {
    const rule = /CPU( iPhone)? OS (\d+)_(\d+)(?:_\d+)? like Mac OS X/i;
    const match_major = get(rule.exec(useragent), '2');
    const match_minor = get(rule.exec(useragent), '3');
    if (match_major && match_minor) {
        return `${parseInt(match_major)}.${parseInt(match_minor)}`;
    }
    return 'unknown';
}

export function system(useragent = navigator.userAgent): System {
    const rule = /(Windows|Macintosh|Android|iPhone|iPad|iPod|BlackBerry|BB10|SymbianOS|Windows Phone|webOS)/i;
    const match = get(rule.exec(useragent), '1');
    if (match && system_map[match]) return system_map[match]
    return 'unknown';
}

export function version(useragent = navigator.userAgent) {
    const sys = system(useragent);
    if (sys === 'windows') return windowsVersion(useragent);
    if (sys === 'windows-phone') return windowsPhoneVersion(useragent)
    if (sys === 'mac') return macVersion(useragent);
    if (sys === 'android') return androidVersion(useragent);
    if (sys === 'ios') return iosVersion(useragent);
    return 'unknown';
}