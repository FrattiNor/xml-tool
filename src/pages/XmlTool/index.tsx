import { fileUpload, xmlToJson, attrKeyShow, fileDownload, jsonToXml, fileToStr, strToBlob } from './utils';
import { Fragment, useState } from 'react';
import VirtualTree from './XmlVirtualTree';
import xmlToTree from './utils_XmlToTree';
import treeToXml from './utils_TreeToXml';
import styles from './index.module.less';
import Button from '@/components/Button';
import type { XmlTree } from './types';
import classnames from 'classnames';
import { message } from 'antd';
import 'antd/es/message/style/css';

const XmlTool = () => {
    const [selectedName, setSelectedName] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [xmlTree, setXmlTree] = useState<XmlTree>([]);
    const [currentFile, setCurrentFile] = useState<File | null>(null);

    // 上传
    const upload = () => {
        fileUpload({ accept: '.xml', multiple: false }).then((_files) => {
            setFiles((fs) => {
                const nextFiles: File[] = [];
                _files.forEach((f) => {
                    if (fs.some((item) => item.name === f.name)) {
                        message.error(`${f.name}已存在`);
                    } else {
                        nextFiles.push(f);
                    }
                });
                return [...fs, ...nextFiles];
            });
        });
    };

    // 选择xml文件
    const selectXml = (f: File) => {
        fileToStr(f, (str) => {
            setCurrentFile(f);
            const nextXmlJSON = xmlToJson(str);
            console.log('nextXmlJSON', nextXmlJSON);
            setXmlTree(xmlToTree(nextXmlJSON));
            setSelectedName(f.name);
        });
    };

    // 导出
    const exportFun = () => {
        if (currentFile) {
            const fileStr = jsonToXml(treeToXml(xmlTree));
            const blob = strToBlob(fileStr, currentFile.type);
            fileDownload(blob, currentFile.name);
        }
    };

    return (
        <div className={styles['xml-wrapper']}>
            <div className={styles['menu']}>
                <Button className={styles['button']} onClick={upload}>
                    上传XML
                </Button>

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
                {xmlTree.length > 0 && (
                    <Fragment>
                        <div className={styles['content-tree']}>
                            <VirtualTree
                                size={24}
                                keyKey="id"
                                data={xmlTree}
                                childListKey="child"
                                exportFun={exportFun}
                                onSearch={({ data }, keyword) =>
                                    [data.tag, ...Object.entries(data.attrs).map(([k, v]) => `${attrKeyShow(k)}=${v}`)].join(' ').includes(keyword)
                                }
                                render={({ data }) => {
                                    return (
                                        <div className={styles['content-line']}>
                                            <span className={styles['tag']}>{data.tag}</span>
                                            {Object.entries(data.attrs).map(([k, v]) => (
                                                <span key={k}>
                                                    <span className={styles['attr-key']}>{attrKeyShow(k)}</span>
                                                    <span>=</span>
                                                    <span className={styles['attr-value']}>{v}</span>
                                                </span>
                                            ))}
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    );
};

export default XmlTool;
