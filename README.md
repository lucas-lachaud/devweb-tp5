# Serveur HTTP Node.js - Du serveur natif à Express

Ce projet explore la création de serveurs HTTP avec Node.js, en commençant par un serveur HTTP natif puis en migrant vers Express.js.

## 1. Serveur HTTP Natif

### 1.1/ En-têtes de réponse basiques
```txt
Content-Type: application/json
Date: Mon, 22 Sep 2025 03:07:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 20
```

### 1.2/ Réponse HTTP 200 OK
```txt
HTTP/1.1 200 OK
Content-Type: application/json
Date: Mon, 22 Sep 2025 03:08:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 20
```

### 1.3/ Gestion des fichiers manquants
Le fichier est introuvable donc le client ne reçoit pas de réponse.

### 1.4/ Gestion d'erreur ENOENT avec Promise
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

**Implémentation avec Promise :**
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

### 1.5/ Refactorisation avec async/await

**Version améliorée avec async/await :**
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

### 1.6/ Configuration des scripts npm

**Ajout dans package.json :**

Nouvelles dépendances :
```json
"dependencies": {
  "cross-env": "^10.0.0"
},
"devDependencies": {
  "nodemon": "^3.1.10"
}
```

- Dans `node_modules` : installation des packages et de leurs dépendances
- Dans `package-lock.json` : mise à jour avec les nouvelles dépendances et leurs versions exactes

**Scripts de démarrage :**

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

### 1.7/ Différences entre les environnements

- **http-dev** : utilise `nodemon` qui permet le rechargement automatique du serveur quand on modifie le code, et définit `NODE_ENV` à "development"
- **http-prod** : utilise `node` standard sans rechargement automatique et définit `NODE_ENV` à "production"

En développement, nodemon redémarre le serveur automatiquement quand on sauvegarde des modifications, ce qui facilite les tests. En production, on utilise node standard pour plus de stabilité et de performance.

### 1.8/ Tests de routage

**Résultats des tests :**
- `http://localhost:8000/index.html` → bonjour 
- `http://localhost:8000/random.html` → 57
- `http://localhost:8000/` → 404: NOT FOUND
- `http://localhost:8000/dont-exist` → 404: NOT FOUND

## 2. Migration vers Express.js

### 2.1/ Documentation des packages utilisés

**Packages Express principaux :**
- **express** : https://expressjs.com/en/guide/routing.html
- **http-errors** : https://www.npmjs.com/package/http-errors
- **loglevel** : https://www.npmjs.com/package/loglevel
- **morgan** : https://www.npmjs.com/package/morgan

### 2.2/ Interface d'administration

Screenshots de l'interface d'administration :

<img width="1276" height="655" alt="Interface d'administration - Vue 1" src="https://github.com/user-attachments/assets/88c7ee49-e6d3-4252-a968-add93bd52139" />

<img width="1276" height="655" alt="Interface d'administration - Vue 2" src="https://github.com/user-attachments/assets/b11e87b3-14f9-476d-822d-51a52bb9888a" />

<img width="1276" height="655" alt="Interface d'administration - Vue 3" src="https://github.com/user-attachments/assets/a87cd81a-d972-48e2-84bb-010b81f32ffa" />

### 2.3/ Analyse des en-têtes HTTP Express

**http://localhost:5000/** (304 Not Modified)
```txt
HTTP/1.1 304 Not Modified
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Fri, 19 Sep 2025 22:29:41 GMT
ETag: W/"94-1996418f7b6"
Date: Tue, 23 Sep 2025 22:02:18 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

**http://localhost:5000/random/5** (200 OK)
```txt
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 80
ETag: W/"50-jYJbe9CILQtv1LNftuXg4WHUAtM"
Date: Tue, 23 Sep 2025 22:16:21 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

**http://localhost:5000/test** (404 Not Found)
```txt
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 144
Date: Tue, 23 Sep 2025 22:04:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

**Nouveaux en-têtes ajoutés par Express :**
- `X-Powered-By`
- `Content-Security-Policy`  
- `X-Content-Type-Options`

### 2.4/ Événement listening

L'événement `listening` est déclenché dès que le serveur commence à écouter avec succès sur le port et l'adresse spécifiés. Cela signifie que le serveur est prêt à accepter des connexions entrantes.

### 2.5/ Comportement par défaut d'Express pour "/"

C'est l'option `index` qui a comme valeur par défaut `index.html` du middleware `express.static` qui fait que l'URL "/" redirige vers le fichier index.html.

### 2.6/ Gestion du cache navigateur

- **Ctrl+R** : le navigateur utilise le cache donc on a une réponse `304 Not Modified`
- **Ctrl+Shift+R** : on force le rechargement de la page et on reçoit comme réponse `200 OK`

### 2.7/ Comparaison des logs de développement vs production

**Affichage dev :**
<img width="1920" height="434" alt="Logs en mode développement" src="https://github.com/user-attachments/assets/2238b379-5539-4a63-a0ae-de9a104b1982" />

**Affichage prod :**
<img width="1764" height="347" alt="Logs en mode production" src="https://github.com/user-attachments/assets/f6327c72-63bd-4269-aa18-d2c05888e404" />
