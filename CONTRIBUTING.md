# Contributing

This file will guide you through the process of getting to project up and running, in case you want to provide coding contributions.

You will also see how to ensure the code fulfills the expected code checks, and how to create a pull request.

## System dependencies

The project can be run inside a docker container through provided `docker compose` configuration.

Because of this, the only actual dependencies are [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/).

## Setting up the project

The first thing you need to do is fork the repository, and clone it in your local machine.

Then simply run `docker compose up` and you will have the project exposed in port `3000` (http://localhost:3000).

> The first time the container is created, the project dependencies will be installed and the container may take a bit longer to start.

## Project structure

This project is a [react](https://react.dev/) & [redux](https://redux.js.org/) application, built with [typescript](https://www.typescriptlang.org/), which is distributed as a 100% client-side progressive web application.

This is the basic project structure:

```
shlink-web-client
├── config
├── public
├── scripts
├── src
├── test
├── package.json
└── README.md
```

* `config`: It contains some configuration scripts, used during testing, linting and building of the project.
* `public`: Will act as the application document root once built, and contains some static assets (favicons, images, etc.).
* `scripts`: It has some of the CLI scripts used to run tests or building.
* `src`: Contains the main source code of the application, including both web components, SASS stylesheets and files with logic.
* `test`: Contains the project tests.

## Running code checks

> Note: The `indocker` shell script is a helper used to run commands inside the docker container.

* `./indocker node --run lint`: Checks coding styles are fulfilled, both in JS/TS files and in stylesheets.
* `./indocker node --run lint:js`: Checks coding styles are fulfilled in JS/TS files.
* `./indocker node --run lint:css`: Checks coding styles are fulfilled in stylesheets.
* `./indocker node --run lint:js:fix`: Fixes coding styles in JS/TS files.
* `./indocker node --run lint:css:fix`: Fixes coding styles in stylesheets.
* `./indocker node --run test`: Runs unit tests with Jest.

## Building the project

The source code in this project cannot be run directly in a web browser, you need to build it first.

* `./indocker node --run run build`: Builds the project for production using [vite](https://vite.dev/), generating the final static files. The content is placed in the `build` folder, which is automatically created if it does not exist.
* `./indocker node --run run preview`: Serves the static files inside the `build` folder in a random port. Useful to test the content built with previous command.

## Pull request process

In order to provide pull requests to this project, you should always start by creating a new branch, where you will make all desired changes.

The base branch should always be `main`, and the target branch for the pull request should also be `main`.

Before your branch can be merged, all the checks described in [Running code checks](#running-code-checks) have to be passing. You can verify that manually, or wait for the build to be run automatically after the pull request is created.
