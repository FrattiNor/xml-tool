import type { TreeItem } from './types';

type Option<T> = {
    getKey: (v: T) => TreeItem<T>['key'];
    getChildList: (v: T) => T[];
    visibles?: Record<string, boolean>;
    size: number;
};

type HiddenOption = {
    parentKeys: (string | number)[];
    level: number;
};

export const handleToObjData = <T>(_data: T[], opt: Option<T>) => {
    const { getKey, getChildList, visibles, size } = opt;

    const resData: Record<string, TreeItem<T>> = {};

    const _handleToData = (data: T[], hiddenOpt?: HiddenOption) => {
        const { level = 0, parentKeys = [] } = hiddenOpt || {};

        data.forEach((item) => {
            const _childList = getChildList(item);
            const childList = Array.isArray(_childList) ? _childList : [];
            const isLeaf = childList.length === 0;

            const treeItem = {
                size,
                level,
                isLeaf,
                data: item,
                key: getKey(item),
            };

            resData[treeItem.key] = treeItem;

            const show = visibles ? !!visibles[treeItem.key] : true;

            if (!isLeaf && show) {
                const nextHiddenOpt = { level: level + 1, parentKeys: [...parentKeys, treeItem.key] };
                _handleToData(childList, nextHiddenOpt);
            }
        });
    };

    _handleToData(_data);

    return resData;
};

export const handleToListData = <T>(_data: T[], opt: Option<T>) => {
    const { getKey, getChildList, visibles, size } = opt;

    const resData: TreeItem<T>[] = [];
    const sizeList: number[] = [];

    const _handleToData = (data: T[], hiddenOpt?: HiddenOption) => {
        const { level = 0, parentKeys = [] } = hiddenOpt || {};

        data.forEach((item) => {
            const _childList = getChildList(item);
            const childList = Array.isArray(_childList) ? _childList : [];
            const isLeaf = childList.length === 0;

            const treeItem = {
                size,
                level,
                isLeaf,
                data: item,
                key: getKey(item),
            };

            resData.push(treeItem);
            const lastSize = sizeList.length > 0 ? sizeList[sizeList.length - 1] : 0;
            sizeList.push(lastSize + treeItem.size);

            const show = visibles ? !!visibles[treeItem.key] : true;

            if (!isLeaf && show) {
                const nextHiddenOpt = { level: level + 1, parentKeys: [...parentKeys, treeItem.key] };
                _handleToData(childList, nextHiddenOpt);
            }
        });
    };

    _handleToData(_data);

    return { sizeList, data: resData };
};
