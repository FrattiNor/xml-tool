import type { FC, Dispatch, SetStateAction } from 'react';
import EditForm from './editForm';
import { Drawer } from 'antd';
import 'antd/es/drawer/style/css';

type Props = {
    visible: boolean;
    checks: Record<string, boolean>;
    setVisible: (b: boolean) => void;
    setData: Dispatch<SetStateAction<any[]>>;
};

const EditDrawer: FC<Props> = ({ checks, setData, visible, setVisible }) => {
    return (
        <Drawer
            width={500}
            open={visible}
            destroyOnClose
            bodyStyle={{ padding: 0 }}
            onClose={() => setVisible(false)}
            headerStyle={{ display: 'none' }}
        >
            <EditForm checks={checks} setData={setData} setVisible={setVisible} />
        </Drawer>
    );
};

export default EditDrawer;
