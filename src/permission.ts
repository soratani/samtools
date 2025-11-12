import { isString } from "./type";
import { get } from "./tools";

export type UserPermission = Record<string, (number | string)[]>;

type Auth = {
    resource: string | RegExp;
    actions?: (number | string)[];
};

export interface AuthParams {
    requiredPermissions?: Array<Auth>;
    oneOfPerm?: boolean;
}

const judge = (actions: (number | string)[], perm: (number | string)[]) => {
    if (!perm || !perm.length) {
        return false;
    }
    const isStr = perm.every((item) => isString(item));
    if (isStr && perm.join('') === '*') {
        return true;
    }
    return actions.every((action) => perm.includes(action));
};

const auth = (params: Auth, userPermission: UserPermission) => {
    const { resource, actions = [] } = params;
    if (resource instanceof RegExp) {
        const permKeys = Object.keys(userPermission);
        const matchPermissions = permKeys.filter((item) => item.match(resource));
        if (!matchPermissions.length) {
            return false;
        }
        return matchPermissions.every((key) => {
            const perm = userPermission[key];
            return judge(actions, perm);
        });
    }

    const perm = userPermission[resource];
    return judge(actions, perm);
};

function reversePermissionBinary(code: string) {
    return code.split('').reverse().join('');
}

function binary(num: number) {
    return num.toString(2);
}

export function filterPermission(code: number, permissions: number[]) {
    const bina = binary(code);
    function diff(target: number, source: number) {
        return target && target == source || !source;
    }
    function equality(target: string, source: string) {
        const tar = reversePermissionBinary(target).split("");
        const sou = reversePermissionBinary(source).split("");
        return sou.every((i, index) => diff(Number(tar[index]), Number(i)));
    }
    return permissions.filter((i) => equality(bina, binary(i)));
}

/**
 * 合并权限
 * @param nums
 */
export function perm(...nums:number[]) {
    return nums.reduce((pre, n) => pre | n, 0);
}

/**
 * 计算权限
 * @param resources 
 * @param permissions 
 * @returns 
 */
export function permissionCompute(resources: Record<string, number>, permissions: Record<string, number>): UserPermission {
    const permValues = Object.values(resources);
    const resources_maps = Object.entries(resources);
    const permissions_maps = Object.entries(permissions);
    return permissions_maps.reduce((pre, item) => {
        const [key, code] = item;
        pre[key] = filterPermission(code, permValues).map((i) => {
            const item = resources_maps.find(o => o[1] === i);
            const perm = get(item, '0');
            return perm;
        }).filter(Boolean);
        return pre;
    }, {});
}

/**
 * 计算当前用户的权限
 * @param permissions 
 * @param allPermissions 
 * @returns 
 */
export function computeUserPermission(permissions: Record<string, number>, allPermissions: Record<string, number[]>): UserPermission {
    const allKeys = Object.keys(allPermissions);
    const keys = Object.keys(permissions);
    return allKeys.reduce((pre, key) => {
        if (keys.includes(key)) {
            pre[key] = filterPermission(permissions[key], allPermissions[key]);
        }
        return pre;
    }, {})
}

export function permission(params: AuthParams, userPermission: UserPermission) {
    const { requiredPermissions, oneOfPerm } = params;
    if (Array.isArray(requiredPermissions) && requiredPermissions.length) {
        let count = 0;
        for (const rp of requiredPermissions) {
            if (auth(rp, userPermission)) {
                count++;
            }
        }
        return oneOfPerm ? count > 0 : count === requiredPermissions.length;
    }
    return true;
};
