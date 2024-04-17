# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org).

## [4.1.2] - 2024-04-17
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [shlink-web-component#244](https://github.com/shlinkio/shlink-web-component/issues/244) Display `visitedUrl` in visits table if the visit object has it, regardless of it being an orphan visit or not.
* [shlink-web-component#327](https://github.com/shlinkio/shlink-web-component/issues/327) Ensure orphan visits type is sent to the server, to enable server-side filtering when consumed Shlink supports it.


## [4.1.1] - 2024-04-11
### Added
* [shlink-web-component#293](https://github.com/shlinkio/shlink-web-component/issues/293) Allow ordering redirect rules via drag'n'drop.

### Changed
* Update JS coding standard
* [#1132](https://github.com/shlinkio/shlink-web-client/issues/1132) Add warning message in "validate URLs" setting, indicating it is ignored when consuming Shlink >=4.0.0.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [shlink-web-component#294](https://github.com/shlinkio/shlink-web-component/issues/294) Make sure "validate URL" control is not displayed in short URL creation/edition, when consuming Shlink >=4.0.0.
* [#1130](https://github.com/shlinkio/shlink-web-client/issues/1130) Fix importing servers in Firefox for Android when the CSV file contains spaces.
* [#1133](https://github.com/shlinkio/shlink-web-client/issues/1133) Fix Shlink versions alignment in server error pages.


## [4.1.0] - 2024-03-17
### Added
* [#1079](https://github.com/shlinkio/shlink-web-client/issues/1079) Add support Shlink 4.0.0.
* [shlink-web-component#271](https://github.com/shlinkio/shlink-web-component/issues/271) Add support for redirect rules when consuming Shlink 4.0.0.

  Now, if the server supports it, there will be a new item for every short URL dropdown, which will take you to a page where it will be possible to edit that short URL's redirect rules.

### Changed
* [shlink-web-component#249](https://github.com/shlinkio/shlink-web-component/issues/249) Replace `react-datepicker` with native `input[type="date"]` and `input[type="datetime-local"]` elements.
* Update dependencies.

### Deprecated
* *Nothing*

### Removed
* [shlink-web-component#276](https://github.com/shlinkio/shlink-web-component/issues/276) Drop support for Shlink older than 3.3.0

### Fixed
* [#1084](https://github.com/shlinkio/shlink-web-client/issues/1084) Fix broken server dropdown menu when auto-connect is enabled.


## [4.0.1] - 2024-02-01
### Added
* *Nothing*

### Changed
* [#821](https://github.com/shlinkio/shlink-web-client/issues/821) Update app gif from README.md

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#1046](https://github.com/shlinkio/shlink-web-client/issues/1046) Fix running docker image when server env vars are provided.


## [4.0.0] - 2024-01-29
### Added
* [shlink-web-component #7](https://github.com/shlinkio/shlink-web-component/issues/7) Allow comparing visits for multiple short URLs, tags or domains.

  When in the tags, domains or short URLs tables, you can now pick up to 5 items to compare their visits. Once selected, you are taken to a section displaying a comparative line chart, which supports all regular visits filtering capabilities.

* [shlink-web-component #9](https://github.com/shlinkio/shlink-web-component/issues/9) Allow comparing visits with the previous period.
* [shlink-web-component #12](https://github.com/shlinkio/shlink-web-component/issues/12) and [#13](https://github.com/shlinkio/shlink-web-component/issues/13) Add new "Visits options" section for arbitrary visit stats options. Add section to delete short URL and orphan visits there.

  This section is only visible if short URL visits deletion or orphan visits deletion are supported by connected Shlink server.

* [shlink-web-component #10](https://github.com/shlinkio/shlink-web-component/issues/10) Improve general accessibility: Add accessibility tests, fix accessibility issues and enable accessibility linting rules.

### Changed
* [#338](https://github.com/shlinkio/shlink-web-client/issues/338) Extract `@shlinkio/shlink-web-component` and `@shlinkio/shlink-frontend-kit` as external libs.
* [#978](https://github.com/shlinkio/shlink-web-client/issues/978) Use system preferred theme as default theme.
* Use API client from `@shlinkio/shlink-js-sdk` to consume Shlink servers.
* [#902](https://github.com/shlinkio/shlink-web-client/pull/902) Docker image is no longer running as root. As a side effect, exposed port is `8080`, not `80` anymore.
* [shlink-web-component #117](https://github.com/shlinkio/shlink-web-component/issues/117) Migrate charts from Chart.JS to Recharts.

### Deprecated
* *Nothing*

### Removed
* Drop support for Shlink older than v3.0.0

### Fixed
* [#910](https://github.com/shlinkio/shlink-web-client/issues/910) Fix warnings related with missing `act` in tests and refs in `AppUpdateBanner`.


## [3.10.2] - 2023-07-09
### Added
* *Nothing*

### Changed
* [#781](https://github.com/shlinkio/shlink-web-client/issues/781) Migrate tests from jest to vitest.
* [#843](https://github.com/shlinkio/shlink-web-client/issues/843) Build docker image only for new tags, making sure it always includes an actual version number.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* *Nothing*


## [3.10.1] - 2023-04-23
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#826](https://github.com/shlinkio/shlink-web-client/issues/826) Fix generated short URLs CSV so that it can be used to import on Shlink.


## [3.10.0] - 2023-03-19
### Added
* [#807](https://github.com/shlinkio/shlink-web-client/issues/807) Add support for device-specific long-URLs when creating or editing short URLs.
* [#808](https://github.com/shlinkio/shlink-web-client/issues/808) Respect settings on excluding bots in the overview section, for visits cards.
* [#809](https://github.com/shlinkio/shlink-web-client/issues/809) Respect settings on excluding bots in the tags list.

### Changed
* [#798](https://github.com/shlinkio/shlink-web-client/issues/798) Remove stryker and mutation testing.
* [#800](https://github.com/shlinkio/shlink-web-client/issues/800) Use `/tags/stats` endpoint to load tags stats, when the server supports it.
* Update to Vite 4.2
* Update to TypeScript 5
* Update to coding standard v2.1.0
* Decouple tests from RTK internals.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#799](https://github.com/shlinkio/shlink-web-client/issues/799) Fix fallback visits not taking into account configuration regarding excluding bots.


## [3.9.1] - 2022-12-31
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#787](https://github.com/shlinkio/shlink-web-client/issues/787) Fixed wrong base path set in vite config when homepage is set as empty string.


## [3.9.0] - 2022-12-31
### Added
* [#750](https://github.com/shlinkio/shlink-web-client/issues/750) Added new icon indicators telling if a short URL can be normally visited, it received the max amount of visits, is still not enabled, etc.
* [#764](https://github.com/shlinkio/shlink-web-client/issues/764) Added support to exclude visits from visits on short URLs list when consuming Shlink 3.4.0.

  This feature also comes with a new setting to disable visits from bots by default, both on short URLs lists and visits sections.

* [#760](https://github.com/shlinkio/shlink-web-client/issues/760) Added support to exclude short URLs which have reached the maximum amount of visits, or are valid until a date in the past.

### Changed
* [#753](https://github.com/shlinkio/shlink-web-client/issues/753) Migrated from react-scripts/webpack to vite.
* [#770](https://github.com/shlinkio/shlink-web-client/issues/770) Updated to latest dependencies.
* [#741](https://github.com/shlinkio/shlink-web-client/issues/741) Improved `visitsAsyncThunk`, making it wrap pending/fulfilled/rejected actions, as well as custom ones, in a type-safe way.

### Deprecated
* *Nothing*

### Removed
* [#736](https://github.com/shlinkio/shlink-web-client/issues/736) Removed cards mode in tags. Only table mode is supported now.
* [#774](https://github.com/shlinkio/shlink-web-client/issues/774) Dropped support for Shlink older than 2.8.0.

### Fixed
* [#715](https://github.com/shlinkio/shlink-web-client/issues/715) Fixed connection still failing on miss-configured servers, after editing their params to set proper values.


## [3.8.2] - 2022-12-17
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#766](https://github.com/shlinkio/shlink-web-client/issues/766) Fixed visits query being lost when switching between sub-sections.
* [#765](https://github.com/shlinkio/shlink-web-client/issues/765) Added missing `"Content-Type": "application/json"` to requests with payload, making older Shlink versions fail.


## [3.8.1] - 2022-12-06
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#756](https://github.com/shlinkio/shlink-web-client/issues/756) Fixed all visits interval not working unless switching to a different interval first.
* [#757](https://github.com/shlinkio/shlink-web-client/issues/757) Fixed visits fallback interval not working until the visits view has been loaded at least twice.


## [3.8.0] - 2022-12-03
### Added
* [#708](https://github.com/shlinkio/shlink-web-client/issues/708) Added support for API v3.
* [#717](https://github.com/shlinkio/shlink-web-client/issues/717) Allowed to select time in 10 minute intervals when configuring "enabled since" and "enabled until" on short URLs.
* [#748](https://github.com/shlinkio/shlink-web-client/issues/748) Improved visits section to add filters to the query string, allowing to navigate to a specific state or bookmarking filters.

### Changed
* [#713](https://github.com/shlinkio/shlink-web-client/issues/713) Updated dependencies.
* [#620](https://github.com/shlinkio/shlink-web-client/issues/620) Migrated all reducers to redux toolkit.
* [#721](https://github.com/shlinkio/shlink-web-client/issues/721) Migrated from axios to fetch.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#590](https://github.com/shlinkio/shlink-web-client/issues/590) Fixed position of the datepicker triangle.
* [#729](https://github.com/shlinkio/shlink-web-client/issues/729) Fixed wrong stats displayed in tags after renaming.
* [#737](https://github.com/shlinkio/shlink-web-client/issues/737) Fixed incorrect contrast in warning messages when using dark theme.
* [#726](https://github.com/shlinkio/shlink-web-client/issues/726) Fixed delete server and delete short URL modals getting removed from the DOM before finishing close transition.
* [#749](https://github.com/shlinkio/shlink-web-client/issues/749) Fixed broken short URLs table when some short URL has a too long custom slug.


## [3.7.3] - 2022-09-13
### Added
* [#703](https://github.com/shlinkio/shlink-web-client/issues/703) Added support to publish docker image in GHCR.

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#709](https://github.com/shlinkio/shlink-web-client/issues/709) Fixed visits not being displayed after a large loading has finished.


## [3.7.2] - 2022-08-07
### Added
* [#671](https://github.com/shlinkio/shlink-web-client/issues/671) Added proper color-scheme in root element based on selected theme.

### Changed
* [#688](https://github.com/shlinkio/shlink-web-client/issues/688) Finalized migration from enzyme to react-testing-library.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#695](https://github.com/shlinkio/shlink-web-client/issues/695) Fixed some warnings in tests.
* [#693](https://github.com/shlinkio/shlink-web-client/issues/693) Fixed tags, servers and domains search to make it case-insensitive.
* [#694](https://github.com/shlinkio/shlink-web-client/issues/694) Fixed editing and loading visits on short URLs with multi-segment slugs.


## [3.7.1] - 2022-05-25
### Added
* *Nothing*

### Changed
* [#648](https://github.com/shlinkio/shlink-web-client/issues/648) Migrated some scripts to ESM and updated to chalk 5.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#653](https://github.com/shlinkio/shlink-web-client/issues/653) Fixed rendering values greater than 1000 in charts, when the browser has certain locales configured.


## [3.7.0] - 2022-05-14
### Added
* [#622](https://github.com/shlinkio/shlink-web-client/issues/622) Added support to load domain visits when consuming Shlink 3.1.0 or newer.
* [#582](https://github.com/shlinkio/shlink-web-client/issues/582) Improved filtering short URLs by tag.

  Now, a new full tags selector component is available, which allows selecting any of the existing tags and also composes a toggle to filter by "any" tag or "all" tags.

### Changed
* [#616](https://github.com/shlinkio/shlink-web-client/issues/616) Updated to React 18.
* [#595](https://github.com/shlinkio/shlink-web-client/issues/595) Updated to react-chartjs-2 v4.1.0.
* [#594](https://github.com/shlinkio/shlink-web-client/issues/594) Updated to a new coding standard.
* [#627](https://github.com/shlinkio/shlink-web-client/issues/627) Updated to Jest 28.
* [#603](https://github.com/shlinkio/shlink-web-client/issues/603) Migrated to new and maintained dependencies to parse CSV<->JSON.
* [#610](https://github.com/shlinkio/shlink-web-client/issues/610) Migrated to a maintained coding style for CSS.
* [#619](https://github.com/shlinkio/shlink-web-client/issues/619) Introduced react testing library, to progressively replace enzyme.

### Deprecated
* *Nothing*

### Removed
* [#623](https://github.com/shlinkio/shlink-web-client/issues/623) Dropped support for Shlink older than 2.6.0.

### Fixed
* *Nothing*


## [3.6.0] - 2022-03-17
### Added
* [#558](https://github.com/shlinkio/shlink-web-client/issues/558) Added dark text for tags where the generated background is too light, improving its legibility.
* [#570](https://github.com/shlinkio/shlink-web-client/issues/570) Added new section to load non-orphan visits all together when consuming Shlink 3.0.0.
* [#556](https://github.com/shlinkio/shlink-web-client/issues/556) Added support to filter short URLs list by "all" tags when consuming Shlink 3.0.0.
* [#549](https://github.com/shlinkio/shlink-web-client/issues/549) Allowed to export the list of short URLs as CSV.

### Changed
* [#543](https://github.com/shlinkio/shlink-web-client/issues/543) Redesigned settings section.
* [#567](https://github.com/shlinkio/shlink-web-client/issues/567) Improved Shlink 3.0.0 compatibility by checking the `INVALID_SHORT_URL_DELETION` error code when deleting short URLs.
* [#448](https://github.com/shlinkio/shlink-web-client/issues/448) Updated to bootstrap v5.
* [#524](https://github.com/shlinkio/shlink-web-client/issues/524) Updated to react-router v6.
* [#576](https://github.com/shlinkio/shlink-web-client/issues/576) Updated to fontawesome v6.
* [#579](https://github.com/shlinkio/shlink-web-client/issues/579) Replaced react-color with react-colorful.
* [#564](https://github.com/shlinkio/shlink-web-client/issues/564) Updated most of the dependencies.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#589](https://github.com/shlinkio/shlink-web-client/issues/589) Fixed alignment of shlink versions footer, by basing the logic on the presence of the sidebar instead of selected server.


## [3.5.1] - 2022-01-08
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#555](https://github.com/shlinkio/shlink-web-client/issues/555) Fixed vertical alignment in welcome screen logo.
* [#554](https://github.com/shlinkio/shlink-web-client/issues/554) Fixed behavior in overview page, where items in the list of short URLs were stripped out when creating new ones, even if the amount of short URLs was still not yet big enough.
* [#557](https://github.com/shlinkio/shlink-web-client/issues/557) Fixed new tags added to new short URLs, not appearing on tags autosuggest.


## [3.5.0] - 2022-01-01
### Added
* [#407](https://github.com/shlinkio/shlink-web-client/issues/407) Improved how visits (short URLs, tags and orphan) are loaded, to avoid ending up in a page with "There are no visits matching current filter".

    Now, the app will try to load visits for the configured default interval, and in parallel, it will load the latest visit.

    If the resulting list for that interval is empty, it will try to infer the closest interval with visits, based on the latest visit's date, and reload visits for that interval.

* [#547](https://github.com/shlinkio/shlink-web-client/issues/547) Improved domains page, to tell which of the domains are not properly configured.

    Now, when this section is loaded, it tries to call the `GET /rest/health` endpoint for each one of the domains, and displays a warning icon on each one that failed.

    The warning includes a link to the documentation, explaining what are the steps to get it fixed.

* [#506](https://github.com/shlinkio/shlink-web-client/issues/506) Improved how servers are handled, displaying a warning when creating or importing servers that already exist.
* [#535](https://github.com/shlinkio/shlink-web-client/issues/535) Allowed editing default domain redirects when consuming Shlink 2.10 or newer.
* [#531](https://github.com/shlinkio/shlink-web-client/issues/531) Added custom slug field to the basic creation form in the Overview page.
* [#537](https://github.com/shlinkio/shlink-web-client/issues/537) Allowed to customize the ordering for every list in the app that supports it, being currently tags and short URLs.
* [#542](https://github.com/shlinkio/shlink-web-client/issues/542) Added ordering for short URLs to the query, so that it is consistent with the rest of the filtering params.

### Changed
* [#534](https://github.com/shlinkio/shlink-web-client/issues/534) Updated axios.
* [#538](https://github.com/shlinkio/shlink-web-client/issues/538) Switched to the `<field>-<dir>` notation in `orderBy` param for short URLs list, in preparation for Shlink v3.0.0

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* *Nothing*


## [3.4.2] - 2021-12-07
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#530](https://github.com/shlinkio/shlink-web-client/issues/530) Fixed crash on domains page when default domain has an explicitly set port.


## [3.4.1] - 2021-11-20
### Added
* [#525](https://github.com/shlinkio/shlink-web-client/issues/525) Added docs section for Architectural Decision Records, including the one for servers "auto-connect".

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#520](https://github.com/shlinkio/shlink-web-client/issues/520) Fixed landing page scroll on mobile devices and improved its design.
* [#526](https://github.com/shlinkio/shlink-web-client/issues/526) Ensured exported servers do not include the `autoConnect` prop.


## [3.4.0] - 2021-11-11
### Added
* [#496](https://github.com/shlinkio/shlink-web-client/issues/496) Allowed to select "all visits" as the default interval for visits.
* [#500](https://github.com/shlinkio/shlink-web-client/issues/500) Allowed to set the `forwardQuery` flag when creating/editing short URLs on a Shlink v2.9.0 server.
* [#508](https://github.com/shlinkio/shlink-web-client/issues/508) Added new servers management section.
* [#490](https://github.com/shlinkio/shlink-web-client/issues/490) Now a server can be marked as auto-connect, skipping home screen when that happens.
* [#492](https://github.com/shlinkio/shlink-web-client/issues/492) Improved tags table, by supporting sorting by column and making the header sticky.
* [#515](https://github.com/shlinkio/shlink-web-client/issues/515) Allowed to sort tags even when using the cards display mode.
* [#518](https://github.com/shlinkio/shlink-web-client/issues/518) Improved short URLs list filtering by moving selected tags, search text and dates to the query string, allowing to navigate back and forth or even bookmark filters.

### Changed
* Moved ci workflow to external repo and reused

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#252](https://github.com/shlinkio/shlink-web-client/issues/252) Fixed visits coming from mercure being added in real time, even when selected date interval does not match tha visit's date.
* [#48](https://github.com/shlinkio/shlink-web-client/issues/48) Fixed error when selected page gets out of range after filtering short URLs list by text, tags or dates. Now the page is reset to 1 in any of those cases.


## [3.3.2] - 2021-10-17
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#503](https://github.com/shlinkio/shlink-web-client/issues/503) Fixed short URLs title not being resettable after creation.


## [3.3.1] - 2021-09-27
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#497](https://github.com/shlinkio/shlink-web-client/issues/497) Fixed crash in domains section when one of the domains have more than one dot.


## [3.3.0] - 2021-09-25
### Added
* [#465](https://github.com/shlinkio/shlink-web-client/issues/465) Added new page to manage domains and their redirects, when consuming Shlink 2.8 or higher.
* [#460](https://github.com/shlinkio/shlink-web-client/issues/460) Added dynamic title on hover for tags with a very long title.
* [#462](https://github.com/shlinkio/shlink-web-client/issues/462) Now it is possible to paste multiple comma-separated tags in the tags selector, making all of them to be added as individual tags.
* [#463](https://github.com/shlinkio/shlink-web-client/issues/463) The strategy to determine which tags to suggest in the TagsSelector during short URL creation, can now be configured:

  * `startsWith`: Suggests tags that start with the input. This is the default behavior for keep it as it was so far.
  * `includes`: Suggests tags that contain the input.

* [#464](https://github.com/shlinkio/shlink-web-client/issues/464) Added support to download QR codes. This feature requires an unreleased version of Shlink, so it comes disabled, and will get enabled as soon as Shlink v2.9 is released.
* [#469](https://github.com/shlinkio/shlink-web-client/issues/469) Added support `errorCorrection` in QR codes, when consuming Shlink 2.8 or higher.
* [#459](https://github.com/shlinkio/shlink-web-client/issues/459) Added new list mode to display tags.

  The mode is optional, and you can toggle between the classic cards mode or the new list mode whenever you want.

  You can also configure the default mode from settings.

### Changed
* [#408](https://github.com/shlinkio/shlink-web-client/issues/408) Updated to Chart.js 3.5
* [#486](https://github.com/shlinkio/shlink-web-client/issues/486) Refactored components used to render visits charts, making them easier to maintain and understand.
* [#409](https://github.com/shlinkio/shlink-web-client/issues/409) Increased required code coverage and added hard threshold check.

### Deprecated
* *Nothing*

### Removed
* [#491](https://github.com/shlinkio/shlink-web-client/issues/491) Dropped support for Shlink older than v2.4.0.

### Fixed
* *Nothing*


## [3.2.1] - 2021-09-12
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#478](https://github.com/shlinkio/shlink-web-client/issues/478) Fixed tags including special chars not being properly URL encoded before using them as query params.
* [#480](https://github.com/shlinkio/shlink-web-client/issues/480) Fixed servers import on Chromium-based browsers when using windows.
* [#482](https://github.com/shlinkio/shlink-web-client/issues/480) Fixed end date not being set to the end of the day when filtering visits using a "smart filter" (last 7 days, last 30 days, etc).


## [3.2.0] - 2021-07-12
### Added
* [#433](https://github.com/shlinkio/shlink-web-client/pull/433) Added support to provide a default server to connect to via env vars:

    * `SHLINK_SERVER_URL`: The URL of the Shlink server to configure by default.
    * `SHLINK_SERVER_API_KEY`: The API key of the Shlink server.
    * `SHLINK_SERVER_NAME`: A name you want to give to this server. Defaults to *Shlink* if not provided.

* [#432](https://github.com/shlinkio/shlink-web-client/pull/432) Added support to provide the `servers.json` file inside a `conf.d` folder.
* [#440](https://github.com/shlinkio/shlink-web-client/issues/440) Added hint of what visits come potentially from a bot, in the visits table, when consuming Shlink >=2.7.
* [#431](https://github.com/shlinkio/shlink-web-client/issues/431) Added support to filter out visits from potential bots in visits sections, when consuming Shlink >=2.7.
* [#430](https://github.com/shlinkio/shlink-web-client/issues/430) Added support to set new and existing short URLs as crawlable, when consuming Shlink >=2.7.
* [#450](https://github.com/shlinkio/shlink-web-client/issues/450) Improved landing page design.
* [#449](https://github.com/shlinkio/shlink-web-client/issues/449) Improved PWA update banner, allowing to restart the app directly from it without having to close the tab.

### Changed
* [#442](https://github.com/shlinkio/shlink-web-client/issues/442) Visits filtering now goes through the corresponding reducer.
* [#337](https://github.com/shlinkio/shlink-web-client/issues/337) Replaced moment.js with date-fns.
* [#360](https://github.com/shlinkio/shlink-web-client/issues/360) Changed component used to generate a tags selector, switching from `react-tagsinput`, which is no longer maintained, to `react-tag-autocomplete`.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#438](https://github.com/shlinkio/shlink-web-client/issues/438) Fixed horizontal scrolling in short URLs list on mobile devices when the long URL didn't have words to break.


## [3.1.2] - 2021-06-06
### Added
* *Nothing*

### Changed
* [#428](https://github.com/shlinkio/shlink-web-client/issues/428) Updated to StrykerJS 5.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#371](https://github.com/shlinkio/shlink-web-client/issues/371) Recovered PWA functionality.


## [3.1.1] - 2021-05-08
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#413](https://github.com/shlinkio/shlink-web-client/issues/413) Fixed edit short URL form reflecting outdated info after navigating back from other section.
* [#412](https://github.com/shlinkio/shlink-web-client/issues/412) Ensured new visits coming from mercure hub are prepended and not appended, to keep proper sorting.
* [#417](https://github.com/shlinkio/shlink-web-client/issues/417) Fixed link spanning out of QR code modal.
* [#411](https://github.com/shlinkio/shlink-web-client/issues/411) Added missing feedback when editing a short URL to know if everything went right.


## [3.1.0] - 2021-03-29
### Added
* [#379](https://github.com/shlinkio/shlink-web-client/issues/379) and [#384](https://github.com/shlinkio/shlink-web-client/issues/384) Improved QR code modal, including controls to customize size, format and margin, as well as a button to copy the link to the clipboard.
* [#385](https://github.com/shlinkio/shlink-web-client/issues/385) Added setting to determine if "validate URL" should be enabled or disabled by default.
* [#386](https://github.com/shlinkio/shlink-web-client/issues/386) Added new card in overview section to display amount of orphan visits when using Shlink 2.6.0 or higher.
* [#177](https://github.com/shlinkio/shlink-web-client/issues/177) Added dark theme.
* [#387](https://github.com/shlinkio/shlink-web-client/issues/387) and [#395](https://github.com/shlinkio/shlink-web-client/issues/395) Added a section to see orphan visits stats, when consuming Shlink >=2.6.0.
* [#383](https://github.com/shlinkio/shlink-web-client/issues/383) Added title to short URLs list, displayed when consuming Shlink >=2.6.0.
* [#368](https://github.com/shlinkio/shlink-web-client/issues/368) Added new settings to define the default interval for visits pages.
* [#349](https://github.com/shlinkio/shlink-web-client/issues/349) Added support to export visits to CSV.
* [#397](https://github.com/shlinkio/shlink-web-client/issues/397) New section to edit all data for short URLs, including title when using Shlink v2.6 or newer.

  This new section replaces the old modals to edit short URL meta, short URL tags and the long URL. Everything is now together in the same section.

### Changed
* [#382](https://github.com/shlinkio/shlink-web-client/issues/382) Ensured short URL tags are edited through the `PATCH /short-urls/{shortCode}` endpoint when using Shlink 2.6.0 or higher.
* [#398](https://github.com/shlinkio/shlink-web-client/issues/398) Improved performance when loading short URL details by avoiding API calls if the short URL is already present in local state.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#335](https://github.com/shlinkio/shlink-web-client/issues/335) Fixed linting errors.


## [3.0.1] - 2020-12-30
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#364](https://github.com/shlinkio/shlink-web-client/issues/364) Fixed all dropdowns so that they are consistently styled.
* [#366](https://github.com/shlinkio/shlink-web-client/issues/366) Fixed text in visits menu jumping to next line in some tablet resolutions.
* [#367](https://github.com/shlinkio/shlink-web-client/issues/367) Removed conflicting overflow in visits table for mobile devices.
* [#365](https://github.com/shlinkio/shlink-web-client/issues/365) Fixed weird rendering of short URLs list in tablets.
* [#372](https://github.com/shlinkio/shlink-web-client/issues/372) Fixed importing servers in Android devices.


## [3.0.0] - 2020-12-22
### Added
* [#340](https://github.com/shlinkio/shlink-web-client/issues/340) Added new "overview" page, showing basic information of the active server.

    As a side effect, it also introduces improvements in the "create short URL" page, grouping components by context and explaining what they are for.

* [#309](https://github.com/shlinkio/shlink-web-client/issues/309) Added new domain selector component in create URL form which allows selecting from previously used domains or set a new one.
* [#315](https://github.com/shlinkio/shlink-web-client/issues/315) Now you can tell if you want to validate the long URL when using Shlink >=2.4.
* [#285](https://github.com/shlinkio/shlink-web-client/issues/285) Improved visits section:

    * Charts are now grouped in tabs, so that only one part of the components is rendered at a time.
    * Amount of highlighted visits is now displayed.
    * Date filtering can be now selected through relative times (last 7 days, last 30 days, etc) or absolute dates using date pickers.
    * Only the visits for last 30 days are loaded by default. You can change that at any moment if required.

* [#355](https://github.com/shlinkio/shlink-web-client/issues/355) Improved home page, fixing also its scrolling behavior for mobile devices.

### Changed
* [#267](https://github.com/shlinkio/shlink-web-client/issues/267) Added some subtle but important improvements on UI/UX.
* [#352](https://github.com/shlinkio/shlink-web-client/issues/352) Moved from Scrutinizer to Codecov as the code coverage backend.
* [#217](https://github.com/shlinkio/shlink-web-client/issues/217) Improved how messages are displayed, by centralizing it in the `Message` and `Result` components.
* [#219](https://github.com/shlinkio/shlink-web-client/issues/219) Improved error messages when something fails while interacting with Shlink's API.

### Deprecated
* *Nothing*

### Removed
* [#344](https://github.com/shlinkio/shlink-web-client/issues/344) Dropped support for Shlink v1.

### Fixed
* *Nothing*


## [2.6.2] - 2020-11-14
### Added
* *Nothing*

### Changed
* [#325](https://github.com/shlinkio/shlink-web-client/issues/325) and [#294](https://github.com/shlinkio/shlink-web-client/issues/294) Updated all dependencies, including React 17, Typescript 4, react-datepicker 3 and Stryker 4.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#334](https://github.com/shlinkio/shlink-web-client/issues/334) Fixed color-picker making the app crash when closing the modal without closing the color-picker, and then trying to open the modal again.
* [#333](https://github.com/shlinkio/shlink-web-client/issues/333) Fixed visits getting accumulated every time the visits page is opened.


## [2.6.1] - 2020-10-31
### Added
* *Nothing*

### Changed
* [#292](https://github.com/shlinkio/shlink-web-client/issues/292) Improved a bit how caching works by removing the service worker and adding proper HTTP caching config on nginx inside docker image.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#316](https://github.com/shlinkio/shlink-web-client/issues/316) Fixed manifest.json file not getting downloaded after passing credentials when the app is protected with basic auth.
* [#311](https://github.com/shlinkio/shlink-web-client/issues/311) Fixed datepicker showing below other components.
* [#306](https://github.com/shlinkio/shlink-web-client/issues/306) Fixed multi-arch docker builds by replacing node-sass with dart-sass.
* [#328](https://github.com/shlinkio/shlink-web-client/issues/328) Fixed toggle switches getting broken in mobile resolutions.


## [2.6.0] - 2020-09-20
### Added
* [#289](https://github.com/shlinkio/shlink-web-client/issues/289) Client and server version constraints are now links to the corresponding project release notes.
* [#293](https://github.com/shlinkio/shlink-web-client/issues/293) Shlink versions are now always displayed in footer, hiding the server version when there's no connected server.
* [#250](https://github.com/shlinkio/shlink-web-client/issues/250) Added support to group real time updates in fixed intervals.

    The settings page now allows to provide the interval in which the UI should get updated, making that happen at once, with all the updates that have happened during that interval.

    By default updates are immediately applied if real-time updates are enabled, to keep the behavior as it was.

* [#277](https://github.com/shlinkio/shlink-web-client/issues/277) Added highlighting capabilities to the visits line chart.

### Changed
* [#150](https://github.com/shlinkio/shlink-web-client/issues/150) The list of short URLs is now ordered by the creation date, showing newest results first.
* [#248](https://github.com/shlinkio/shlink-web-client/issues/248) Numbers displayed application-wide are now prettified.
* [#40](https://github.com/shlinkio/shlink-web-client/issues/40) Migrated project to TypeScript.
* [#297](https://github.com/shlinkio/shlink-web-client/issues/297) Moved docker image building to github actions.
* [#305](https://github.com/shlinkio/shlink-web-client/issues/305) Split travis build so that every step is run in a parallel job.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#295](https://github.com/shlinkio/shlink-web-client/issues/295) Fixed custom slug field not being disabled when selecting a short code length.
* [#301](https://github.com/shlinkio/shlink-web-client/issues/301) Fixed tags visits loading not being cancelled when leaving visits page.


## [2.5.1] - 2020-06-06
### Added
* *Nothing*

### Changed
* [#254](https://github.com/shlinkio/shlink-web-client/issues/254) Reduced duplication on code to handle mercure topics binding.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#276](https://github.com/shlinkio/shlink-web-client/issues/276) Fixed default grouping used for visits line chart, making it be dynamic depending on how old the short URL is.
* [#280](https://github.com/shlinkio/shlink-web-client/issues/280) Fixed shlink-web-client version not being properly passed when building stable tags of the docker image.
* [#269](https://github.com/shlinkio/shlink-web-client/issues/269) Fixed doughnut chart legends getting to big and hiding charts on mobile devices.


## [2.5.0] - 2020-05-31
### Added
* [#148](https://github.com/shlinkio/shlink-web-client/issues/148) Added support for real-time updates when consuming a Shlink version that is integrated with a mercure hub server.

    The integration is transparent. When a server is opened, shlink-web-client will try to get the mercure info from it.

    * If it works, it will setup the necessary `EventSource`s, dispatching redux actions when an event is pushed, which will in turn update the UI.
    * If it fails, it will assume it is either not configured or not supported by the Shlink version.

* [#265](https://github.com/shlinkio/shlink-web-client/issues/265) Updated tags section to allow displaying number of short URLs using every tag and number of visits for all short URLs using the tag.

    This will work only when using Shlink v2.2.0 or above. For previous versions, the tags page will continue behaving the same.

* [#261](https://github.com/shlinkio/shlink-web-client/issues/261) Added new page to show visit stats by tag.

    This new page will return a "not found" error when the server is lower than v2.2.0, as older versions do not support fetching stats by tag.

* [#253](https://github.com/shlinkio/shlink-web-client/issues/253) Created new settings page that will be used to define customizations in the app.

* [#149](https://github.com/shlinkio/shlink-web-client/issues/149) and [#198](https://github.com/shlinkio/shlink-web-client/issues/198) Added new line chart to visits and tags stats which displays amount of visits during selected time period, grouped by month, week, day or hour.

### Changed
* [#218](https://github.com/shlinkio/shlink-web-client/issues/218) Added back button to sections not displayed in left menu.
* [#255](https://github.com/shlinkio/shlink-web-client/issues/255) Improved how servers and settings are persisted in the local storage.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#262](https://github.com/shlinkio/shlink-web-client/issues/262) Fixed charts displaying decimal numbers, when visits are absolute and that makes no sense.


## [2.4.0] - 2020-04-10
### Added
* [#199](https://github.com/shlinkio/shlink-web-client/issues/199) Added table to visits page which displays the information in a paginated, sortable and filterable list.

    It also supports selecting multiple visits in the table which makes the corresponding data to be highlighted in the visits charts.

* [#241](https://github.com/shlinkio/shlink-web-client/issues/241) Added support to select charts bars in order to highlight related stats in other charts.

    It also selects the visits in the new table, and you can even combine a selection in the chart and in the table.

* [#213](https://github.com/shlinkio/shlink-web-client/issues/213) The versions of both shlink-web-client and currently consumed Shlink server are now displayed in the footer.
* [#221](https://github.com/shlinkio/shlink-web-client/issues/221) Improved how servers are handled, displaying meaningful errors when a not-found or a not-reachable server is tried to be loaded.
* [#226](https://github.com/shlinkio/shlink-web-client/issues/226) Created servers can now be edited.
* [#234](https://github.com/shlinkio/shlink-web-client/issues/234) Allowed short code length to be edited on any new short URL when using Shlink 2.1 or higher.
* [#235](https://github.com/shlinkio/shlink-web-client/issues/235) Allowed editing the long URL for any existing short URL when suing Shlink 2.1 or higher.

### Changed
* [#205](https://github.com/shlinkio/shlink-web-client/issues/205) Replaced `jest-each` package by jet's native `test.each` function.
* [#209](https://github.com/shlinkio/shlink-web-client/issues/209) Replaced `Unknown` by `Direct` for visits from undetermined referrers.
* [#212](https://github.com/shlinkio/shlink-web-client/issues/212) Moved copy-to-clipboard next to short URL.
* [#208](https://github.com/shlinkio/shlink-web-client/issues/208) Short URLs list paginator is now progressive.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#243](https://github.com/shlinkio/shlink-web-client/issues/243) Fixed loading state and resetting on short URL creation form.
* [#239](https://github.com/shlinkio/shlink-web-client/issues/239) Fixed how user agents are parsed, reducing false results.


## [2.3.1] - 2020-02-08
### Added
* *Nothing*

### Changed
* [#191](https://github.com/shlinkio/shlink-web-client/issues/191) Created `ForServerVersion` helper component which dynamically renders children if current server conditions are met.
* [#189](https://github.com/shlinkio/shlink-web-client/issues/189) Simplified short url tags and short url deletion components and reducers, by removing redundant actions.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#193](https://github.com/shlinkio/shlink-web-client/issues/193) Fixed `maxVisits` being set to 0 when trying to reset it from having a value to `null`.
* [#196](https://github.com/shlinkio/shlink-web-client/issues/196) Included apache `.htaccess` file which takes care of falling back to index.html when reloading the page on a client-side handled route.
* [#179](https://github.com/shlinkio/shlink-web-client/issues/179) Ensured domain is provided to Shlink server when editing, deleting or fetching short URLs which do not belong to default domain.
* [#202](https://github.com/shlinkio/shlink-web-client/issues/202) Fixed domain not passed when dispatching actions that affect a single short URL (edit tags, edit meta and delete), which cased the list not to be properly updated.


## [2.3.0] - 2020-01-19
### Added
* [#174](https://github.com/shlinkio/shlink-web-client/issues/174) Added complete support for Shlink v2.x together with currently supported Shlink versions.
* [#164](https://github.com/shlinkio/shlink-web-client/issues/164) Added max visits control on those URLs which have `maxVisits`.
* [#178](https://github.com/shlinkio/shlink-web-client/issues/178) Short URLs list can now be filtered by date range.
* [#46](https://github.com/shlinkio/shlink-web-client/issues/46) Allowed short URL's metadata to be edited (`maxVisits`, `validSince` and `validUntil`).

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#170](https://github.com/shlinkio/shlink-web-client/issues/170) Fixed apple icon referencing to incorrect file names.


## [2.2.2] - 2019-10-21
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#167](https://github.com/shlinkio/shlink-web-client/issues/167) Fixed `/servers.json` path not being ignored when returning something other than an array.


## [2.2.1] - 2019-10-18
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#165](https://github.com/shlinkio/shlink-web-client/issues/165) Fixed error thrown when opening "create" page while using a Shlink version which does not return a valid SemVer version (like `latest` docker image, or any development instance).


## [2.2.0] - 2019-10-05
### Added
* [#144](https://github.com/shlinkio/shlink-web-client/issues/144) Added domain input to create domain page.

### Changed
* [#140](https://github.com/shlinkio/shlink-web-client/issues/140) Updated project dependencies.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* *Nothing*


## [2.1.1] - 2019-09-22
### Added
* *Nothing*

### Changed
* [#142](https://github.com/shlinkio/shlink-web-client/issues/142) Updated to newer versions of base docker images for dev and production.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#151](https://github.com/shlinkio/shlink-web-client/issues/151) Fixed "order by" indicator (caret) still indicate ASC on column header when no order is specified.
* [#157](https://github.com/shlinkio/shlink-web-client/issues/157) Fixed pagination control on graphs expanding too much when lots of pages need to be rendered.
* [#155](https://github.com/shlinkio/shlink-web-client/issues/155) Fixed client-side paths resolve to 404 when served from nginx in docker image instead of falling back to `index.html`.


## [2.1.0] - 2019-05-19
### Added
* [#101](https://github.com/shlinkio/shlink-web-client/issues/101) Added checkbox to short URL creation form that allows to determine the value of the `findIfExists` flag introduced in Shlink v1.16.0.
* [#105](https://github.com/shlinkio/shlink-web-client/issues/105) Added support to pre-configure servers. See [how to pre-configure servers](README.md#pre-configuring-servers) to get more details on how to do it.

### Changed
* [#125](https://github.com/shlinkio/shlink-web-client/issues/125) Refactored reducers to replace `switch` statements by `handleActions` from [redux-actions](https://github.com/redux-utilities/redux-actions).
* [#116](https://github.com/shlinkio/shlink-web-client/issues/116) Removed sinon in favor of jest mocks.
* [#72](https://github.com/shlinkio/shlink-web-client/issues/72) Increased code coverage up to 80%.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* *Nothing*


## [2.0.3] - 2019-03-16
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#120](https://github.com/shlinkio/shlink-web-client/issues/120) Fixed crash when visits page is loaded and there are no visits with known cities.
* [#113](https://github.com/shlinkio/shlink-web-client/issues/113) Ensured visits loading is cancelled when the visits page is unmounted. Requests on flight will still finish.
* [#118](https://github.com/shlinkio/shlink-web-client/issues/118) Fixed chart crashing when trying to render lots of bars by adding pagination.


## [2.0.2] - 2019-03-04
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#103](https://github.com/shlinkio/shlink-web-client/issues/103) Fixed visits page getting freezed when loading large amounts of visits.
* [#111](https://github.com/shlinkio/shlink-web-client/issues/111) Fixed crash when trying to load a map modal with only one location.
* [#115](https://github.com/shlinkio/shlink-web-client/issues/115) Created `ErrorHandler` component which will prevent crashes in app to make it unusable.


## [2.0.1] - 2019-03-03
### Added
* *Nothing*

### Changed
* [#106](https://github.com/shlinkio/shlink-web-client/issues/106) Reduced size of docker image by using a multi-stage build Dockerfile.
* [#95](https://github.com/shlinkio/shlink-web-client/issues/95) Tested docker image build during travis executions.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#104](https://github.com/shlinkio/shlink-web-client/issues/104) Fixed blank page being showed when not-found paths are loaded.
* [#94](https://github.com/shlinkio/shlink-web-client/issues/94) Fixed initial zoom and center on maps.
* [#93](https://github.com/shlinkio/shlink-web-client/issues/93) Prevented side menu to be swipeable while a modal window is displayed.


## [2.0.0] - 2019-01-13
### Added
* [#54](https://github.com/shlinkio/shlink-web-client/issues/54) Added stats by city graphic in visits page.
* [#55](https://github.com/shlinkio/shlink-web-client/issues/55) Added map in visits page locating cities from which visits have occurred.

### Changed
* [#87](https://github.com/shlinkio/shlink-web-client/issues/87) and [#89](https://github.com/shlinkio/shlink-web-client/issues/89) Updated all dependencies to latest major versions.
* [#96](https://github.com/shlinkio/shlink-web-client/issues/96) Updated visits page to load visits in multiple paginated requests of `5000` visits when used shlink server supports it. This will prevent shlink to hang when trying to load big amounts of visits.
* [#71](https://github.com/shlinkio/shlink-web-client/issues/71) Improved tests and increased code coverage.

### Deprecated
* *Nothing*

### Removed
* [#59](https://github.com/shlinkio/shlink-web-client/issues/59) Dropped support for old browsers. Internet explorer and dead browsers are no longer supported.
* [#97](https://github.com/shlinkio/shlink-web-client/issues/97) Dropped support for authentication via `Authorization` header with Bearer type and JWT, which will make this version no longer work with shlink earlier than v1.13.0.

### Fixed
* *Nothing*


## [1.2.1] - 2018-12-21
### Added
* *Nothing*

### Changed
* [#80](https://github.com/shlinkio/shlink-web-client/issues/80) Deeply refactored app to do true dependency injection with an IoC container.
* [#79](https://github.com/shlinkio/shlink-web-client/issues/79) Updated to nginx 1.15.7 as the base docker image.
* [#75](https://github.com/shlinkio/shlink-web-client/issues/75) Prevented duplicated `yarn build` in travis when a tag exists.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#77](https://github.com/shlinkio/shlink-web-client/issues/77) Sortable graphs ordering is now case insensitive.


## [1.2.0] - 2018-11-01
### Added
* [#65](https://github.com/shlinkio/shlink-web-client/issues/65) Added sorting to both countries and referrers stats graphs.
* [#14](https://github.com/shlinkio/shlink-web-client/issues/14) Documented how to build the project so that it can be served from a subpath.

### Changed
* [#50](https://github.com/shlinkio/shlink-web-client/issues/50) Improved tests and increased code coverage.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#66](https://github.com/shlinkio/shlink-web-client/issues/66) Fixed tooltips in graphs with too small bars not being displayed.


## [1.1.1] - 2018-10-20
### Added
* [#57](https://github.com/shlinkio/shlink-web-client/issues/57) Automated release generation in travis build.

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#63](https://github.com/shlinkio/shlink-web-client/issues/63) Improved how bar charts are rendered in stats page, making them try to calculate a bigger height for big data sets.
* [#56](https://github.com/shlinkio/shlink-web-client/issues/56) Ensured `ColorGenerator` matches keys in a case insensitive way.
* [#53](https://github.com/shlinkio/shlink-web-client/issues/53) Fixed missing margin between date fields in visits page for mobile devices.


## [1.1.0] - 2018-09-16
### Added
* [#47](https://github.com/shlinkio/shlink-web-client/issues/47) Added support to delete short URLs (requires [shlink v1.12.0](https://github.com/shlinkio/shlink/releases/tag/v1.12.0) or greater).

### Changed
* [#35](https://github.com/shlinkio/shlink-web-client/issues/35) Visits component split into two, which makes the header not to be refreshed when filtering by date, and also the visits global counter now reflects the actual number of visits which fulfill current filter.
* [#36](https://github.com/shlinkio/shlink-web-client/issues/36) Tags selector now autocompletes existing tag names, to prevent typos and ease reusing existing tags.
* [#39](https://github.com/shlinkio/shlink-web-client/issues/39) Defined `propTypes` as static properties in class components.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#49](https://github.com/shlinkio/shlink-web-client/issues/49) Ensured filtering parameters are reseted when list component is unmounted so that params are not mixed when coming back.
* [#45](https://github.com/shlinkio/shlink-web-client/issues/45) Ensured graphs x-axis start at `0` and don't use decimals.
* [#51](https://github.com/shlinkio/shlink-web-client/issues/51) When editing short URL tags, the value returned form server is used when refreshing the list, which is normalized.


## [1.0.1] - 2018-09-02
### Added
* *Nothing*

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#42](https://github.com/shlinkio/shlink-web-client/issues/42) Fixed selected tags lost when navigating between pages in short URLs list.
* [#43](https://github.com/shlinkio/shlink-web-client/issues/43) Fixed "List short URLs" menu item only selected when in first page.


## [1.0.0] - 2018-08-26
### Added
* [#4](https://github.com/shlinkio/shlink-web-client/issues/4) Now it is possible to export and import servers.

    * Export all servers in a CSV file.
    * Import the CSV in a different device.

* [#3](https://github.com/shlinkio/shlink-web-client/issues/3) Added tags management.

    * List existing tags, and filter the list.
    * Change their name and color.
    * Jump to URLs list filtering by one tag.

* [#5](https://github.com/shlinkio/shlink-web-client/issues/5) Tags for existing URLs can be edited now.
* [#24](https://github.com/shlinkio/shlink-web-client/issues/24) Improved left menu in mobile devices, which is now a swipeable sidebar instead of a stacked top bar.
* [#22](https://github.com/shlinkio/shlink-web-client/issues/22) Improved code coverage.
* [#28](https://github.com/shlinkio/shlink-web-client/issues/28) Added integration with [Scrutinizer](https://scrutinizer-ci.com/g/shlinkio/shlink-web-client/).

### Changed
* [#33](https://github.com/shlinkio/shlink-web-client/issues/33) Changed to [adidas coding style](https://github.com/adidas/js-linter-configs) for Javascript.
* [#32](https://github.com/shlinkio/shlink-web-client/issues/32) Changed to [adidas coding style](https://github.com/adidas/js-linter-configs) for stylesheets.
* [#26](https://github.com/shlinkio/shlink-web-client/issues/26) The tags input now displays tags using their actual color.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* *Nothing*


## [0.2.0] - 2018-08-12
### Added
* [#12](https://github.com/shlinkio/shlink-web-client/issues/12) Improved code coverage
* [#20](https://github.com/shlinkio/shlink-web-client/issues/20) Added servers list in welcome page, as well as added link to create one when none exist.

### Changed
* [#11](https://github.com/shlinkio/shlink-web-client/issues/11) Improved app icons fro progressive web apps.

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* [#19](https://github.com/shlinkio/shlink-web-client/issues/19) Added workaround in tags input so that it is possible to add tags on Android devices.
* [#17](https://github.com/shlinkio/shlink-web-client/issues/17) Fixed short URLs list not being sortable in mobile resolutions.
* [#13](https://github.com/shlinkio/shlink-web-client/issues/13) Improved visits page on mobile resolutions.


## [0.1.1] - 2018-08-06
### Added
* [#15](https://github.com/shlinkio/shlink-web-client/issues/15) Added a `Dockerfile` that can be used to generate a distributable docker image

### Changed
* *Nothing*

### Deprecated
* *Nothing*

### Removed
* *Nothing*

### Fixed
* *Nothing*
