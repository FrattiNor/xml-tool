/* eslint-disable @typescript-eslint/no-use-before-define */
import xmlParser from 'fast-xml-parser';

/**
 * 文件上传
 * @param accept 接收类型
 * @param multiple 多选
 */

type fileUploadProps = {
    accept?: string;
    multiple?: boolean;
};

export const fileUpload = (props?: fileUploadProps): Promise<File[]> => {
    return new Promise((res) => {
        const { accept, multiple } = props || {};
        const input = document.createElement('input');
        input.setAttribute('style', 'display:none');
        input.setAttribute('name', 'files');
        input.setAttribute('type', 'file');
        if (typeof accept === 'string') input.setAttribute('accept', accept);
        if (typeof multiple === 'boolean') input.setAttribute('multiple', `${multiple}`);
        input.onchange = (e) => {
            document.body.removeChild(input);
            const files = (e?.target as any)?.files as FileList;
            const fileArray: File[] = [];
            for (let i = 0; i < files.length; i++) {
                fileArray.push(files[i]);
            }
            res(fileArray);
        };
        document.body.appendChild(input);
        input.click();
    });
};

/**
 * 文件下载
 * @param blob 文件流
 * @param filename 文件名称
 */
export const fileDownload = (blob: Blob, filename: string) => {
    const blobUrl = URL.createObjectURL(blob);
    const aLink = document.createElement('a');
    aLink.setAttribute('style', 'display:none');
    aLink.setAttribute('href', `${blobUrl}`);
    aLink.setAttribute('download', `${filename}`);
    document.body.appendChild(aLink);
    aLink.click();
    URL.revokeObjectURL(blobUrl);
    document.body.removeChild(aLink);
};

// xml 解析为 json
export const xmlToJson = (data: string) => new xmlParser.XMLParser({ ignoreAttributes: false }).parse(data);
// json 解析为 xml
export const jsonToXml = (data: string) => new xmlParser.XMLBuilder({ ignoreAttributes: false, format: true }).build(data);
