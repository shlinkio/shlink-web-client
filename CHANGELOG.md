# CHANGELOG

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
