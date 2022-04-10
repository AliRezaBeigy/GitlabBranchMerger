import Button from '../Button';
import {sendMessage} from '../../utils';
import useTab from '../../hooks/useTab';
import styles from './styles.module.scss';
import React, {useEffect, useState} from 'react';
import {MessageType, Repository} from '../../types';
import useRepository from '../../hooks/useRepository';

export default function AddCurrentRepository() {
  const {currentTab} = useTab();
  const {onAddRepository, repositories} = useRepository();

  const [Repository, setRepository] = useState<Repository>();

  useEffect(() => {
    sendMessage(currentTab?.id, MessageType.GetCurrentRepository, (message) => {
      if (
        !repositories.find((repository) => repository.url === message.data.url)
      )
        setRepository(message.data);
      else setRepository(undefined);
    });
  }, [currentTab?.id, repositories]);

  if (!Repository) return <></>;

  return (
    <div className={styles.container}>
      <div className={styles.project_label}>Current Project:</div>
      <div>{Repository.name}</div>
      <Button
        onClick={() => onAddRepository(Repository)}
        className={styles.add_button}>
        Add Current Repository
      </Button>
    </div>
  );
}
