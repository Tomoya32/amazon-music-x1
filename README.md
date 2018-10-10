# Amazon Music X-1

> Amazon Music X-1 application

X-1's Amazon Music application that consumes Amazon Music API. This application was initially generated using [Create React App Documentation](create_react_app_readme.md).

## Getting Started

### Prerequisites

- Install [Yarn](https://yarnpkg.com) on your system's runtime
- Clone this repo on local machine and navigate into directory.
- Create `.env` file from `.env.sample` on project's root directory.

### Running for local development

- Start application by running ```yarn start```
- API will be served on localhost and port 3000 as default.

### Running tests

- Start application by running ```yarn test```
- Tests report will be printed on terminal.

## Development Guide Lines

### Git branch naming convention

#### `<type>/<task ID>-<name>`

##### `<type>`
```
bug      - Code changes linked to a known issue.
feature  - New feature.
task     - Code changes for optimization of something already existing.
hotfix   - Quick fixes to the codebase.
junk     - Experiments (will never be merged).
```

##### `<task ID>`
Corresponds to the work board's task ID using dashes (hyphens) to separate letters from numbers (if needed).

##### `<name>`
Always use dashes (hyphens) to separate words and keep name short.

#### Examples
```
feature/ASD-12-fetch-cookies-collection
task/ASD-12-enhance-cookies
hotfix/ASD-24-fix-dashboard-view
bug/ASD-192-login-ui
```

### Documentation

- [Create React App Documentation](create_react_app_readme.md)

## Built With

* [Node.js](http://www.nodejs.org) - Node.js
* [Yarn](https://yarnpkg.com) - Fast, reliable and secure dependency management.

## Versioning

[SemVer](http://semver.org/) is used for versioning. For the versions available, see the [tags on this repository](https://github.com/adiffengine/amazon-music-x1/tags).
