import type { TreeItem } from './types';

type Option = {
    keyKey: string;
    childListKey: string;
    size: number;
};

type HiddenOption = {
    parentKeys: (string | number)[];
    level: number;
};

export const handleToObjData = <T>(_data: T[], opt: Option) => {
    const { keyKey, childListKey, size } = opt;

    const resData: Record<string, TreeItem<T>> = {};

    const _handleToData = (data: T[], hiddenOpt?: HiddenOption) => {
        const { level = 0, parentKeys = [] } = hiddenOpt || {};

        data.forEach((item) => {
            const _childList = (item as any)[childListKey] as T[];
            const childList = Array.isArray(_childList) ? _childList : [];
            const isLeaf = childList.length === 0;
            const key = (item as any)[keyKey] as string;

            const treeItem = {
                key,
                size,
                level,
                isLeaf,
                data: item,
                parentKeys,
            };

            resData[key] = treeItem;

            if (!isLeaf) {
                const nextHiddenOpt = { level: level + 1, parentKeys: [...parentKeys, treeItem.key] };
                _handleToData(childList, nextHiddenOpt);
            }
        });
    };

    _handleToData(_data);

    return resData;
};

type Option2 = {
    keyKey: string;
    childListKey: string;
    visibles?: Record<string, boolean>;
    size: number;
};

export const handleToListData = <T>(_data: T[], opt: Option2) => {
    const { keyKey, childListKey, visibles, size } = opt;

    const resData: TreeItem<T>[] = [];
    const sizeList: number[] = [];

    const _handleToData = (data: T[], hiddenOpt?: HiddenOption) => {
        const { level = 0, parentKeys = [] } = hiddenOpt || {};

        data.forEach((item) => {
            const _childList = (item as any)[childListKey] as T[];
            const childList = Array.isArray(_childList) ? _childList : [];
            const isLeaf = childList.length === 0;
            const key = (item as any)[keyKey] as string;
            const visible = !visibles || !!visibles[key];

            const treeItem = {
                key,
                size,
                level,
                isLeaf,
                data: item,
                parentKeys,
            };

            resData.push(treeItem);
            const lastSize = sizeList.length > 0 ? sizeList[sizeList.length - 1] : 0;
            sizeList.push(lastSize + treeItem.size);

            if (!isLeaf && visible) {
                const nextHiddenOpt = { level: level + 1, parentKeys: [...parentKeys, treeItem.key] };
                _handleToData(childList, nextHiddenOpt);
            }
        });
    };

    _handleToData(_data);

    return { sizeList, data: resData };
};
