# shlink-web-client

[![Build Status](https://img.shields.io/travis/shlinkio/shlink-web-client.svg?style=flat-square)](https://travis-ci.org/shlinkio/shlink-web-client)
[![Code Coverage](https://img.shields.io/scrutinizer/coverage/g/shlinkio/shlink-web-client.svg?style=flat-square)](https://scrutinizer-ci.com/g/shlinkio/shlink-web-client/?branch=master)
[![Scrutinizer Code Quality](https://img.shields.io/scrutinizer/g/shlinkio/shlink-web-client.svg?style=flat-square)](https://scrutinizer-ci.com/g/shlinkio/shlink-web-client/?branch=master)
[![GitHub release](https://img.shields.io/github/release/shlinkio/shlink-web-client.svg?style=flat-square)](https://github.com/shlinkio/shlink-web-client/releases/latest)
[![GitHub license](https://img.shields.io/github/license/shlinkio/shlink-web-client.svg?style=flat-square)](https://github.com/shlinkio/shlink-web-client/blob/master/LICENSE)
[![Paypal Donate](https://img.shields.io/badge/Donate-paypal-blue.svg?style=flat-square&logo=paypal&colorA=cccccc)](https://acel.me/donate)

A ReactJS-based progressive web application for [Shlink](https://shlink.io).

## Installation

There are three ways in which you can use this application.

* The easiest way to use shlink-web-client is by just going to https://app.shlink.io.

    The application runs 100% in the browser, so you can use that instance and access any shlink instance from it.

* Self hosting the application yourself.

    Get the [latest release](https://github.com/shlinkio/shlink-web-client/releases/latest) and download the distributable zip file attached to it (`shlink-web-client_X.X.X_dist.zip`).

    The package contains static files only, so just put it in a folder and serve it with the web server of your choice.

    Provided dist files are configured to be served from the root of your domain. If you need to serve shlink-web-client from a subpath, you will have to build it yourself following [these simple steps](#serve-shlink-in-subpath).

* Use the official [docker image](https://hub.docker.com/r/shlinkio/shlink-web-client/)

    If you want to deploy shlink-web-client in a container-based cluster (kubernetes, docker swarm, etc), just pick the image and do it.

    It's a lightweight [nginx:alpine](https://hub.docker.com/r/library/nginx/) image serving the assets on port 80.

## Serve project in subpath

Official distributable files have been build so that they are served from the root of a domain.

If you need to host shlink-web-client yourself and serve it from a subpath, follow these steps:

* Download [node](https://nodejs.org/en/download/package-manager/) 10.4 or later (if you don't have it yet).
* Download [yarn](https://yarnpkg.com/en/docs/install) package manager.
* Download shlink-web-client source files for the version you want to build.
    * For example, if you want to build `v1.0.1`, use this link https://github.com/shlinkio/shlink-web-client/archive/v1.0.1.zip
    * Replace the `v1.0.1` part in the link with the one of the version you want to build.
* Decompress the file and `cd` into the resulting folder.
* Install project dependencies by running `yarn install`.
* Open the `package.json` file in the root of the project, locate the `homepage` property and replace the value (which should be an empty string) by the path from which you want to serve shlink-web-client.
    * For example: `"homepage": "/my-projects/shlink-web-client",`.
* Build the distributable contents by running `yarn build`.
* Once the command finishes, you will have a `build` folder with all the static assets you need to run shlink-web-client. Just place them wherever you want them to be served from.
