import type { Dispatch, ReactNode, SetStateAction } from 'react';

export type TreeItem<T> = {
    parentKeys: (string | number)[];
    key: string | number;
    isLeaf: boolean;
    level: number;
    size: number;
    data: T;
};

export type TreeProps<T> = {
    data: T[];
    size?: number;
    indentation?: number;
    keyKey: string;
    childListKey: string;
    onSearch: (v: TreeItem<T>, keyword: string) => boolean;
    render: (data: TreeItem<T>, keyword: string) => ReactNode;
    className?: string;
    exportFun: () => void;
};

export type TreeItemProps<T> = {
    keyword: string;
    item: TreeItem<T>;
    indentation: number;
    visibles: Record<string, boolean>;
    setVisibles: Dispatch<SetStateAction<Record<string, boolean>>>;
    checks: Record<string, boolean>;
    setChecks: Dispatch<SetStateAction<Record<string, boolean>>>;
    render: (data: TreeItem<T>, keyword: string) => ReactNode;
};
