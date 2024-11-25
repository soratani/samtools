/**
 * { data-analysis:  ['read', 'write'] }
 */

import { every, filter, find, get, map, reduce } from "lodash";

export type UserPermission = Record<string, number[]>;

type Auth = {
    resource: string | RegExp;
    actions?: number[];
};

export interface AuthParams {
    requiredPermissions?: Array<Auth>;
    oneOfPerm?: boolean;
}

const judge = (actions: number[], perm: number[]) => {
    if (!perm || !perm.length) {
        return false;
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
        const tar = reversePermissionBinary(target);
        const sou = reversePermissionBinary(source);
        return every(sou, (i, index) => diff(Number(tar[index]), Number(i)));
    }
    return filter(permissions, (i) => equality(bina, binary(i)));
}

/**
 * 合并权限
 * @param nums
 */
export function perm(...nums:number[]) {
    return reduce(nums, (pre, n) => pre | n, 0);
}

/**
 * 计算权限
 * @param resources 
 * @param permissions 
 * @returns 
 */
export function permissionCompute(resources: Record<string, number>, permissions: Record<string, number>) {
    const permValues = Object.values(resources);
    const resources_maps = Object.entries(resources);
    const permissions_maps = Object.entries(permissions);
    return reduce<[string, number], Record<string, string[]>>(permissions_maps, (pre, item) => {
        const [key, code] = item;
        pre[key] = map(filterPermission(code, permValues), (i) => {
            const item = find(resources_maps, o => o[1] === i);
            const perm = get(item, '0');
            return perm;
        }).filter(Boolean);
        return pre;
    }, {});
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
