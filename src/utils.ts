import {ChromeMessage, MessageType, Repository, Sender} from './types';

export function sendMessage(
  tabId: number | undefined,
  messageType: MessageType,
  response: (message: ChromeMessage) => void
) {
  if (tabId)
    chrome.tabs.sendMessage(
      tabId,
      {from: Sender.React, messageType: messageType},
      response
    );
}

export async function getRepositoryBranches(repository: string) {
  return await fetch(`${repository}/refs?search=&find=branches`)
    .then((response) => response.json())
    .then((json) => json.Branches);
}

export async function newMergeRequest(
  repository: Repository,
  fromBranch?: string,
  toBranch?: string
) {
  return await fetch(
    `${repository.url}/-/merge_requests/new?merge_request%5Bsource_project_id%5D=${repository.id}&merge_request%5Bsource_branch%5D=${fromBranch}&merge_request%5Btarget_project_id%5D=${repository.id}&merge_request%5Btarget_branch%5D=${toBranch}`
  );
}

export async function getMergeRequest(
  repository: Repository,
  fromBranch?: string,
  toBranch?: string
) {
  return await fetch(`${repository.url}/-/merge_requests`)
    .then((response) => response.text())
    .then(async (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const mergeRequestContainer = doc.querySelector(
        'ul[class="content-list mr-list issuable-list"]'
      );
      for (let i = 0; i < (mergeRequestContainer?.children?.length ?? 0); i++) {
        const mergeRequest = mergeRequestContainer?.children[i];
        if (!mergeRequest) continue;
        const title = mergeRequest.querySelector(
          'a[class="js-prefetch-document"]'
        )?.innerHTML;

        if (title === `Merge from ${fromBranch} to ${toBranch}`) {
          const mergeRequestId = mergeRequest
            .querySelector('span[class="issuable-reference"]')
            ?.innerHTML.trim()
            .replace('!', '');
          return {
            ...(await fetch(
              `${repository.url}/-/merge_requests/${mergeRequestId}/widget.json`
            ).then((response) => response.json())),
            mergeRequestId,
          };
        }
      }
    });
}

export async function hasBranchDifferent(
  repository: Repository,
  fromBranch?: string,
  toBranch?: string
) {
  if (fromBranch && toBranch)
    return await newMergeRequest(repository, fromBranch, toBranch)
      .then((response) => response.text())
      .then(
        (text) =>
          !text.includes('There are no commits yet.') &&
          !text.includes('The form contains the following error:')
      );
  return false;
}

export async function mergeMergeRequest(
  repository: Repository,
  mergeRequest: any,
  fromBranch?: string,
  toBranch?: string
) {
  return await fetch(
    `${repository.url}/-/merge_requests/new?merge_request%5Bsource_project_id%5D=${repository.id}&merge_request%5Bsource_branch%5D=${fromBranch}&merge_request%5Btarget_project_id%5D=${repository.id}&merge_request%5Btarget_branch%5D=${toBranch}`
  )
    .then((response) => response.text())
    .then(async (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const authenticity_token = doc
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content')
        ?.valueOf();
      const merge_request_diff_head_sha = doc
        .querySelector('input[name="merge_request_diff_head_sha"]')
        ?.getAttribute('value')
        ?.valueOf();
      const data: any = {
        squash: false,
        sha: merge_request_diff_head_sha,
        should_remove_source_branch: false,
        squash_commit_message: `Merge from ${fromBranch} to ${toBranch}`,
        commit_message: `Merge branch '${fromBranch}' into '${toBranch}'\n\nMerge from ${fromBranch} to ${toBranch}\n\nSee merge request ${repository.group}/${repository.name}!${mergeRequest.mergeRequestId}`,
      };

      if (
        mergeRequest.ci_status === 'running' ||
        mergeRequest.ci_status === 'pending'
      ) {
        data.auto_merge_strategy = 'merge_when_pipeline_succeeds';
      }

      await fetch(
        `${repository.url}/-/merge_requests/${mergeRequest.mergeRequestId}/merge`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'X-CSRF-Token': authenticity_token ?? '',
            'Content-Type': 'application/json',
          },
        }
      );
      // To make sure gitlab updated
      await new Promise((r) => setTimeout(r, 2000));
    });
}

export async function createMergeRequest(
  repository: Repository,
  fromBranch?: string,
  toBranch?: string
) {
  await newMergeRequest(repository, fromBranch, toBranch)
    .then((response) => response.text())
    .then(async (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const authenticity_token = doc
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content')
        ?.valueOf();
      const merge_request_diff_head_sha = doc
        .querySelector('input[name="merge_request_diff_head_sha"]')
        ?.getAttribute('value')
        ?.valueOf();

      if (
        !toBranch ||
        !fromBranch ||
        !authenticity_token ||
        !merge_request_diff_head_sha
      ) {
        alert('Cannot create merge request!');
        return;
      }

      const data = {
        authenticity_token: authenticity_token,
        merge_request_diff_head_sha: merge_request_diff_head_sha,
        'merge_request[title]': `Merge from ${fromBranch} to ${toBranch}`,
        'merge_request[description]': '',
        'merge_request[assignee_ids][]': '0',
        'merge_request[reviewer_ids][]': '0',
        'merge_request[label_ids][]': '',
        'merge_request[squash]': '0',
        'merge_request[lock_version]': '0',
        'merge_request[source_project_id]': repository.id,
        'merge_request[source_branch]': fromBranch,
        'merge_request[target_project_id]': repository.id,
        'merge_request[target_branch]': toBranch,
      };
      return await fetch(`${repository.url}/-/merge_requests`, {
        body: new URLSearchParams(data),
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    });
}
