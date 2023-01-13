import type { TreeItemProps } from './types';
import styles from './item.module.less';
import classnames from 'classnames';

function Item<T>(props: TreeItemProps<T>) {
    const { item, indentation, setVisibles, render, keyword, visibles, checks, setChecks } = props;
    const { key, level, size, isLeaf } = item;
    const visible = !!visibles[key];
    const checked = !!checks[key];

    const iconClick = () => {
        setVisibles((v) => {
            const nextVisibles = { ...v };
            if (!nextVisibles[key]) {
                nextVisibles[key] = true;
            } else {
                delete nextVisibles[key];
            }
            return nextVisibles;
        });
    };

    const checkboxClick = () => {
        setChecks((v) => {
            const nextChecks = { ...v };
            if (!nextChecks[key]) {
                nextChecks[key] = true;
            } else {
                delete nextChecks[key];
            }
            return nextChecks;
        });
    };

    return (
        <div className={classnames(styles['item'])} style={{ height: size, paddingLeft: level * indentation }}>
            <div
                onClick={iconClick}
                className={classnames(styles['item-icon'], {
                    [styles['visible']]: visible,
                    [styles['notLeaf']]: !isLeaf,
                })}
            />
            <input type="checkbox" className={styles['checkbox']} checked={checked} onChange={checkboxClick} />
            {render(item, keyword)}
        </div>
    );
}

export default Item;
