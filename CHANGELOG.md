# Changelog

## [1.2.0](https://github.com/afonsojramos/slidev-decks/compare/v1.1.0...v1.2.0) (2026-04-09)


### Features

* add --cache flag to build --all for pre-built deck caching ([81223db](https://github.com/afonsojramos/slidev-decks/commit/81223db5f3a0e2b5c1cc6630ad55b6ca6f441a10))

## [1.1.0](https://github.com/afonsojramos/slidev-decks/compare/v1.0.0...v1.1.0) (2026-04-09)


### Features

* support src/slides.md layout for antfu/talks-style repos ([71d2e33](https://github.com/afonsojramos/slidev-decks/commit/71d2e33170406a4b40271360c06388a9660e1bf2))

## [1.0.0](https://github.com/afonsojramos/slidev-decks/compare/v0.4.0...v1.0.0) (2026-04-08)


### ⚠ BREAKING CHANGES

* release v1.0.0

### Features

* add --filter, --continue-on-error, progress counter, and incremental builds ([0918d60](https://github.com/afonsojramos/slidev-decks/commit/0918d60e5e910840f8fc17f91820a28078869c01))
* check Slidev availability before spawning commands ([03e0824](https://github.com/afonsojramos/slidev-decks/commit/03e0824113d62eb7afb2f343405d3afe9846f647))
* improve fuzzy matching with scoring, word matching, and subsequence support ([217e52c](https://github.com/afonsojramos/slidev-decks/commit/217e52cbc239d3bc8c42df8f4b477d752c4c65c0))
* release v1.0.0 ([2cbc510](https://github.com/afonsojramos/slidev-decks/commit/2cbc510213cb7bf74d859453b2b8a3bb35659f42))
* support pinned version and local install in GitHub Action ([423f44c](https://github.com/afonsojramos/slidev-decks/commit/423f44c523db7547ba67f88dc5f1a3446845dbad))


### Bug Fixes

* align Node version to 22 across CI and action to match engines requirement ([e289d70](https://github.com/afonsojramos/slidev-decks/commit/e289d7094d8c4d12433a1558e4b39a449ddf68c4))
* align release workflow Node version to 22 ([5acca19](https://github.com/afonsojramos/slidev-decks/commit/5acca19fed39d93f5f6a50b0335c560cbd77a5f9))
* escape HTML entities in index page to prevent XSS ([28050c9](https://github.com/afonsojramos/slidev-decks/commit/28050c91c5c5c619e843846ad207235659fbb411))
* log warnings for frontmatter parse failures instead of swallowing silently ([366c407](https://github.com/afonsojramos/slidev-decks/commit/366c407307b579fd082800985de4465127faec46))
* prevent shell injection in GitHub Action by using env vars ([9cb21d5](https://github.com/afonsojramos/slidev-decks/commit/9cb21d58a4c7877ceabeaf64a0bad8fb6b4b19f4))
* return 0 for empty query in fuzzyScore ([efc252d](https://github.com/afonsojramos/slidev-decks/commit/efc252d6dae76c64b264c580d364fe1bb39859ba))
* use encodeURIComponent for path segments in index page hrefs ([f1317db](https://github.com/afonsojramos/slidev-decks/commit/f1317db4a83147ab8a902e150b7544ed68ba9179))
* walk through intermediate dirs in findProjectRoot and export build helpers ([64ff0dd](https://github.com/afonsojramos/slidev-decks/commit/64ff0dd221159d626063b0791f7ad93bda52adfd))

## [0.4.0](https://github.com/afonsojramos/slidev-decks/compare/v0.3.2...v0.4.0) (2026-04-05)


### Bug Fixes

* update tsdown to v0.21.7 and use bun in release workflow ([#10](https://github.com/afonsojramos/slidev-decks/issues/10)) ([bf8ec9f](https://github.com/afonsojramos/slidev-decks/commit/bf8ec9f9c2d324436536b54a30207b455e0d08bd))
* update tsdown to v0.21.7 for TypeScript 6 peer dep support ([360c4ff](https://github.com/afonsojramos/slidev-decks/commit/360c4ff9561bffdfc915b6985d0bc71a9e4e4a2f))

## [0.3.2](https://github.com/afonsojramos/slidev-decks/compare/v0.3.1...v0.3.2) (2026-04-05)


### Bug Fixes

* add node types to tsconfig for CI typecheck ([1c1f6e3](https://github.com/afonsojramos/slidev-decks/commit/1c1f6e327c76cf79d54f10373485e9709e4e1af3))
* remove redundant index generation from composite action ([c384e44](https://github.com/afonsojramos/slidev-decks/commit/c384e447e0b6f99db2321f7e45b58ccaa1a17516))
* update tsdown to v0.21.7 and use bun in release workflow ([#10](https://github.com/afonsojramos/slidev-decks/issues/10)) ([bf8ec9f](https://github.com/afonsojramos/slidev-decks/commit/bf8ec9f9c2d324436536b54a30207b455e0d08bd))
* update tsdown to v0.21.7 for TypeScript 6 peer dep support ([360c4ff](https://github.com/afonsojramos/slidev-decks/commit/360c4ff9561bffdfc915b6985d0bc71a9e4e4a2f))

## [0.3.1](https://github.com/afonsojramos/slidev-decks/compare/v0.3.0...v0.3.1) (2026-04-05)


### Bug Fixes

* add node types to tsconfig for CI typecheck ([b63f1c3](https://github.com/afonsojramos/slidev-decks/commit/b63f1c3460d9e92dc9ae3dac0d8298bd6fa5f479))
* remove redundant index generation from composite action ([c35f2ac](https://github.com/afonsojramos/slidev-decks/commit/c35f2ac426ef09073e0f22545c5d6c4fe8e8a311))

## [0.3.0](https://github.com/afonsojramos/slidev-decks/compare/v0.2.0...v0.3.0) (2026-03-31)


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
* install @slidev/cli and theme alongside slidev-decks in init ([1aa2514](https://github.com/afonsojramos/slidev-decks/commit/1aa25144018939fa0842e2902b2f7ebc35a4d559))
* pass unknown flags through to Slidev, forward --help to Slidev for dev/build/export ([079206b](https://github.com/afonsojramos/slidev-decks/commit/079206b5029c21f81e355a843cdccb60a7eb7258))
* register build --all and index commands in CLI ([de71fdd](https://github.com/afonsojramos/slidev-decks/commit/de71fdd2d5034d76f162a419b33a16a25948663d))
* register init and new commands in CLI ([756c37f](https://github.com/afonsojramos/slidev-decks/commit/756c37fd21a698b89a878087ffdf1e86f903ed8e))
* support multiple local templates with _template-* convention ([64b8c4d](https://github.com/afonsojramos/slidev-decks/commit/64b8c4d2e11282d01ffa5966b3e194e80c21cd94))


### Bug Fixes

* add @types/node and resolve all TypeScript errors ([4c7c0e4](https://github.com/afonsojramos/slidev-decks/commit/4c7c0e4644e354b655b51f713ca7590b50455db0))
* configure release-please to bump minor on feat commits pre-1.0 ([132bcd0](https://github.com/afonsojramos/slidev-decks/commit/132bcd0a55fbea1f82ae5a54a8cdccabe25141de))
* create public/ not public/logos/ in new decks ([5ca5d7e](https://github.com/afonsojramos/slidev-decks/commit/5ca5d7ef4e1f9167612f6398a4476ca4ea06df63))
* exclude CHANGELOG.md from oxfmt format checks ([18a5492](https://github.com/afonsojramos/slidev-decks/commit/18a54920ec030d7dfaf4f8d99b3199f8e9668a15))
* guard validate against undefined input, remove author config ([5c92648](https://github.com/afonsojramos/slidev-decks/commit/5c92648ae55d0079444a07f1a4360db3194a4acf))
* include style.css in template placeholder replacement ([2d1c88a](https://github.com/afonsojramos/slidev-decks/commit/2d1c88ad60d8854f18e9ade450aec0765d43fb6f))
* stop creating public/ directory in new decks ([30cd714](https://github.com/afonsojramos/slidev-decks/commit/30cd7148be7a1822b52a28a91b6effac3924c603))

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
