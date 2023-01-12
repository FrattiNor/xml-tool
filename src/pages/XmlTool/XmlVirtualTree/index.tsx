import useVirtualTree from './useVirtualTree';
import type { TreeProps } from './types';
import styles from './index.module.less';
import classnames from 'classnames';
import { Fragment } from 'react';
import Item from './item';
export * from './types';

function VirtualTree<T>(props: TreeProps<T>) {
    const { data = [], className, indentation = 12, render } = props;
    const { wrapperRef, showData, visibles, setVisibles, treeWrapperStyle, onScroll } = useVirtualTree(props);

    const normal = (
        <div className={classnames(styles['wrapper'], className)}>
            <div ref={wrapperRef} onScroll={onScroll} className={styles['tree']}>
                <div className={styles['tree-inner']} style={treeWrapperStyle}>
                    {showData.map((item) => (
                        <Item item={item} key={item.key} render={render} visibles={visibles} indentation={indentation} setVisibles={setVisibles} />
                    ))}
                </div>
            </div>
        </div>
    );

    return data.length > 0 ? normal : <Fragment />;
}

export default VirtualTree;
