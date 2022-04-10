import {HTMLAttributes} from 'react';
import styles from './styles.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function Button({className, ...props}: Props) {
  return <div className={`${styles.container} ${className}`} {...props} />;
}
