import type { Dispatch, SetStateAction } from 'react';
import type { TreeItem, SetSelectKey } from './types';
import { useState } from 'react';

type Option<T extends Record<string, any>, D extends Record<string, any>> = {
    getKey: (v: T) => TreeItem['key'];
    getData?: (v: T) => D;
    getSelectable: (v: T) => TreeItem['selectable'];
    getSize: (v: T) => TreeItem['size'];
    getChildList: (v: T) => T[];
    getLabel: (v: T) => TreeItem['label'];
    visibles?: Record<string, boolean>;
};

type HiddenOption = {
    parentKeys: (string | number)[];
    level: number;
};

export const handleToObjData = <T extends Record<string, any>, D extends Record<string, any>>(_data: T[], opt: Option<T, D>) => {
    const { getKey, getData, getLabel, getSelectable, getSize, getChildList, visibles } = opt;

    const resData: Record<string, TreeItem> = {};

    const _handleToData = (data: T[], hiddenOpt?: HiddenOption) => {
        const { level = 0, parentKeys = [] } = hiddenOpt || {};

        data.forEach((item) => {
            const _childList = getChildList(item);
            const childList = Array.isArray(_childList) ? _childList : [];
            const isLeaf = childList.length === 0;

            const treeItem = {
                level,
                isLeaf,
                parentKeys,
                key: getKey(item),
                size: getSize(item),
                data: getData ? getData(item) : {},
                label: getLabel(item),
                selectable: getSelectable(item),
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

export const handleToListData = <T extends Record<string, any>, D extends Record<string, any>>(_data: T[], opt: Option<T, D>) => {
    const { getKey, getData, getLabel, getSelectable, getSize, getChildList, visibles } = opt;

    const resData: TreeItem[] = [];
    const sizeList: number[] = [];

    const _handleToData = (data: T[], hiddenOpt?: HiddenOption) => {
        const { level = 0, parentKeys = [] } = hiddenOpt || {};

        data.forEach((item) => {
            const _childList = getChildList(item);
            const childList = Array.isArray(_childList) ? _childList : [];
            const isLeaf = childList.length === 0;

            const treeItem = {
                level,
                isLeaf,
                parentKeys,
                key: getKey(item),
                size: getSize(item),
                data: getData ? getData(item) : {},
                label: getLabel(item),
                selectable: getSelectable(item),
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

export const getObjFromList = <T>(v: (string | number)[], value: T): Record<string, T> => {
    const nextVisibles: Record<string, T> = {};
    v.forEach((item) => (nextVisibles[item] = value));
    return nextVisibles;
};

type ChangeKeywordOpt = {
    setVisibles: Dispatch<SetStateAction<Record<string, boolean>>>;
    setKeyword: Dispatch<SetStateAction<string>>;
    setMoveTo: Dispatch<SetStateAction<string | number>>;
    treeObj: Record<string, TreeItem>;
};

export const changeKeyword = (word: string, opt: ChangeKeywordOpt) => {
    const { setKeyword, setVisibles, setMoveTo, treeObj } = opt;

    if (word) {
        let firstSearchKey: any = null;
        let allKeys: (string | number)[] = [];

        Object.values(treeObj).forEach(({ key, label, parentKeys }) => {
            if (typeof label === 'string' || typeof label === 'number') {
                if (String(label).includes(word)) {
                    if (!firstSearchKey) firstSearchKey = key;
                    allKeys = [...allKeys, ...parentKeys];
                }
            }
        });

        if (firstSearchKey) setMoveTo(firstSearchKey);
        setVisibles(getObjFromList(allKeys, true));
    } else {
        setVisibles({});
    }

    setKeyword(word);
};

export const useOutState = <T>(out: [undefined | T, undefined | Dispatch<SetStateAction<T>>, T]): [T, Dispatch<SetStateAction<T>>] => {
    const [outV, setOutV, defaultValue] = out;
    const [innerV, setInnerV] = useState<T>(defaultValue);
    const v = outV !== undefined ? outV : innerV;
    const setV = setOutV !== undefined ? setOutV : setInnerV;

    return [v as T, setV as Dispatch<SetStateAction<T>>];
};

export const useSelectKey = (props: { selectKey?: string | number | { key: string | number }; setSelectKey?: SetSelectKey }) => {
    const { selectKey: outSelectInfo, setSelectKey: outSetSelectKey } = props;
    const [innerSelectInfo, innerSetSelectInfo] = useState<{ key: string | number }>({ key: '' });
    const [selectType, setSelectType] = useState<string>('inner');

    const _outSelectInfo =
        typeof outSelectInfo === 'string' || typeof outSelectInfo === 'number' || typeof outSelectInfo === 'undefined'
            ? { key: outSelectInfo || '' }
            : outSelectInfo;

    const _innerSetSelectInfo = (key: string | number) => {
        innerSetSelectInfo({ key });
    };

    const selectInfo = outSelectInfo !== undefined ? _outSelectInfo : innerSelectInfo;

    const setSelectKey = outSetSelectKey !== undefined ? (outSetSelectKey as (v: string | number) => void) : _innerSetSelectInfo;

    return { selectInfo, setSelectKey, selectType, setSelectType };
};
