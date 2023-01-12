/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/no-array-index-key */
import type { XmlTree, XmlJSON } from './types';
import { fileUpload, xmlToJson } from './utils';
import { useState } from 'react';
import VirtualTree from './XmlVirtualTree';
import styles from './index.module.less';
import xmlToTree from './xmlToTree';
import classnames from 'classnames';

const XmlTool = () => {
    const [selectedName, setSelectedName] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [xmlJSON, setXmlJSON] = useState<XmlJSON>({});
    const [xmlTree, setXmlTree] = useState<XmlTree>([]);

    const upload = () => {
        fileUpload({ accept: '.xml', multiple: false }).then((_files) => {
            setFiles((f) => [...f, ..._files]);
        });
    };

    const selectXml = (f: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const nextXmlJSON = xmlToJson(reader.result as string);
            setXmlJSON(nextXmlJSON);
            setXmlTree(xmlToTree(nextXmlJSON));
            setSelectedName(f.name);
        };
        reader.readAsText(f);
    };

    return (
        <div className={styles['xml-wrapper']}>
            <div className={styles['menu']}>
                <button onClick={upload}>上传XML</button>

                <div className={styles['files']}>
                    {files.map((item) => (
                        <div
                            key={item.name}
                            title={item.name}
                            onClick={() => selectXml(item)}
                            className={classnames(styles['files-item'], { [styles['selected']]: selectedName === item.name })}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles['content']}>
                <VirtualTree
                    data={xmlTree}
                    getKey={({ id }) => id}
                    render={({ data }) => data.tag}
                    getChildList={({ child }) => child}
                    className={styles['virtual-tree']}
                />
            </div>
        </div>
    );
};

export default XmlTool;
