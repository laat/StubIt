# Generisk json+http mock

## Datastruktur

    {
      "path": "/some/path", // required
      "method": "GET",      // en av: GET/POST/PUT
      "key": {},            // request object,  - optional
      "value": {},          // response object, - optional
      "status": 200         // default 200      - optional
    }

## Mock et GET-request

Ved å sende poste testdata:

    POST http://localhost:8081/testdata
    Content-Type: application/json
    
    {
      "path": "/bostotte/0000000",
      "method": "GET",
      "value": {
        "status": true
      }
    }

oppfører endepunktet seg som definert:

    GET http://localhost:8081/bostotte/0000000

## Mock Statuskode

Dersom man først definerer et request som skal feile:

    POST http://localhost:8081/testdata
    Content-Type: application/json
    
    {
      "path": "/fail",
      "method": "GET",
      "status": 500,
      "value": {
        "error": "jeg feilet, og sier i fra med json"
      }
    }

Vil det feile:

    GET http://localhost:8081/fail

## Mock et POST-request

    POST http://localhost:8081/testdata
    Content-Type: application/json
    
    {
      "path": "/postbar",
      "method": "POST",
      "key": {
        "alfa": "alfa"
      },
      "value": {
        "hello": "alfa"
      }
    }

`key` feltet er spesielt, feltet blir en nøkkel som man gjør
oppslag på. 

    POST http://localhost:8081/postbar
    Content-Type: application/json
    
    {"alfa": "alfa"}

## Mock et PUT-request

    POST http://localhost:8081/testdata
    Content-Type: application/json
    
    {
      "path": "/postbar",
      "method": "PUT",
      "key": {
        "beta": "beta"
      },
      "value": {
        "hello": "beta"
      }
    }

`PUT` fungerer på samme måte som `POST`

    PUT http://localhost:8081/postbar
    Content-Type: application/json
    
    {"beta": "beta"}

## Hent alle testdata

    GET http://localhost:8081/testdata
