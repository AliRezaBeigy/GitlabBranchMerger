import React from 'react';
import Button from '../Button';
import styles from './styles.module.scss';
import useBranch from '../../hooks/useBranch';
import {Repository, SectionType} from '../../types';
import useRepository from '../../hooks/useRepository';
import {createMergeRequest, mergeMergeRequest} from '../../utils';

interface Props {
  data: any;
  type: SectionType;
  loading?: boolean;
  repository: Repository;
}

export default function RepositoryComponent({
  type,
  repository,
  data,
  loading,
}: Props) {
  const {onRemoveRepository, updateRepository, loadingRepository} =
    useRepository();
  const {sourceBranch, destinationBranch} = useBranch();

  let button = <></>;

  if (type === SectionType.CreateMergeRequest) {
    button = (
      <Button
        className={styles.button}
        onClick={() => {
          loadingRepository(repository);
          createMergeRequest(repository, sourceBranch, destinationBranch).then(
            () => updateRepository(repository)
          );
        }}>
        Create Merge Request
      </Button>
    );
  }

  if (type === SectionType.ConfirmMerge) {
    button = (
      <Button
        className={styles.button}
        onClick={() => {
          loadingRepository(repository);
          mergeMergeRequest(
            repository,
            data,
            sourceBranch,
            destinationBranch
          ).then(() => updateRepository(repository));
        }}>
        Merge
      </Button>
    );
  }

  if (type === SectionType.ConfirmMergeWhenPipelineSucceeds) {
    button = (
      <Button
        className={styles.button}
        onClick={() => {
          loadingRepository(repository);
          mergeMergeRequest(
            repository,
            data,
            sourceBranch,
            destinationBranch
          ).then(() => updateRepository(repository));
        }}>
        Merge When Pipeline Succeeds
      </Button>
    );
  }

  if (loading) button = <Button className={styles.button}>Loading...</Button>;

  return (
    <div className={styles.container}>
      <div className={styles.project}>
        {repository.group} / {repository.name}
      </div>
      {button}
      <i className="gg-remove" onClick={() => onRemoveRepository(repository)} />
    </div>
  );
}
