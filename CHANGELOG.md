# Changelog

## [0.3.0](https://github.com/afonsojramos/slidev-decks/compare/v0.2.0...v0.3.0) (2026-03-31)


### Features

* install @slidev/cli and theme alongside slidev-decks in init ([1aa2514](https://github.com/afonsojramos/slidev-decks/commit/1aa25144018939fa0842e2902b2f7ebc35a4d559))


### Bug Fixes

* exclude CHANGELOG.md from oxfmt format checks ([18a5492](https://github.com/afonsojramos/slidev-decks/commit/18a54920ec030d7dfaf4f8d99b3199f8e9668a15))

## [0.2.0](https://github.com/afonsojramos/slidev-decks/compare/v0.1.0...v0.2.0) (2026-03-31)


### Features

* add --all flag to build every deck into dist/&lt;name&gt;/ ([944e6ea](https://github.com/afonsojramos/slidev-decks/commit/944e6ea388e5e5454558442ce859147959718188))
* add CLI entry point with cac argument parser ([0300b89](https://github.com/afonsojramos/slidev-decks/commit/0300b893cd37b49514382e54c066717c88b09403))
* add deck discovery, fuzzy matching, runner, and TUI picker ([15fcde8](https://github.com/afonsojramos/slidev-decks/commit/15fcde89f4f5bf89f76c05906635deab163959bd))
* add dev, build, export, and list commands ([db50b9c](https://github.com/afonsojramos/slidev-decks/commit/db50b9c15ed967969ea3deb1b703bc706f50eb39))
* add embedded slide and style templates with placeholder system ([47d4e20](https://github.com/afonsojramos/slidev-decks/commit/47d4e2010f2bd8f56acb687fb15b35a1a5cfb39e))
* add index command to generate HTML page linking all decks ([4e8ac7c](https://github.com/afonsojramos/slidev-decks/commit/4e8ac7c52d1116fcab1b276356798ebf404e381b))
* add init command for guided repo setup ([6f07404](https://github.com/afonsojramos/slidev-decks/commit/6f0740422843f886b4bbb1a54579090d9c6a2165))
* add minimal and styled template options to init ([1c68906](https://github.com/afonsojramos/slidev-decks/commit/1c689063fa0df4c0397a988c088cfabb8ce7e846))
* add new command for interactive deck creation ([13c6d70](https://github.com/afonsojramos/slidev-decks/commit/13c6d70ee05a33622480cabd7d0ae1fb212aa452))
* add reusable GitHub Action for building and deploying all decks ([d0d554e](https://github.com/afonsojramos/slidev-decks/commit/d0d554e1fdc3fe0065423fbec769ee6431abbf4e))
* auto-generate index page when building all decks ([4af337f](https://github.com/afonsojramos/slidev-decks/commit/4af337fdd27cb01d9d6b42adf0e442501eb92a62))
* default author from root package.json author field ([dae317b](https://github.com/afonsojramos/slidev-decks/commit/dae317bd9d7b1132077ffd378ae3d48fd385802a))
* pass unknown flags through to Slidev, forward --help to Slidev for dev/build/export ([079206b](https://github.com/afonsojramos/slidev-decks/commit/079206b5029c21f81e355a843cdccb60a7eb7258))
* register build --all and index commands in CLI ([de71fdd](https://github.com/afonsojramos/slidev-decks/commit/de71fdd2d5034d76f162a419b33a16a25948663d))
* register init and new commands in CLI ([756c37f](https://github.com/afonsojramos/slidev-decks/commit/756c37fd21a698b89a878087ffdf1e86f903ed8e))
* support multiple local templates with _template-* convention ([64b8c4d](https://github.com/afonsojramos/slidev-decks/commit/64b8c4d2e11282d01ffa5966b3e194e80c21cd94))


### Bug Fixes

* add @types/node and resolve all TypeScript errors ([4c7c0e4](https://github.com/afonsojramos/slidev-decks/commit/4c7c0e4644e354b655b51f713ca7590b50455db0))
* configure release-please to bump minor on feat commits pre-1.0 ([132bcd0](https://github.com/afonsojramos/slidev-decks/commit/132bcd0a55fbea1f82ae5a54a8cdccabe25141de))
* create public/ not public/logos/ in new decks ([5ca5d7e](https://github.com/afonsojramos/slidev-decks/commit/5ca5d7ef4e1f9167612f6398a4476ca4ea06df63))
* guard validate against undefined input, remove author config ([5c92648](https://github.com/afonsojramos/slidev-decks/commit/5c92648ae55d0079444a07f1a4360db3194a4acf))
* include style.css in template placeholder replacement ([2d1c88a](https://github.com/afonsojramos/slidev-decks/commit/2d1c88ad60d8854f18e9ade450aec0765d43fb6f))
* stop creating public/ directory in new decks ([30cd714](https://github.com/afonsojramos/slidev-decks/commit/30cd7148be7a1822b52a28a91b6effac3924c603))
