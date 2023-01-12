import { changeKeyword, useSelectKey } from './utils';
import type { TreeItem, TreeProps } from './types';
import { useMemo, useRef, useState } from 'react';
import { computeStartEnd } from './utils2';
import type { CSSProperties } from 'react';

const useValueState = (props: TreeProps<any>) => {
    const beforeTime = useRef<number>(0);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const { getKey, getChildList, getData, getLabel, getSelectable, size = 30 } = props;

    const handleToDataOpt = {
        getSelectable: typeof getSelectable === 'function' ? getSelectable : () => true,
        getSize: () => size,
        getChildList,
        getData,
        getLabel,
        getKey,
    };

    const { selectKey: _selectKey, setSelectKey: _setSelectKey, setTreeObj: _setTreeObj } = props;
    const { innerCard = false, selectedAutoOpen = true, selectedAutoScroll = true } = props;
    const { data, indentation = 12, selectedStyleType = 1, showSearch = true } = props;
    const { treeWrapperClassName, searchWrapperClassName, render } = props;

    const { selectInfo, setSelectKey, selectType, setSelectType } = useSelectKey({ selectKey: _selectKey, setSelectKey: _setSelectKey });
    const [visibles, setVisibles] = useState<Record<string, boolean>>({});
    const [treeObj, setTreeObj] = useState<Record<string, TreeItem>>({});
    const [indexData, setIndexData] = useState<[number, number]>([0, 0]);
    const [wrapperStyle, setWrapperStyle] = useState<CSSProperties>({});
    const [visibleData, setVisibleData] = useState<TreeItem[]>([]);
    const [moveTo, setMoveTo] = useState<string | number>('');
    const [showData, setShowData] = useState<TreeItem[]>([]);
    const [sizeList, setSizeList] = useState<number[]>([]);
    const [keyword, setKeyword] = useState<string>('');

    const selectKeys = useMemo(() => treeObj[selectInfo.key]?.parentKeys || [], [selectInfo.key, treeObj]);

    const isEmpty = data.length === 0;

    const onKeywordChange = (word: string) => {
        changeKeyword(word, { setKeyword, setVisibles, setMoveTo, treeObj });
    };

    const trueSetTreeObj = (v: Record<string, TreeItem>) => {
        setTreeObj(v);
        if (typeof _setTreeObj === 'function') _setTreeObj(v);
    };

    // 计算并设置 start, end
    const computeAndSetStartEnd = (_type: 'data' | 'scroll', _sizeList: number[]) => {
        const [start, end] = indexData;
        const [nextStart, nextEnd] = computeStartEnd({ dom: wrapperRef.current, sizeList: _sizeList, startMore: 3, endMore: 3 });

        if (_type === 'data') {
            setIndexData([nextStart, nextEnd]);
        }
        if (_type === 'scroll' && (nextStart !== start || nextEnd !== end)) {
            setIndexData([nextStart, nextEnd]);
        }
    };

    //
    const scrollTo = (key: string | number) => {
        const idIndex = visibleData.findIndex(({ key: _key }) => key === _key);
        if (idIndex > -1 && wrapperRef.current) {
            const index = idIndex - 1;
            const top = index < 0 ? 0 : sizeList[index];
            wrapperRef.current.scrollTo({ top, behavior: 'smooth' });
            return true;
        }
        return false;
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

    return {
        searchWrapperClassName,
        treeWrapperClassName,
        selectedAutoScroll,
        selectedStyleType,
        selectedAutoOpen,
        handleToDataOpt,
        wrapperStyle,
        visibleData,
        indentation,
        showSearch,
        selectType,
        selectInfo,
        selectKeys,
        wrapperRef,
        innerCard,
        indexData,
        visibles,
        sizeList,
        showData,
        treeObj,
        keyword,
        isEmpty,
        moveTo,
        data,

        render,
        throttle,
        scrollTo,
        setMoveTo,
        setKeyword,
        setSizeList,
        setVisibles,
        setShowData,
        setSelectKey,
        setIndexData,
        setSelectType,
        setVisibleData,
        onKeywordChange,
        setWrapperStyle,
        computeAndSetStartEnd,
        setTreeObj: trueSetTreeObj,
    };
};

export default useValueState;
