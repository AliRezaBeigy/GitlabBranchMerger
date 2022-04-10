import React, {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
} from 'react';
import {Repository} from '../types';
import {getRepositoryBranches} from '../utils';

export const BranchContext = createContext<{
  branches: string[];
  sourceBranch?: string;
  destinationBranch?: string;
  refreshBranches: () => void;
  setSourceBranch: (branch: string) => void;
  setDestinationBranch: (branch: string) => void;
}>({
  branches: [],
  sourceBranch: undefined,
  destinationBranch: undefined,
  refreshBranches: () => undefined,
  setSourceBranch: () => undefined,
  setDestinationBranch: () => undefined,
});

const BranchProvider: React.FC<PropsWithChildren<any>> = ({children}) => {
  const [SourceBranch, setSourceBranch] = useState<string>();
  const [Branches, setBranches] = useState<string[]>([]);
  const [DestinationBranch, setDestinationBranch] = useState<string>();

  async function fetchBranches(repositories: Repository[]) {
    let branches = (
      await Promise.all(
        repositories.map((repository: Repository) =>
          getRepositoryBranches(repository.url)
        )
      )
    ).reduce((a, b) => [...a, ...b], []);
    setBranches(
      branches.filter((v: string, i: number) => branches.indexOf(v) === i)
    );
  }

  useEffect(() => {
    chrome.storage.sync.get(
      ['repositories', 'sourceBranch', 'destinationBranch'],
      (data) => {
        let repositories =
          data && data['repositories'] ? data['repositories'] : [];
        fetchBranches(repositories);
        setSourceBranch(data['sourceBranch']);
        setDestinationBranch(data['destinationBranch']);
      }
    );
  }, []);

  return (
    <BranchContext.Provider
      value={{
        branches: Branches,
        sourceBranch: SourceBranch,
        setSourceBranch: (sourceBranch) => {
          chrome.storage.sync.set({sourceBranch});
          setSourceBranch(sourceBranch);
        },
        destinationBranch: DestinationBranch,
        setDestinationBranch: (destinationBranch) => {
          chrome.storage.sync.set({destinationBranch});
          setDestinationBranch(destinationBranch);
        },
        refreshBranches: () => {
          chrome.storage.sync.get(['repositories'], (data) => {
            let repositories =
              data && data['repositories'] ? data['repositories'] : [];
            fetchBranches(repositories);
          });
        },
      }}>
      {children}
    </BranchContext.Provider>
  );
};
export default BranchProvider;
