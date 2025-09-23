import http from "node:http";
import fs from "node:fs/promises";

const host = "localhost";
const port = 5000;

async function requestListener(request, response) {
  response.setHeader("Content-Type", "text/html");

  const parts = request.url.split("/").filter(Boolean);
  const route = parts[0]; 

  try {
    switch (route) {
      case undefined:
      case "index.html":
        const contents = await fs.readFile("index.html", "utf8");
        response.writeHead(200);
        return response.end(contents);

      case "random.html":
        response.writeHead(200);
        return response.end(`<html><p>${Math.floor(100 * Math.random())}</p></html>`);

      case "random":
        if (parts.length === 2) {
          const nb = parseInt(parts[1], 10);
          if (isNaN(nb) || nb <= 0 || nb > 1000) {
            response.writeHead(400);
            return response.end(`<html><p>400: Bad Request - Invalid number</p></html>`);
          }

          const randomNumbers = Array.from({ length: nb }, () => Math.floor(100 * Math.random()));
          const numbersHtml = randomNumbers.map(n => `<p>${n}</p>`).join("");
          response.writeHead(200);
          return response.end(`<html>${numbersHtml}</html>`);
        } else {
          response.writeHead(404);
          return response.end(`<html><p>404: NOT FOUND</p></html>`);
        }

      default:
        response.writeHead(404);
        return response.end(`<html><p>404: NOT FOUND</p></html>`);
    }
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
  }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
