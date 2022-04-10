import {SelectHTMLAttributes} from 'react';
import styles from './styles.module.scss';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {}

export default function Selector({className, ...props}: Props) {
  return (
    <select
      className={`${styles.selector_container} ${className}`}
      {...props}
    />
  );
}
