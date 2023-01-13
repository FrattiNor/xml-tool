import type { DetailedHTMLProps, ButtonHTMLAttributes, FC } from 'react';
import styles from './index.module.less';
import classnames from 'classnames';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const Button: FC<Props> = (props) => {
    const { className, disabled, ...restProps } = props;
    return <button className={classnames(styles['button'], { [styles['disabled']]: disabled }, className)} disabled={disabled} {...restProps} />;
};

export default Button;
