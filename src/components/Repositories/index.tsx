import React from 'react';
import Repository from '../Repository';
import {SectionType} from '../../types';
import styles from './styles.module.scss';
import useBranch from '../../hooks/useBranch';
import useRepository from '../../hooks/useRepository';

export default function Repositories() {
  const {sections} = useRepository();
  const {sourceBranch, destinationBranch} = useBranch();

  if (!sourceBranch || !destinationBranch) {
    return <img src="logo192.png" />;
  }

  function getSectionLabel(sectionType: SectionType) {
    if (sectionType === SectionType.Merged) return 'Merged';
    if (sectionType === SectionType.AutoMergeWhenPipelineSucceeds)
      return 'Auto Merge When Pipeline Succeeds';
    if (sectionType === SectionType.ConfirmMerge) return 'Confirm Merge';
    if (sectionType === SectionType.ConfirmMergeWhenPipelineSucceeds)
      return 'Confirm Merge When Pipeline Succeeds';
    if (sectionType === SectionType.CreateMergeRequest)
      return 'Create Merge Request';
    return '';
  }

  if (sections)
    return (
      <div className={styles.container}>
        {sections.map((section) => (
          <div className={styles.section}>
            <div className={styles.section_label}>
              {getSectionLabel(section.sectionType)}
            </div>
            {section.repositories?.map((fetchedRepository, i) => (
              <Repository
                type={section.sectionType}
                data={fetchedRepository.data}
                loading={fetchedRepository.loading}
                repository={fetchedRepository.repository}
              />
            ))}
          </div>
        ))}
      </div>
    );
  return <div className={styles.loading}>Loading...</div>;
}
