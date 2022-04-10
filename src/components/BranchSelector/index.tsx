import useBranch from '../../hooks/useBranch';
import styles from './styles.module.scss';
import Selector from '../Selector';

export default function BranchSelector() {
  const {
    branches,
    sourceBranch,
    setSourceBranch,
    destinationBranch,
    setDestinationBranch,
  } = useBranch();

  return (
    <div className={styles.container}>
      <div className={styles.branch_selector}>
        <div className={styles.branch_selector_label}>Source Branch</div>
        <Selector
          value={sourceBranch}
          className={styles.selector}
          onChange={(e) => setSourceBranch(e.target.value)}>
          <option value="">Select Branch</option>
          {branches
            .filter((branch) => branch !== destinationBranch)
            .map((branch) => (
              <option value={branch}>{branch}</option>
            ))}
        </Selector>
      </div>
      <div className={styles.branch_selector}>
        <div className={styles.branch_selector_label}>Destination Branch</div>
        <Selector
          value={destinationBranch}
          className={styles.selector}
          onChange={(e) => setDestinationBranch(e.target.value)}>
          <option value="">Select Branch</option>
          {branches
            .filter((branch) => branch !== sourceBranch)
            .map((branch) => (
              <option value={branch}>{branch}</option>
            ))}
        </Selector>
      </div>
    </div>
  );
}
