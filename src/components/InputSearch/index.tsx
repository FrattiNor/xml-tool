import type { DetailedHTMLProps, InputHTMLAttributes, KeyboardEventHandler, FC } from 'react';
import styles from './index.module.less';
import SearchSvg from './svg_search';
import classnames from 'classnames';
import { useRef } from 'react';
import Input from '../Input';

type Props = Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'ref'>;
type AddProps = { onSearch?: (value: string) => void };

const InputSearch: FC<Props & AddProps> = (props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { className, onSearch, ...restProps } = props;

    const search = () => {
        if (inputRef.current) {
            if (typeof onSearch === 'function') {
                onSearch(inputRef.current.value);
            }
        }
    };

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.code === 'Enter') search();
    };

    return (
        <div className={classnames(styles['input-search-wrapper'], className)}>
            <Input ref={inputRef} {...restProps} className={styles['input']} onKeyDown={onKeyDown} onClear={search} />
            <div className={styles['search-icon']} onClick={search}>
                <SearchSvg />
            </div>
        </div>
    );
};

export default InputSearch;
