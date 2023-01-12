import { computeStartEnd, getContainerStyle } from './utils2';
import { useEffect, useRef, useState } from 'react';
import type { TreeItem, TreeProps } from './types';
import type { CSSProperties } from 'react';
import { handleToListData } from './utils';
export * from './types';

function useVirtualTree<T>(props: TreeProps<T>) {
    const beforeTime = useRef<number>(0);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const { data, size = 30, getKey, getChildList } = props;
    const [treeWrapperStyle, setTreeWrapperStyle] = useState<CSSProperties>({});
    const [visibles, setVisibles] = useState<Record<string, boolean>>({});
    const [indexData, setIndexData] = useState<[number, number]>([0, 0]);
    const [visibleData, setVisibleData] = useState<TreeItem<T>[]>([]);
    const [showData, setShowData] = useState<TreeItem<T>[]>([]);
    const [sizeList, setSizeList] = useState<number[]>([]);

    // 计算并设置 start, end
    const computeAndSetStartEnd = (_type: 'data' | 'scroll', _sizeList: number[], _visibleData: TreeItem<T>[]) => {
        const [start, end] = indexData;
        const [_start, _end] = computeStartEnd({ dom: wrapperRef.current, sizeList: _sizeList, startMore: 3, endMore: 3 });

        if (_type === 'data' || (_type === 'scroll' && (_start !== start || _end !== end))) {
            const copyData = [..._visibleData];
            const nextShowData = copyData.slice(_start, _end + 1);
            setShowData([...nextShowData]);
            setIndexData([_start, _end]);
            setTreeWrapperStyle(getContainerStyle({ sizeList: _sizeList, start: _start, end: _end }));
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

    // 滚动
    const onScroll = () => throttle(() => computeAndSetStartEnd('scroll', sizeList, visibleData));

    // 根据data获取visibleData
    useEffect(() => {
        if (data.length > 0) {
            const { data: _data, sizeList: _sizeList } = handleToListData(data, { getKey, getChildList, visibles, size });
            setVisibleData(_data);
            setSizeList(_sizeList);
            computeAndSetStartEnd('data', _sizeList, _data);
        }
    }, [data, visibles]);

    return { wrapperRef, showData, visibles, setVisibles, treeWrapperStyle, onScroll };
}

export default useVirtualTree;
