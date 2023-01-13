import InputSearch from '@/components/InputSearch';
import useVirtualTree from './useVirtualTree';
import type { TreeProps } from './types';
import styles from './index.module.less';
import Button from '@/components/Button';
import DeleteModal from './DeleteModal';
import EditDrawer from './EditDrawer';
import AddDrawer from './AddDrawer';
import classnames from 'classnames';
import { Fragment } from 'react';
import Item from './item';
export * from './types';

function VirtualTree<T>(props: TreeProps<T>) {
    const { className, indentation = 12, render, exportFun } = props;

    const {
        data,
        checks,
        setData,
        keyword,
        allCheck,
        onScroll,
        onSearch,
        showData,
        visibles,
        setChecks,
        wrapperRef,
        setVisibles,
        searchValue,
        checkAllChange,
        setSearchValue,
        treeWrapperStyle,
        editVisible,
        setEditVisible,
        addVisible,
        setAddVisible,
        deleteVisible,
        setDeleteVisible,
    } = useVirtualTree(props);

    const normal = (
        <div className={classnames(styles['wrapper'], className)}>
            <div className={styles['search']}>
                <InputSearch value={searchValue} onSearch={onSearch} onChange={(e) => setSearchValue(e.target.value)} style={{ width: 300 }} />
            </div>

            <div ref={wrapperRef} onScroll={onScroll} className={styles['tree']}>
                <div className={styles['tree-inner']} style={treeWrapperStyle}>
                    {showData.map((item) => (
                        <Item
                            item={item}
                            key={item.key}
                            checks={checks}
                            render={render}
                            keyword={keyword}
                            visibles={visibles}
                            setChecks={setChecks}
                            setVisibles={setVisibles}
                            indentation={indentation}
                        />
                    ))}
                </div>
            </div>

            <div className={styles['handle']}>
                <div style={{ flexGrow: 1 }}>
                    <Button className={styles['button']} onClick={checkAllChange}>
                        {allCheck ? '取消全选' : '全选'}
                    </Button>
                    <Button className={styles['button']} disabled={Object.keys(checks).length === 0} onClick={() => setAddVisible(true)}>
                        添加
                    </Button>
                    <Button className={styles['button']} disabled={Object.keys(checks).length === 0} onClick={() => setDeleteVisible(true)}>
                        删除
                    </Button>
                    <Button className={styles['button']} disabled={Object.keys(checks).length === 0} onClick={() => setEditVisible(true)}>
                        编辑
                    </Button>
                </div>

                <Button className={styles['button']} disabled>
                    保存
                </Button>
                <Button className={styles['button']} onClick={exportFun}>
                    导出
                </Button>
            </div>

            <EditDrawer setData={setData} checks={checks} visible={editVisible} setVisible={setEditVisible} />
            <DeleteModal setData={setData} checks={checks} visible={deleteVisible} setVisible={setDeleteVisible} />
            <AddDrawer setData={setData} checks={checks} visible={addVisible} setVisible={setAddVisible} />
        </div>
    );

    return data.length > 0 ? normal : <Fragment />;
}

export default VirtualTree;
