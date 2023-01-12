import type { ReactNode, Dispatch, SetStateAction } from 'react';

export type TreeItem = {
    key: string | number;
    parentKeys: (string | number)[];
    selectable: boolean;
    label: string;
    data: any;
    level: number;
    size: number;
    isLeaf: boolean;
};

export type SelectKeyInfo = {
    key: string | number;
    type: string;
};

export type SetSelectKey = Dispatch<SetStateAction<string | number>> | Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<number>>;

export type TreeProps<T extends Record<string, any>> = {
    data: T[];
    size?: number;
    indentation?: number;
    getKey: (v: T) => TreeItem['key'];
    getData?: (v: T) => TreeItem['data'];
    getLabel: (v: T) => TreeItem['label'];
    getSelectable?: (v: T) => TreeItem['selectable'];
    getChildList: (v: T) => T[];
    render?: (data: any, keyword: string) => ReactNode;
    selectedStyleType?: 1 | 2;
    showSearch?: boolean;
    searchWrapperClassName?: string;
    treeWrapperClassName?: string;
    innerCard?: boolean;
    selectedAutoOpen?: boolean;
    selectedAutoScroll?: boolean;
    selectKey?: string | number | { key: string | number };
    setSelectKey?: SetSelectKey;
    setTreeObj?: Dispatch<SetStateAction<Record<string, TreeItem>>>;
};

export type TreeItemProps = {
    item: TreeItem;
    indentation: number;
    visibles: Record<string, boolean>;
    setVisibles: Dispatch<SetStateAction<Record<string, boolean>>>;
    selectInfo: { key: string | number };
    setSelectKey: (key: string | number) => void;
    setSelectType: Dispatch<SetStateAction<string>>;
    selectKeys: (number | string)[];
    keyword: string;
    selectedStyleType: 1 | 2;
    render?: (v: any, keyword: string) => ReactNode;
};
