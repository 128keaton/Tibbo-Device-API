# Tibbo Device API

Example output:
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
