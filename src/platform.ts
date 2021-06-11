import platform from 'platform';
import { isNum } from '.';
export type System =
    "OS X" |
    "Windows" |
    "Linux" |
    "Android" |
    "Windows Server 2008 R2 / 7" |
    "Windows Server 2008 / Vista" |
    "Windows XP" |
    "Ubuntu" |
    "iOS" |
    "Windows Phone" |
    "Debian";

interface IUserAgent {
    system: System;
    version: string;
    name: string;
}

export function isMobile() {
    const info = userAgent();
    return ["iOS", "Windows Phone", "Android",].includes(info.system);
}

export function userAgent(): IUserAgent {
    return {
        system: (platform.os as any).family as System,
        version: (platform.os as any).version as string,
        name: platform.name as any
    }
}

function division(arg1: number, arg2: number | string) {
    if (!isNum(arg1) || !isNum(arg2 as number)) return "";
    let t1 = 0,
        t2 = 0,
        r1,
        r2
    try {
        t1 = arg1.toString().split('.')[1].length
    } catch (e) { }
    try {
        t2 = arg2.toString().split('.')[1].length
    } catch (e) { }
    r1 = Number(arg1.toString().replace('.', ''));
    r2 = Number(arg2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1)
}

export function transitionPxToVw(px: string, vwwidth: number) {

    if (isNum(px as any)) return '0';
    const vw = division(parseInt(px.split('px')[0]), division(vwwidth, 100));
    return `${vw}vw`;
}