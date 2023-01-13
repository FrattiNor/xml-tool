import type { DetailedHTMLProps, InputHTMLAttributes, MouseEventHandler } from 'react';
import { useRef, forwardRef } from 'react';
import styles from './index.module.less';
import classnames from 'classnames';
import ClearSvg from './svg_clear';

type Props = Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'ref'>;
type AddProps = { onClear?: () => void };
type Ele = HTMLInputElement | null;
type Ref = React.MutableRefObject<Ele>;

const Input = forwardRef<HTMLInputElement, Props & AddProps>((props, ref) => {
    const innerRef = useRef<Ele>(null);
    const inputRef = (ref as Ref) || innerRef;
    const { className, onClear: _onClear, ...restProps } = props;

    const onClear: MouseEventHandler<HTMLDivElement> = (e) => {
        if (inputRef.current) {
            inputRef.current.value = '';
            if (props.onChange) {
                const cloneNode = inputRef.current.cloneNode(true) as HTMLInputElement;
                props.onChange(Object.create(e, { target: { value: cloneNode } }));
            }
        }
        if (typeof _onClear === 'function') _onClear();
    };

    return (
        <div className={classnames(styles['input-wrapper'], className)}>
            <input ref={inputRef} required className={styles['input']} {...restProps} />
            <div className={styles['clear-icon']} onClick={onClear}>
                <ClearSvg />
            </div>
        </div>
    );
});

export default Input;
