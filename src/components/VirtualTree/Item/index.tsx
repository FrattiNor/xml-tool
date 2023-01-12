import type { TreeItemProps } from '../types';
import HighLightText from './highLightText';
import styles from './index.module.less';
import classNames from 'classnames';
import type { FC } from 'react';

const Item: FC<TreeItemProps> = (props) => {
    const { item, indentation, visibles, setVisibles, selectInfo, selectKeys, setSelectKey, setSelectType, keyword, selectedStyleType, render } =
        props;
    const { key, data, label, level, size, isLeaf, selectable } = item;
    const selected = selectInfo.key === key;
    const selectedParent = !selected && selectKeys.includes(key);
    const visible = !!visibles[key];

    const changeVisible = () => {
        setVisibles((v) => ({ ...v, [key]: !v[key] }));
    };

    const iconOnClick = () => {
        changeVisible();
    };

    const onClick = () => {
        if (selectable) {
            setSelectKey(key);
            setSelectType('inner');
        } else {
            changeVisible();
        }
    };

    return (
        <div
            className={classNames(styles['item'])}
            style={{ height: size, paddingLeft: level * indentation }}
            title={typeof label === 'string' ? label : undefined}
        >
            <div
                onClick={iconOnClick}
                className={classNames(styles['item-icon'], {
                    [styles['notLeaf']]: !isLeaf,
                    [styles['isLeaf']]: isLeaf,
                    [styles['visible']]: visible,
                })}
            />
            <div
                onClick={onClick}
                style={{ cursor: !isLeaf || selectable ? 'pointer' : 'auto' }}
                className={classNames(styles['label'], {
                    [styles[`selected-parent-${selectedStyleType}`]]: selectedParent,
                    [styles[`selected-${selectedStyleType}`]]: selected,
                })}
            >
                {typeof render === 'function' ? render(data, keyword) : <HighLightText name={label} keyword={keyword} />}
            </div>
        </div>
    );
};

export default Item;
