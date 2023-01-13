import type { FC, Dispatch, SetStateAction } from 'react';
import type { XmlTreeItem, XmlTree } from '../../types';
import styles from './editForm.module.less';
import { attrKeySave } from '../../utils';
import Button from '@/components/Button';
import { Form, Input } from 'antd';
import { Fragment } from 'react';
import 'antd/es/input/style/css';
import 'antd/es/form/style/css';

type Props = {
    checks: Record<string, boolean>;
    setVisible: (b: boolean) => void;
    setData: Dispatch<SetStateAction<any[]>>;
};

const EditForm: FC<Props> = ({ setVisible, setData, checks }) => {
    const [form] = Form.useForm();

    const submit = () => {
        form.validateFields().then((v) => {
            const handle = (item: XmlTreeItem) => {
                if (v.tag) {
                    item.tag = v.tag;
                }
                if (v.add) {
                    v.add.forEach(({ key, value }: any) => {
                        item.attrs[attrKeySave(key)] = value;
                    });
                }
                if (v.delete) {
                    v.delete.forEach(({ key }: any) => {
                        delete item.attrs[attrKeySave(key)];
                    });
                }
            };

            const handleXmlTree = (data: XmlTree) => {
                data.forEach((item) => {
                    if (checks[item.id]) handle(item);
                    if (item.child.length > 0) handleXmlTree(item.child);
                });
            };

            setData((data: XmlTree) => {
                handleXmlTree(data);
                setVisible(false);
                return [...data];
            });
        });
    };

    return (
        <div className={styles['wrapper']}>
            <div className={styles['form']}>
                <Form form={form} autoComplete="off">
                    <Form.Item name="tag" label="标签名" labelCol={{ span: 24 }}>
                        <Input />
                    </Form.Item>

                    <div className={styles['title']}>添加 / 替换</div>

                    <Form.List name="add">
                        {(fields, { add, remove }) => (
                            <Fragment>
                                {fields.map(({ key, name, ...rest }) => (
                                    <div className={styles['line']} key={key}>
                                        <Form.Item {...rest} name={[name, 'key']} rules={[{ required: true, message: '请输入参数名' }]}>
                                            <Input placeholder="参数名" />
                                        </Form.Item>

                                        <Form.Item {...rest} name={[name, 'value']} rules={[{ required: true, message: '请输入参数值' }]}>
                                            <Input placeholder="参数值" />
                                        </Form.Item>

                                        <Button onClick={() => remove(name)}>删除</Button>
                                    </div>
                                ))}

                                <Form.Item>
                                    <Button onClick={() => add()}>添加</Button>
                                </Form.Item>
                            </Fragment>
                        )}
                    </Form.List>

                    <div className={styles['title']}>删除</div>

                    <Form.List name="delete">
                        {(fields, { add, remove }) => (
                            <Fragment>
                                {fields.map(({ key, name, ...rest }) => (
                                    <div className={styles['line']} key={key}>
                                        <Form.Item {...rest} name={[name, 'key']} rules={[{ required: true, message: '请输入参数名' }]}>
                                            <Input placeholder="参数名" />
                                        </Form.Item>

                                        <Button onClick={() => remove(name)}>删除</Button>
                                    </div>
                                ))}

                                <Form.Item>
                                    <Button onClick={() => add()}>添加</Button>
                                </Form.Item>
                            </Fragment>
                        )}
                    </Form.List>
                </Form>
            </div>

            <div className={styles['handle']}>
                <Button onClick={() => submit()}>确定</Button>
                <Button onClick={() => setVisible(false)}>取消</Button>
            </div>
        </div>
    );
};

export default EditForm;
