import type { XmlTree, XmlJSON } from './types';

const handleTreeChild = (item: Record<string, any>, child: XmlTree) => {
    child.forEach(({ tag, attrs, child: _child }) => {
        const _item = { ...attrs };

        if (!item[tag]) {
            item[tag] = _item;
        } else if (Array.isArray(item[tag])) {
            item[tag].push(_item);
        } else {
            item[tag] = [item[tag], _item];
        }

        if (_child.length > 0) {
            handleTreeChild(_item, _child);
        }
    });
};

const treeToXml = (data: XmlTree): XmlJSON => {
    const treeData: XmlJSON = {};
    data.forEach(({ tag, attrs, child }) => {
        const item = { ...attrs };

        treeData[tag] = item;

        if (child.length > 0) {
            handleTreeChild(item, child);
        }
    });
    return treeData;
};

export default treeToXml;
