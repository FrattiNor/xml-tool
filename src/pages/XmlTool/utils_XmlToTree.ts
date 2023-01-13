/* eslint-disable @typescript-eslint/no-use-before-define */
import type { XmlTree, XmlTreeItem, XmlJSON } from './types';
import { nanoid } from 'nanoid';

const parseToTreeItem = (key: string, data: XmlJSON): XmlTreeItem => {
    const attrs: Record<string, any> = {};
    let child: XmlTree = [];

    Object.entries(data).forEach(([k, v]) => {
        if (typeof v === 'string') {
            attrs[k] = data[k];
        } else if (Array.isArray(v)) {
            child = [...child, ...parseToTree(k, v)];
        } else {
            child = [...child, ...parseToTree(k, v)];
        }
    });

    return {
        tag: key,
        attrs,
        child,
        id: nanoid(),
    };
};

const parseToTree = (key: string, data: XmlJSON | XmlJSON[]): XmlTree => {
    if (Array.isArray(data)) {
        return data.map((item) => parseToTreeItem(key, item));
    } else {
        return [parseToTreeItem(key, data)];
    }
};

const xmlToTree = (data: Record<string, XmlJSON | XmlJSON[]>): XmlTree => {
    const treeData: XmlTree = [];
    Object.entries(data).forEach(([k, v]) => {
        treeData.push(...parseToTree(k, v));
    });
    return treeData;
};

export default xmlToTree;
