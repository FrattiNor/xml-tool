import type { FC, Dispatch, SetStateAction } from 'react';
import type { XmlTree } from '../../types';
import styles from './index.module.less';
import Button from '@/components/Button';
import { Modal } from 'antd';
import 'antd/es/modal/style/css';

type Props = {
    visible: boolean;
    checks: Record<string, boolean>;
    setVisible: (b: boolean) => void;
    setData: Dispatch<SetStateAction<any[]>>;
};

const DeleteDrawer: FC<Props> = ({ checks, setData, visible, setVisible }) => {
    const submit = () => {
        const handleXmlTree = (data: XmlTree) => {
            const nextData: XmlTree = [];

            data.forEach((item) => {
                if (!checks[item.id]) {
                    nextData.push(item);
                    if (item.child.length > 0) {
                        item.child = handleXmlTree(item.child);
                    }
                }
            });

            return nextData;
        };

        setData((data: XmlTree) => {
            setVisible(false);
            return [...handleXmlTree(data)];
        });
    };

    const foot = (
        <div className={styles['foot']}>
            <Button key="cancel" onClick={() => setVisible(false)}>
                取消
            </Button>
            <Button key="submit" onClick={() => submit()}>
                确认
            </Button>
        </div>
    );

    return (
        <Modal
            centered
            title="删除"
            width={300}
            footer={foot}
            open={visible}
            destroyOnClose
            closable={false}
            bodyStyle={{ padding: 0 }}
            className={styles['modal']}
            onCancel={() => setVisible(false)}
        >
            <div className={styles['content']}>删除节点的同时也将删除节点的子节点，确定要删除选中的节点吗？</div>
        </Modal>
    );
};

export default DeleteDrawer;
