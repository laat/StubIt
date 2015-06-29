
# Generisk json+http mock

## Datastruktur

```javascript
{
  "path": "/some/path", // required
  "method": "GET",      // en av: GET/POST/PUT
  "requestBody": {},    // request object,  - optional
  "responseBody": {},   // response object, - optional
  "responseHeaders": {},// response headers - optional. Hvis Content-Type ikke er angitt er json default
  "status": 200         // default 200      - optional
}
```

## Mock et GET-request

Ved å sende testdata:

```http
POST http://localhost:8081/testdata
Content-Type: application/json

{
  "path": "/bostotte/0000000",
  "method": "GET",
  "responseBody": {
    "status": false
  }
}
```

oppfører endepunktet seg som definert:

```http
GET http://localhost:8081/bostotte/0000000
```

    {
      "status": false
    }

## Mock et GET-request med xml response

**NB: hvis responseBody skal være xml, så må alt inlines som en string, og fnutter må escapes (\\")**

Ved å sende testdata:

```http
POST http://localhost:8081/testdata
Content-Type: application/json

{
  "path": "/kontaktregister/0000000",
  "method": "GET",
  "responseHeaders": {
    "Content-Type": "application/xml"
  },
  "responseBody": "xmldata"
}
```

oppfører endepunktet seg som definert:

```http
GET http://localhost:8081/kontaktregister/0000000
```

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/xml; charset=utf-8
    Content-Length: 7
    ETag: W/"7-Fb2JgSpskhIMKXddzveztg"
    Date: Mon, 29 Jun 2015 11:44:49 GMT
    Connection: keep-alive
    
    xmldata

## Mock et GET-request med egendefinerte headers

Ved å sende testdata:

```http
POST http://localhost:8081/testdata
Content-Type: application/json

{
  "path": "/bostotte/0000000",
  "method": "GET",
  "responseHeaders": {
    "Egendefinert-Header": "blablabla"
  },
  "responseBody": {
    "status": true
  }
}
```

oppfører endepunktet seg som definert:

```http
GET http://localhost:8081/bostotte/0000000
```

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Egendefinert-Header: blablabla
    Content-Type: application/json; charset=utf-8
    Content-Length: 15
    ETag: W/"f-KOwe7l9ASePE8hNQacHSyA"
    Date: Mon, 29 Jun 2015 11:44:58 GMT
    Connection: keep-alive
    
    {"status":true}

## Mock Statuskode

Dersom man først definerer et request som skal feile:

```http
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
```

Vil det feile:

```http
GET http://localhost:8081/fail
```

    HTTP/1.1 500 Internal Server Error
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 46
    ETag: W/"2e-EDysCpt7VGzj5U86AxsIQw"
    Date: Mon, 29 Jun 2015 11:45:07 GMT
    Connection: keep-alive
    
    {"error":"jeg feilet, og sier i fra med json"}

## Mock et POST-request

```http
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
```

`requestBody` feltet er spesielt, feltet blir en nøkkel som man gjør
oppslag på. 

```http
POST http://localhost:8081/postbar
Content-Type: application/json

{"alfa": "alfa"}
```

    {
      "hello": "alfa"
    }

## Mock et PUT-request

```http
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
```

`PUT` fungerer på samme måte som `POST`

```http
PUT http://localhost:8081/postbar
Content-Type: application/json

{"beta": "beta"}
```

    {
      "hello": "beta"
    }

## Hent alle testdata

```http
GET http://localhost:8081/testdata
```
