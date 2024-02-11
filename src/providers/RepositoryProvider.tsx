import React, {
    useState,
    useEffect,
    createContext,
    PropsWithChildren,
} from 'react';
import useBranch from '../hooks/useBranch';
import {FetchedRepository, Repository, Section, SectionType} from '../types';
import {getMergeRequest, hasBranchDifferent} from '../utils';

export const RepositoryContext = createContext<{
    sections?: Section[];
    repositories: Repository[];
    onAddRepository: (repository: Repository) => void;
    updateRepository: (repository: Repository) => void;
    loadingRepository: (repository: Repository) => void;
    onRemoveRepository: (repository: Repository) => void;
}>({
    repositories: [],
    sections: undefined,
    onAddRepository: () => undefined,
    updateRepository: () => undefined,
    loadingRepository: () => undefined,
    onRemoveRepository: () => undefined,
});

const RepositoryProvider: React.FC<PropsWithChildren<any>> = ({children}) => {
    const [Sections, setSections] = useState<Section[]>();
    const {sourceBranch, destinationBranch, refreshBranches} = useBranch();
    const [Repositories, setRepositories] = useState<Repository[]>([]);
    const [FetchedRepositories, setFetchedRepositories] =
        useState<FetchedRepository[]>();

    useEffect(() => {
        chrome.storage.sync.get('repositories', async (data) =>
            setRepositories(data && data['repositories'] ? data['repositories'] : [])
        );
    }, []);

    async function fetchRepository(repository: Repository) {
        const hasBranchDifferentFetch = await hasBranchDifferent(
            repository,
            sourceBranch,
            destinationBranch
        );

        if (!hasBranchDifferentFetch)
            return {
                repository,
                data: undefined,
                sectionType: SectionType.Merged,
            };

        const mergeRequest = await getMergeRequest(
            repository,
            sourceBranch,
            destinationBranch
        );

        if (!mergeRequest)
            return {
                repository,
                data: undefined,
                sectionType: SectionType.CreateMergeRequest,
            };

        if (
            mergeRequest &&
            !!mergeRequest.auto_merge_strategy &&
            (mergeRequest.ci_status === 'running' ||
                mergeRequest.ci_status === 'pending')
        )
            return {
                repository,
                data: mergeRequest,
                sectionType: SectionType.AutoMergeWhenPipelineSucceeds,
            };

        if (
            mergeRequest &&
            !mergeRequest.auto_merge_strategy &&
            (mergeRequest.ci_status === 'running' ||
                mergeRequest.ci_status === 'pending')
        )
            return {
                repository,
                data: mergeRequest,
                sectionType: SectionType.ConfirmMergeWhenPipelineSucceeds,
            };

        return {
            repository,
            data: mergeRequest,
            sectionType: SectionType.ConfirmMerge,
        };
    }

    async function fetchRepositories() {
        setFetchedRepositories(undefined);
        const fetchedRepositories = await Promise.all(
            Repositories.map(async (repository) => await fetchRepository(repository))
        );
        setFetchedRepositories(fetchedRepositories);
    }

    useEffect(() => {
        fetchRepositories();
    }, [Repositories, sourceBranch, destinationBranch]);

    useEffect(() => {
        if (!FetchedRepositories) {
            setSections(undefined);
            return;
        }

        const sections: Section[] = [];

        for (const sectionType in SectionType) {
            const fetchedRepositories = FetchedRepositories.filter(
                (o) =>
                    o.sectionType === SectionType[sectionType as keyof typeof SectionType]
            );
            if (fetchedRepositories.length > 0)
                sections.push({
                    repositories: fetchedRepositories,
                    sectionType: SectionType[sectionType as keyof typeof SectionType],
                });
        }

        setSections(sections);
    }, [FetchedRepositories]);

    return (
        <RepositoryContext.Provider
            value={{
                sections: Sections,
                repositories: Repositories,
                onAddRepository: (repository) => {
                    let repositories = [...Repositories, repository];
                    repositories = repositories.filter(
                        (value, index, self) =>
                            !!value.url &&
                            self.findIndex((m) => m.url === value.url) === index
                    );
                    chrome.storage.sync.set({repositories: repositories});
                    setRepositories(repositories);
                    refreshBranches();
                },
                onRemoveRepository: (repository) => {
                    const repositories = Repositories.filter(
                        (repo) => repo.url !== repository.url
                    );
                    chrome.storage.sync.set({repositories: repositories});
                    setRepositories(repositories);
                    refreshBranches();
                },
                loadingRepository: async (repository) => {
                    if (!FetchedRepositories) return;

                    setFetchedRepositories(
                        FetchedRepositories.map((fetchedRepository) => {
                            if (fetchedRepository.repository.id === repository.id) {
                                return {...fetchedRepository, loading: true};
                            }
                            return fetchedRepository;
                        })
                    );
                },
                updateRepository: async (repository) => {
                    if (!FetchedRepositories) return;
                    const newRepo = await fetchRepository(repository)
                    setFetchedRepositories(repos =>
                        repos?.map((fetchedRepository) => {
                            if (fetchedRepository.repository.id === repository.id)
                                return newRepo;
                            return fetchedRepository;
                        })
                    );
                },
            }}>
            {children}
        </RepositoryContext.Provider>
    );
};
export default RepositoryProvider;
