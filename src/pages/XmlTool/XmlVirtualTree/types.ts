import type { Dispatch, ReactNode, SetStateAction } from 'react';

export type TreeItem<T> = {
    key: string | number;
    data: T;
    level: number;
    isLeaf: boolean;
    size: number;
};

export type TreeProps<T> = {
    data: T[];
    size?: number;
    indentation?: number;
    getKey: (v: T) => TreeItem<T>['key'];
    getChildList: (v: T) => T[];
    render: (data: TreeItem<T>) => ReactNode;
    className?: string;
};

export type TreeItemProps<T> = {
    item: TreeItem<T>;
    indentation: number;
    visibles: Record<string, boolean>;
    setVisibles: Dispatch<SetStateAction<Record<string, boolean>>>;
    render: (data: TreeItem<T>) => ReactNode;
};
