/* eslint-disable react/no-array-index-key */
import { Fragment } from 'react';
import type { FC } from 'react';

type Props = {
    name: string | number;
    keyword: string;
    color?: string;
};

const HighLightText: FC<Props> = ({ name, keyword, color = '#ff4d4f' }) => {
    if (!keyword) {
        return <Fragment>{name}</Fragment>;
    }

    const nameList = String(name).split(keyword);
    const length = nameList.length;

    return (
        <Fragment>
            {nameList.map((item, i) => (
                <Fragment key={i}>
                    {item}
                    {keyword && i < length - 1 && <span style={{ color }}>{keyword}</span>}
                </Fragment>
            ))}
        </Fragment>
    );
};

export default HighLightText;
