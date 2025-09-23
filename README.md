# 

## 1.1/
```txt
Content-Type: application/json
Date: Mon, 22 Sep 2025 03:07:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 20
```

## 1.2/
```txt
HTTP/1.1 200 OK
Content-Type: application/json
Date: Mon, 22 Sep 2025 03:08:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 20
```

## 1.3/
le fichier est introuvable donc le client ne recois pas de reponse

## 1.4/
```js
Error: ENOENT: no such file or directory, open 'index.html'
    at async open (node:internal/fs/promises:641:25)
    at async Object.readFile (node:internal/fs/promises:1245:14) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: 'index.html'
}
```


```js
import http from "node:http";
import fs from "node:fs/promises";

const host = "localhost";
const port = 5000;

function requestListener(_request, response) {
  fs.readFile("index.html", "utf8")
    .then((contents) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      return response.end(contents);
    })
    .catch((error) => {
      console.error(error);
      response.writeHead(500);
      response.end("Erreur pas de index html");
    });
}


const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
```

## 1.5/

```js
import http from "node:http";
import fs from "node:fs/promises";

const host = "localhost";
const port = 5000;

async function requestListener(_request, response) {
  try {
    const contents = await fs.readFile("index.html", "utf8");
    response.setHeader("Content-Type", "text/html");
    response.writeHead(200);
    return response.end(contents);
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    response.end("Erreur pas de index html");
  }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
```

## 1.6/

Dans package.json rajout de :

```json
  "dependencies": {
    "cross-env": "^10.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
```

Dans node_modules installation des packages et de leur dépendances.

dans le fichier package-lock.json mise à jour avec les nouvelles dépendances et leurs versions exactes.


On remplace : 
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Par : 
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "http-dev": "cross-env NODE_ENV=development nodemon server-http.mjs",
    "http-prod": "cross-env NODE_ENV=production node server-http.mjs"
  },
```

## 1.7/

http-dev utilise nodemon qui permet le rechargement automatique du serveur quand on modifie le code, et définit NODE_ENV à "development".
http-prod utilise node standard sans rechargement automatique et définit NODE_ENV à "production".
En développement, nodemon redémarre le serveur automatiquement quand on sauvegarde des modifications, ce qui facilite les tests. En production, on utilise node standard pour plus de stabilité et de performance.


## 1.8/


http://localhost:8000/index.html   : bonjour 
http://localhost:8000/random.html  : 57
http://localhost:8000/             : 404: NOT FOUND
http://localhost:8000/dont-exist   : 404: NOT FOUND



## 2.1/

express : https://expressjs.com/en/guide/routing.html
http-errors : https://www.npmjs.com/package/http-errors
loglevel : https://www.npmjs.com/package/loglevel
morgan : https://www.npmjs.com/package/morgan



## 2.2/

<img width="1276" height="655" alt="image" src="https://github.com/user-attachments/assets/88c7ee49-e6d3-4252-a968-add93bd52139" />
<img width="1276" height="655" alt="image" src="https://github.com/user-attachments/assets/b11e87b3-14f9-476d-822d-51a52bb9888a" />
<img width="1276" height="655" alt="image" src="https://github.com/user-attachments/assets/a87cd81a-d972-48e2-84bb-010b81f32ffa" />



