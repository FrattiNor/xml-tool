import type { FC, Dispatch, SetStateAction } from 'react';
import type { XmlTreeItem, XmlTree } from '../../types';
import styles from './addForm.module.less';
import { attrKeySave } from '../../utils';
import Button from '@/components/Button';
import { Form, Input } from 'antd';
import { Fragment } from 'react';
import { nanoid } from 'nanoid';
import 'antd/es/input/style/css';
import 'antd/es/form/style/css';

const btnStyle = { borderRadius: '2px' };

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
                const attrs: Record<string, string> = {};

                if (v.add) {
                    v.add.forEach(({ key, value }: any) => {
                        attrs[attrKeySave(key)] = value;
                    });
                }

                const childItem: XmlTreeItem = {
                    id: nanoid(),
                    tag: v.tag,
                    attrs,
                    child: [],
                };

                item.child.unshift(childItem);
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
                <Form form={form} autoComplete="off" labelCol={{ span: 24 }}>
                    <Form.Item name="tag" label="标签名" rules={[{ required: true, message: '请输入标签名' }]}>
                        <Input />
                    </Form.Item>

                    <div className={styles['title']}>属性</div>

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

                                        <Button onClick={() => remove(name)} style={btnStyle}>
                                            删除
                                        </Button>
                                    </div>
                                ))}

                                <Form.Item>
                                    <Button onClick={() => add()} style={btnStyle}>
                                        添加
                                    </Button>
                                </Form.Item>
                            </Fragment>
                        )}
                    </Form.List>
                </Form>
            </div>

            <div className={styles['handle']}>
                <Button style={btnStyle} onClick={() => submit()}>
                    确定
                </Button>
                <Button style={btnStyle} onClick={() => setVisible(false)}>
                    取消
                </Button>
            </div>
        </div>
    );
};

export default EditForm;
