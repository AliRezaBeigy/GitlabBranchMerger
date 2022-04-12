# Gitlab Branch Merger

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://github.com/AliRezaBeigy/GitlabBranchMerger/blob/master/LICENSE)
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
![GitHub Repo stars](https://img.shields.io/github/stars/AliRezaBeigy/GitlabBranchMerger?style=for-the-badge)
![Chrome web store version](https://img.shields.io/chrome-web-store/v/pkmfkolaocjimdfafkjhmniccnkckneo?style=for-the-badge)

An extension to merge branches in Gitlab faster and easier.
Merge your Gitlab branches in your Browser.

The extension fetches repository status and simulates creating merge requests and merge operations in Gitlab.

You can use this extension for your self-host Gitlab Instance.

Screenshot | Screenshot
--- | ---
![](https://raw.githubusercontent.com/AliRezaBeigy/GitlabBranchMerger/master/screenshots/1.png) | ![](https://raw.githubusercontent.com/AliRezaBeigy/GitlabBranchMerger/master/screenshots/2.png)

## Install
There is 3 way to install extension:
1. [Build on your own](#Build)
2. Download from build from [releases page](https://github.com/AliRezaBeigy/GitlabBranchMerger/releases) and [load the extension's folder](https://developer.chrome.com/extensions/getstarted#unpacked)
3. Download and install from [Chrome web store](https://chrome.google.com/webstore/detail/gitlab-branch-merger/pkmfkolaocjimdfafkjhmniccnkckneo)

## Usage
The extension shows the list of repositories that you added; you can add a repository by following the steps 
- Go to your Gitlab repository page
- Open the extension popup by clicking on the extension icon
- Click on the ``` Add Current Repository ``` button to add the repository to the repository list

To check repository status and merge branch, you should select the source and destination branch you want to merge. The extension fetches repository status and shows a special button for each repository status.

## Build

To start a build run ```yarn build``` and [load the extension's folder](https://developer.chrome.com/extensions/getstarted#unpacked) ./build;.

## Contributions

If you're interested in contributing to this project, first of all I would like to extend my heartfelt gratitude.

Please feel free to reach out to me if you need help. My Email: AliRezaBeigyKhu@gmail.com
Telegram: [@AliRezaBeigy](https://t.me/AliRezaBeigyKhu)

## LICENSE

MIT
