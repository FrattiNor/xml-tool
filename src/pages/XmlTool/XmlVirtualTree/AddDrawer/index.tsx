import type { FC, Dispatch, SetStateAction } from 'react';
import AddForm from './addForm';
import { Drawer } from 'antd';
import 'antd/es/drawer/style/css';

type Props = {
    visible: boolean;
    checks: Record<string, boolean>;
    setVisible: (b: boolean) => void;
    setData: Dispatch<SetStateAction<any[]>>;
};

const AddDrawer: FC<Props> = ({ checks, setData, visible, setVisible }) => {
    return (
        <Drawer
            width={500}
            open={visible}
            destroyOnClose
            bodyStyle={{ padding: 0 }}
            afterOpenChange={setVisible}
            onClose={() => setVisible(false)}
            headerStyle={{ display: 'none' }}
        >
            <AddForm checks={checks} setData={setData} setVisible={setVisible} />
        </Drawer>
    );
};

export default AddDrawer;
