import { computeStartEnd, getContainerStyle } from './utils2';
import { handleToListData, handleToObjData } from './utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TreeItem, TreeProps } from './types';
import type { CSSProperties } from 'react';
export * from './types';

function useVirtualTree<T>(props: TreeProps<T>) {
    const beforeTime = useRef<number>(0);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const { data: _data, size = 30, keyKey, childListKey, onSearch: _onSearch } = props;

    const [searchedSizeList, setSearchedSizeList] = useState<number[] | null>(null);
    const [searchedData, setSearchedData] = useState<TreeItem<T>[] | null>(null);
    const [treeWrapperStyle, setTreeWrapperStyle] = useState<CSSProperties>({});
    const [treeObj, setTreeObj] = useState<Record<string, TreeItem<T>>>({});
    const [visibles, setVisibles] = useState<Record<string, boolean>>({});
    const [indexData, setIndexData] = useState<[number, number]>([0, 0]);
    const [checks, setChecks] = useState<Record<string, boolean>>({});
    const [visibleData, setVisibleData] = useState<TreeItem<T>[]>([]);
    const [showData, setShowData] = useState<TreeItem<T>[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [sizeList, setSizeList] = useState<number[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [data, setData] = useState<T[]>([]);

    // 是否全选
    const allCheck = useMemo(() => {
        if (searchedData) return searchedData.every(({ key }) => !!checks[key]);
        return Object.keys(treeObj).every((key) => !!checks[key]);
    }, [searchedData, treeObj, checks]);

    // 全选变更
    const checkAllChange = () => {
        if (allCheck) {
            setChecks({});
        } else {
            const nextChecks: Record<string, boolean> = {};
            if (searchedData) {
                searchedData.forEach(({ key }) => (nextChecks[key] = true));
            } else {
                Object.keys(treeObj).forEach((key) => (nextChecks[key] = true));
            }
            setChecks(nextChecks);
        }
    };

    // 节流
    const throttle = (callback: () => void) => {
        const spacing = 30;
        const now = Date.now();
        if (timeout.current) clearTimeout(timeout.current);
        if (now - beforeTime.current > spacing) {
            beforeTime.current = now;
            window.requestAnimationFrame(callback);
        } else {
            // 保底执行最后一次
            timeout.current = setTimeout(callback, spacing);
        }
    };

    // 计算并设置 start, end
    const computeAndSetStartEnd = (_type: 'data' | 'scroll', _sizeList: number[], _visibleData: TreeItem<T>[]) => {
        const [start, end] = indexData;
        const [nextStart, nextEnd] = computeStartEnd({ dom: wrapperRef.current, sizeList: _sizeList, startMore: 3, endMore: 3 });
        if (_type === 'data' || (_type === 'scroll' && (nextStart !== start || nextEnd !== end))) {
            const copyData = [..._visibleData];
            const nextShowData = copyData.slice(nextStart, nextEnd + 1);
            setShowData([...nextShowData]);
            setIndexData([nextStart, nextEnd]);
            setTreeWrapperStyle(getContainerStyle({ sizeList: _sizeList, start: nextStart, end: nextEnd }));
        }
    };

    // 滚动
    const onScroll = () => {
        throttle(() => computeAndSetStartEnd('scroll', searchedSizeList ?? sizeList, searchedData ?? visibleData));
    };

    // 搜索
    const onSearch = (nextKeyword: string) => {
        setKeyword(nextKeyword);
        if (nextKeyword) {
            const nextSearchedSizeList: number[] = [];
            const nextSearchedData: TreeItem<T>[] = [];
            Object.values(treeObj).forEach((v) => {
                if (_onSearch(v, nextKeyword)) {
                    nextSearchedData.push({ ...v, isLeaf: true, level: 0 });
                    const lastSize = nextSearchedSizeList.length > 0 ? nextSearchedSizeList[nextSearchedSizeList.length - 1] : 0;
                    nextSearchedSizeList.push(lastSize + v.size);
                }
            });
            setSearchedSizeList(nextSearchedSizeList);
            setSearchedData(nextSearchedData);
            setVisibles({});
            setChecks({});
        } else {
            setSearchedSizeList(null);
            setSearchedData(null);
            setVisibles({});
            setChecks({});
        }
    };

    useEffect(() => {
        setSearchValue('');
        setKeyword('');
        setVisibles({});
        setData(_data);
    }, [_data]);

    // 根据data获取treeObj
    useEffect(() => {
        if (data.length > 0) {
            setChecks({});
            const nextObj = handleToObjData(data, { keyKey, childListKey, size });
            setTreeObj(nextObj);
        }
    }, [data]);

    // 根据visibles获取sizeList和visibleData
    useEffect(() => {
        if (searchedData && searchedSizeList) {
            computeAndSetStartEnd('data', searchedSizeList, searchedData);
        } else if (data.length > 0) {
            const { data: nextVisibleData, sizeList: nextSizeList } = handleToListData(data, { keyKey, childListKey, visibles, size });
            setVisibleData(nextVisibleData);
            setSizeList(nextSizeList);
            computeAndSetStartEnd('data', nextSizeList, nextVisibleData);
        }
    }, [data, visibles, searchedSizeList, searchedData]);

    return {
        data,
        checks,
        setData,
        keyword,
        treeObj,
        visibles,
        showData,
        allCheck,
        onSearch,
        onScroll,
        setChecks,
        wrapperRef,
        setVisibles,
        searchValue,
        setSearchValue,
        checkAllChange,
        treeWrapperStyle,
        editVisible,
        setEditVisible,
        addVisible,
        setAddVisible,
        deleteVisible,
        setDeleteVisible,
    };
}

export default useVirtualTree;
