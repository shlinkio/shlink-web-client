# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

#### Added

* [#54](https://github.com/shlinkio/shlink-web-client/issues/54) Added stats by city graphic in visits page.
* [#55](https://github.com/shlinkio/shlink-web-client/issues/55) Added map in visits page locating cities from which visits have occurred.

#### Changed

* [#87](https://github.com/shlinkio/shlink-web-client/issues/87) and [#89](https://github.com/shlinkio/shlink-web-client/issues/89) Updated all dependencies to latest major versions.

#### Deprecated

* *Nothing*

#### Removed

* [#59](https://github.com/shlinkio/shlink-web-client/issues/59) Dropped support for old browsers. Internet explorer and dead browsers are no longer supported.

#### Fixed

* *Nothing*


## 1.2.1 - 2018-12-21

#### Added

* *Nothing*

#### Changed

* [#80](https://github.com/shlinkio/shlink-web-client/issues/80) Deeply refactored app to do true dependency injection with an IoC container.
* [#79](https://github.com/shlinkio/shlink-web-client/issues/79) Updated to nginx 1.15.7 as the base docker image.
* [#75](https://github.com/shlinkio/shlink-web-client/issues/75) Prevented duplicated `yarn build` in travis when a tag exists.

#### Deprecated

* *Nothing*

#### Removed

* *Nothing*

#### Fixed

* [#77](https://github.com/shlinkio/shlink-web-client/issues/77) Sortable graphs ordering is now case insensitive.


## 1.2.0 - 2018-11-01

#### Added

* [#65](https://github.com/shlinkio/shlink-web-client/issues/65) Added sorting to both countries and referrers stats graphs.
* [#14](https://github.com/shlinkio/shlink-web-client/issues/14) Documented how to build the project so that it can be served from a subpath.

#### Changed

* [#50](https://github.com/shlinkio/shlink-web-client/issues/50) Improved tests and increased code coverage.

#### Deprecated

* *Nothing*

#### Removed

* *Nothing*

#### Fixed

* [#66](https://github.com/shlinkio/shlink-web-client/issues/66) Fixed tooltips in graphs with too small bars not being displayed.


## 1.1.1 - 2018-10-20

#### Added

* [#57](https://github.com/shlinkio/shlink-web-client/issues/57) Automated release generation in travis build.

#### Changed

* *Nothing*

#### Deprecated

* *Nothing*

#### Removed

* *Nothing*

#### Fixed

* [#63](https://github.com/shlinkio/shlink-web-client/issues/63) Improved how bar charts are rendered in stats page, making them try to calculate a bigger height for big data sets.
* [#56](https://github.com/shlinkio/shlink-web-client/issues/56) Ensured `ColorGenerator` matches keys in a case insensitive way.
* [#53](https://github.com/shlinkio/shlink-web-client/issues/53) Fixed missing margin between date fields in visits page for mobile devices.


## 1.1.0 - 2018-09-16

#### Added

* [#47](https://github.com/shlinkio/shlink-web-client/issues/47) Added support to delete short URLs (requires [shlink v1.12.0](https://github.com/shlinkio/shlink/releases/tag/v1.12.0) or greater).

#### Changed

* [#35](https://github.com/shlinkio/shlink-web-client/issues/35) Visits component split into two, which makes the header not to be refreshed when filtering by date, and also the visits global counter now reflects the actual number of visits which fulfill current filter.
* [#36](https://github.com/shlinkio/shlink-web-client/issues/36) Tags selector now autocompletes existing tag names, to prevent typos and ease reusing existing tags.
* [#39](https://github.com/shlinkio/shlink-web-client/issues/39) Defined `propTypes` as static properties in class components.

#### Deprecated

* *Nothing*

#### Removed

* *Nothing*

#### Fixed

* [#49](https://github.com/shlinkio/shlink-web-client/issues/49) Ensured filtering parameters are reseted when list component is unmounted so that params are not mixed when coming back.
* [#45](https://github.com/shlinkio/shlink-web-client/issues/45) Ensured graphs x-axis start at `0` and don't use decimals.
* [#51](https://github.com/shlinkio/shlink-web-client/issues/51) When editing short URL tags, the value returned form server is used when refreshing the list, which is normalized.


## 1.0.1 - 2018-09-02

#### Added

* *Nothing*

#### Changed

* *Nothing*

#### Deprecated

* *Nothing*

#### Removed

* *Nothing*

#### Fixed

* [#42](https://github.com/shlinkio/shlink-web-client/issues/42) Fixed selected tags lost when navigating between pages in short URLs list.
* [#43](https://github.com/shlinkio/shlink-web-client/issues/43) Fixed "List short URLs" menu item only selected when in first page.


## 1.0.0 - 2018-08-26

#### Added

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

#### Changed

* [#33](https://github.com/shlinkio/shlink-web-client/issues/33) Changed to [adidas coding style](https://github.com/adidas/js-linter-configs) for Javascript.
* [#32](https://github.com/shlinkio/shlink-web-client/issues/32) Changed to [adidas coding style](https://github.com/adidas/js-linter-configs) for stylesheets.
* [#26](https://github.com/shlinkio/shlink-web-client/issues/26) The tags input now displays tags using their actual color.

#### Deprecated

* *Nothing*

#### Removed

* *Nothing*

#### Fixed

* *Nothing*


## 0.2.0 - 2018-08-12

#### Added

* [#12](https://github.com/shlinkio/shlink-web-client/issues/12) Improved code coverage
* [#20](https://github.com/shlinkio/shlink-web-client/issues/20) Added servers list in welcome page, as well as added link to create one when none exist.

#### Changed

* [#11](https://github.com/shlinkio/shlink-web-client/issues/11) Improved app icons fro progressive web apps.

#### Deprecated

* *Nothing*

#### Removed

* *Nothing*

#### Fixed

* [#19](https://github.com/shlinkio/shlink-web-client/issues/19) Added workaround in tags input so that it is possible to add tags on Android devices.
* [#17](https://github.com/shlinkio/shlink-web-client/issues/17) Fixed short URLs list not being sortable in mobile resolutions.
* [#13](https://github.com/shlinkio/shlink-web-client/issues/13) Improved visits page on mobile resolutions.


## 0.1.1 - 2018-08-06

#### Added

* [#15](https://github.com/shlinkio/shlink-web-client/issues/15) Added a `Dockerfile` that can be used to generate a distributable docker image

#### Changed

* *Nothing*

#### Deprecated

* *Nothing*

#### Removed

* *Nothing*

#### Fixed

* *Nothing*
