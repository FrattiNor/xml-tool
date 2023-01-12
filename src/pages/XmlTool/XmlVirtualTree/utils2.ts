import type { CSSProperties } from 'react';

// 根据 start, end 设置容器样式
export const getContainerStyle = ({ sizeList, start, end }: { sizeList: number[]; start: number; end: number }): CSSProperties => {
    const length = sizeList.length;
    const total = length > 0 ? sizeList[length - 1] : 0;
    const one = length > 0 ? (start - 1 < 0 ? 0 : sizeList[start - 1]) : 0;
    const two = length > 0 ? (end > length - 1 ? sizeList[length - 1] : sizeList[end]) : 0;
    const three = total;

    return { paddingTop: one, height: two - one, paddingBottom: three - two };
};

// 二分查找
export const binarySearch = (left: number, right: number, condition: (i: number) => number): number | null => {
    let i: number | null = (left + right) / 2;

    const binarySearchNext = (_left: number, _right: number) => {
        if (_left === _right) {
            return null;
        } else {
            return binarySearch(_left, _right, condition);
        }
    };

    if (i % 1 !== 0) {
        const i1 = Math.floor(i);
        const i2 = Math.ceil(i);
        const i1C = condition(i1);
        const i2C = condition(i2);

        if (i1C === 0) {
            return i1;
        }
        if (i2C === 0) {
            return i2;
        }

        if (i1C > 0 && i2C > 0) {
            i = binarySearchNext(i2, right);
        } else if (i1C < 0 && i2C < 0) {
            i = binarySearchNext(left, i1);
        } else {
            i = null;
        }
    } else {
        const iC = condition(i);

        if (iC === 0) {
            return i;
        }
        if (iC > 0) {
            i = binarySearchNext(i, right);
        }
        if (iC < 0) {
            i = binarySearchNext(left, i as number);
        }
    }

    return i;
};

// 计算并设置 start, end
export const computeStartEnd = ({
    dom,
    sizeList,
    startMore,
    endMore,
}: {
    dom: null | HTMLDivElement;
    sizeList: number[];
    startMore: number;
    endMore: number;
}) => {
    const length = sizeList.length;

    if (dom) {
        const scrollDistance = dom.scrollTop;
        const containerDistance = dom.clientHeight;

        const getStart = () => {
            let _start: number | null = 0;

            if (length > 0) {
                const startDistance = scrollDistance;
                // 二分查找_start
                _start = binarySearch(0, length - 1, (i) => {
                    const prev = i === 0 ? 0 : sizeList[i - 1];
                    if (sizeList[i] > startDistance && startDistance >= prev) {
                        return 0;
                    } else if (sizeList[i] <= startDistance) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
            }

            return _start;
        };

        const getEnd = () => {
            let _end: number | null = 0;

            if (length > 0) {
                const endDistance = scrollDistance + containerDistance;

                if (endDistance > sizeList[length - 1]) {
                    _end = length - 1;
                } else {
                    // 二分查找_end
                    _end = binarySearch(0, length - 1, (i) => {
                        const v = endDistance;
                        const prev = i === 0 ? 0 : sizeList[i - 1];
                        if (sizeList[i] >= v && v > prev) {
                            return 0;
                        } else if (sizeList[i] < v) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                }
            }

            return _end;
        };

        // 查找_start
        const _start = getStart() ?? 0;

        // 查找_end
        const _end = getEnd() ?? 0;

        const _nextStart = (_start as number) - startMore;
        const nextStart = Math.max(0, Math.min(_nextStart, length - 1));

        const _nextEnd = (_end as number) + endMore;
        const nextEnd = Math.max(0, Math.min(_nextEnd, length - 1));

        return [nextStart, nextEnd];
    } else {
        return [0, 0];
    }
};
