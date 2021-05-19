import platform from 'platform';
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