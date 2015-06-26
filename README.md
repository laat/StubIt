# Generisk json+http mock

## Datastruktur

    {
      "path": "/some/path", // required
      "method": "GET",      // en av: GET/POST/PUT
      "requestBody": {},    // request object,  - optional
      "responseBody": {},   // response object, - optional
      "responseHeaders": {}, // response headers - optional. Hvis Content-Type ikke er angitt er json default
      "status": 200         // default 200      - optional
    }

## Mock et GET-request

Ved å sende poste testdata:

    POST http://localhost:8081/testdata
    Content-Type: application/json
    
    {
      "path": "/bostotte/0000000",
      "method": "GET",
      "responseBody": {
        "status": true
      }
    }

oppfører endepunktet seg som definert:

    GET http://localhost:8081/bostotte/0000000

## Mock et GET-request med xml response

**NB: hvis responseBody skal være xml, så må alt inlines som en string, og fnutter må escapes (\")**

Ved å sende poste testdata:

    POST http://localhost:8081/testdata
    Content-Type: application/json
    
    {
      "path": "/kontaktregister/0000000",
      "method": "GET",
      "responseHeaders": {
        "Content-Type": "application/xml"
        },
      "responseBody": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>...."
      
    }

oppfører endepunktet seg som definert:

    GET http://localhost:8081/kontaktregister/0000000

## Mock et GET-request med egendefinerte headers

Ved å sende poste testdata:

    POST http://localhost:8081/testdata
    Content-Type: application/json
    
    {
      "path": "/bostotte/0000000",
      "method": "GET",
      "responseHeaders": {
        "Egendefinert-Header": 'blablabla'
      }
      "responseBody": {
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
      "responseBody": {
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
      "requestBody": {
        "alfa": "alfa"
      },
      "responseBody": {
        "hello": "alfa"
      }
    }

`requestBody` feltet er spesielt, feltet blir en nøkkel som man gjør
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
      "requestBody": {
        "beta": "beta"
      },
      "responseBody": {
        "hello": "beta"
      }
    }

`PUT` fungerer på samme måte som `POST`

    PUT http://localhost:8081/postbar
    Content-Type: application/json
    
    {"beta": "beta"}

## Hent alle testdata

    GET http://localhost:8081/testdata
