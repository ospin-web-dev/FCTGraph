[![codecov](https://codecov.io/gh/ospin-web-dev/FCTGraph/branch/main/graph/badge.svg?token=RXXLX0HDAR)](https://codecov.io/gh/ospin-web-dev/FCTGraph)
[![Maintainability](https://api.codeclimate.com/v1/badges/184840b3c795f19f837b/maintainability)](https://codeclimate.com/github/ospin-web-dev/FCTGraph/maintainability)

A package to work with OSPIN's functionality graph model in a functional programming approach.

## Contributing

This repo employs the github action [semantic-release](https://semantic-release.gitbook.io/semantic-release/), which, on approved PRs to `main`, sniffs the PR title/commit message to automatically bump the semantic versioning and publish the package to NPM.

All PRs to the `main` branch should indicate the semantic version change via the following options:

Available types:
 - feat: A new feature
 - fix: A bug fix
 - docs: Documentation only changes
 - style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
 - refactor: A code change that neither fixes a bug nor adds a feature
 - perf: A code change that improves performance
 - test: Adding missing tests or correcting existing tests
 - build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
 - ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
 - chore: Other changes that don't modify src or test files
 - revert: Reverts a previous commit

[More info and how to bump major version found here](https://www.conventionalcommits.org/en/v1.0.0/)

---
