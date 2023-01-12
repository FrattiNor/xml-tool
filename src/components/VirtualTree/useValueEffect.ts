import { handleToListData, handleToObjData, getObjFromList } from './utils';
import type useValueState from './useValueState';
import { getContainerStyle } from './utils2';
import { useEffect } from 'react';

type Props = ReturnType<typeof useValueState>;

const useValueEffect = (props: Props) => {
    const {
        selectedAutoScroll,
        selectedAutoOpen,
        handleToDataOpt,
        visibleData,
        selectType,
        selectKeys,
        selectInfo,
        indexData,
        visibles,
        sizeList,
        showData,
        moveTo,
        data,

        scrollTo,
        setMoveTo,
        setTreeObj,
        setVisibles,
        setSizeList,
        setShowData,
        setSelectType,
        setVisibleData,
        setWrapperStyle,
        computeAndSetStartEnd,
    } = props;

    // sizeList 改变，触发计算start，end
    useEffect(() => {
        computeAndSetStartEnd('data', sizeList);
    }, [sizeList]);

    // 根据 start 和 end 计算展示的 data 和padding style
    useEffect(() => {
        const [start, end] = indexData;
        const copyData = [...visibleData];
        const nextShowData = copyData.slice(start, end + 1);
        setShowData([...nextShowData]);
        setWrapperStyle(getContainerStyle({ sizeList, start, end }));
    }, [indexData]);

    // 根据data获取treeObj
    useEffect(() => {
        if (data.length > 0) {
            const nextObj = handleToObjData(data, { ...handleToDataOpt });
            setTreeObj(nextObj);
        }
    }, [data]);

    // 根据data获取visibleData
    useEffect(() => {
        if (data.length > 0) {
            const { data: _data, sizeList: _sizeList } = handleToListData(data, { ...handleToDataOpt, visibles });
            setVisibleData(_data);
            setSizeList(_sizeList);
        }
    }, [data, visibles]);

    // 自动打开选中
    useEffect(() => {
        if (selectType === 'inner') {
            setSelectType('outer');
        } else {
            if (selectInfo.key) {
                // 自动打开
                if (selectedAutoOpen) {
                    setVisibles((v) => ({ ...v, ...getObjFromList(selectKeys, true) }));
                }
                // 自动滚动，自动滚动需要等showData更新才能执行
                if (selectedAutoScroll) {
                    setMoveTo(selectInfo.key);
                }
            }
        }
    }, [selectInfo]);

    // showData更新执行scroll
    useEffect(() => {
        if (moveTo) {
            scrollTo(moveTo);
            setMoveTo('');
        }
    }, [showData]);
};

export default useValueEffect;
