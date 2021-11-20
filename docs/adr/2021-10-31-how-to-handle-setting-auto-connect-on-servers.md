# How to handle setting auto-connect on servers

* Status: Accepted
* Date: 2021-10-31

## Context and problem statement

A new feature has been requested, to allow auto-connecting to servers. The request specifically mentioned doing it automatically when there's only one server configured, but it can be extended a bit to allow setting an "auto-connect" server, regardless the number of configured servers.

At all times, no more than one server can be set to "auto-connect" simultaneously. Setting a new one will effectively unset the previous one, if any.

## Considered option

* Auto-connect only of there's a single server configured.
* Allow to set the server as "auto-connect" during server creation, edition or import.
* Allow to set the server as "auto-connect" on a separated flow, where the full list of servers can be handled.

## Decision outcome

In order to make it more flexible, any server will be allowed to be set as "auto-connect", regardless the amount of configured servers.

Auto-connect will be handled from the new "Manage servers" section.

## Pros and Cons of the Options

### Only one server

* Good:
  * Does not require extending models, and the logic to auto-connect is based on the amount of configured servers.
* Bad:
  * It's not flexible enough.
  * Makes the app behave differently depending on the amount of configured servers, making it confusing.

### Auto-connect configured on existing creation/edition/import

* Good:
  * Does not require creating a new section to handle "auto-connect".
* Bad:
  * Requires extending the server model with a new prop.
  * It's much harder to ensure data consistency, as we need to ensure only one server is set to "auto-connect".
  * On import, many servers might have been set to "auto-connect". The expected behavior there can be unclear.

### Auto-connect configured on new section

* Good:
  * It's much easier to ensure data consistency.
  * It's much more clear and predictable, as the UI shows which is the server configured as auto-connect.
  * We have controls in a single place to set/unset auto connect on servers, allowing only the proper option based on current state for every server.
* Bad:
  * Requires extending the server model with a new prop.
    * Requires creating a new section to handle "auto-connect".
