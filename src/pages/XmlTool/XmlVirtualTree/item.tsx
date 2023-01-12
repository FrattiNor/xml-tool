import type { TreeItemProps } from './types';
import styles from './item.module.less';
import classNames from 'classnames';

function Item<T>(props: TreeItemProps<T>) {
    const { item, indentation, visibles, setVisibles, render } = props;
    const { key, level, size, isLeaf } = item;
    const visible = !!visibles[key];

    const changeVisible = () => {
        setVisibles((v) => ({ ...v, [key]: !v[key] }));
    };

    const iconOnClick = () => {
        changeVisible();
    };

    return (
        <div className={classNames(styles['item'])} style={{ height: size, paddingLeft: level * indentation }}>
            <div
                onClick={iconOnClick}
                className={classNames(styles['item-icon'], {
                    [styles['notLeaf']]: !isLeaf,
                    [styles['isLeaf']]: isLeaf,
                    [styles['visible']]: visible,
                })}
            />
            <div className={classNames(styles['label'])}>{render(item)}</div>
        </div>
    );
}

export default Item;
