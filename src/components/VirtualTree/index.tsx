// import { SearchOutlined } from '@ant-design/icons';
import useValueEffect from './useValueEffect';
import useValueState from './useValueState';
import type { TreeProps } from './types';
import classNames from 'classnames';
// import { Input, Empty } from 'antd';
import styles from './index.module.less';

import Item from './Item';

export * from './utils';
export * from './types';

function VirtualTree<T>(props: TreeProps<T>) {
    const useValueStateRes = useValueState(props);

    useValueEffect(useValueStateRes);

    const {
        // searchWrapperClassName,
        treeWrapperClassName,
        selectedStyleType,
        wrapperStyle,
        indentation,
        selectKeys,
        wrapperRef,
        // showSearch,
        selectInfo,
        innerCard,
        visibles,
        sizeList,
        showData,
        keyword,
        isEmpty,

        render,
        throttle,
        setVisibles,
        setSelectKey,
        setSelectType,
        // onKeywordChange,
        computeAndSetStartEnd,
    } = useValueStateRes;

    const normal = (
        <div className={classNames(styles['wrapper'], { [styles['inner-card']]: innerCard })}>
            {/* {showSearch && (
                <div className={classNames(styles['search'], searchWrapperClassName)}>
                    <Input
                        allowClear
                        value={keyword}
                        placeholder={'请输入'}
                        suffix={<SearchOutlined />}
                        onChange={(e) => onKeywordChange(e.target.value)}
                    />
                </div>
            )} */}

            <div
                ref={wrapperRef}
                onScroll={() => throttle(() => computeAndSetStartEnd('scroll', sizeList))}
                className={classNames(styles['tree'], treeWrapperClassName)}
            >
                <div className={styles['tree-inner']} style={wrapperStyle}>
                    {showData.map((item) => (
                        <Item
                            item={item}
                            key={item.key}
                            render={render}
                            keyword={keyword}
                            visibles={visibles}
                            selectInfo={selectInfo}
                            selectKeys={selectKeys}
                            indentation={indentation}
                            setVisibles={setVisibles}
                            setSelectKey={setSelectKey}
                            setSelectType={setSelectType}
                            selectedStyleType={selectedStyleType}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    const empty = (
        <div className={styles['wrapper']}>
            <div style={{ paddingTop: 16 }}>
                <div />
            </div>
        </div>
    );

    return isEmpty ? empty : normal;
}

export default VirtualTree;
