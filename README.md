# Tibbo Device API
![coverage](https://github.com/128keaton/Tibbo-Device-API/raw/main/coverage/badge-functions.svg)
![coverage](https://github.com/128keaton/Tibbo-Device-API/raw/main/coverage/badge-lines.svg)
![coverage](https://github.com/128keaton/Tibbo-Device-API/raw/main/coverage/badge-statements.svg)
![coverage](https://github.com/128keaton/Tibbo-Device-API/raw/main/coverage/badge-branches.svg)

![tables](https://github.com/128keaton/Tibbo-Device-API/raw/main/examples/main.png)

A library/CLI tool to manage Tibbo devices

```shell
$ npm install @vipstorage/tibbo-device-api
```

## Supported Features

* Tables
  * List tables
  * List table's rows
  * Add a row
  * Delete a row
* Settings
  * Query device settings
  * Set a setting
  * View a setting
  * Initialize settings
* Info
  * Query basic device info (like firmware version)
* Functions
  * Reboot device

## Changelog
### 0.0.9
* Adds ability to import/export settings

### 0.0.8
* Fixes issue where setting description was not added to setting object

### 0.0.7
* Adds reboot function

### 0.0.6
* Fixes setting map bug

### 0.0.5
* Adds query

### 0.0.4
* Adds settings

### 0.0.3
* Adds tests

### 0.0.2
* Adds tables

### 0.0.1
* Initial commit

## Usage
### Examples
![query](https://github.com/128keaton/Tibbo-Device-API/raw/main/examples/example-query.png)
![tables](https://github.com/128keaton/Tibbo-Device-API/raw/main/examples/example-tables.png)
![settings-all](https://github.com/128keaton/Tibbo-Device-API/raw/main/examples/settings-all.png)
![settings-set](https://github.com/128keaton/Tibbo-Device-API/raw/main/examples/settings-set.png)

### CLI

```shell
$ npx tibbo-device-api
```

Example output of `npx tibbo-device-api tables fetch 0.0.0.0`:
```json
[
  {
    "name": "CREDS",
    "columns": [
      {
        "displayName": "Credential ID",
        "identifier": "ID",
        "min": 0,
        "max": 50,
        "dataType": "S"
      },
      {
        "displayName": "Raw Credential",
        "identifier": "RAW",
        "min": 0,
        "max": 50,
        "dataType": "S"
      }
    ],
    "rowCount": 2,
    "rows": [
      {
        "rowID": 1,
        "columnValues": {
          "ID": "Credential_ONE",
          "RAW": "1234"
        }
      },
      {
        "rowID": 2,
        "columnValues": {
          "ID": "Credential_TWO",
          "RAW": "4561"
        }
      }
    ]
  },
  {
    "name": "TBL2",
    "columns": [
      {
        "displayName": "Field 1",
        "identifier": "F1",
        "min": 0,
        "max": 50,
        "dataType": "F"
      },
      {
        "displayName": "FieldTwo",
        "identifier": "F2",
        "min": 0,
        "max": 50,
        "dataType": "S"
      }
    ],
    "rowCount": 2,
    "rows": [
      {
        "rowID": 1,
        "columnValues": {
          "F1": "1",
          "F2": "asdasdasd"
        }
      },
      {
        "rowID": 2,
        "columnValues": {
          "F1": "2",
          "F2": "pppp"
        }
      }
    ]
  }
]

```
