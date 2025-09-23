import express from "express";
import morgan from "morgan";

const host = "localhost";
const port = 5000;

const app = express();

app.use(morgan("dev"));

app.use(express.static("static"));

app.get("/random/:nb", async function (request, response, next) {
  const length = parseInt(request.params.nb, 10);
  const contents = Array.from({ length })
    .map(() => `<li>${Math.floor(100 * Math.random())}</li>`)
    .join("\n");
  return response.send(`<html><ul>${contents}</ul></html>`);
});

const server = app.listen(port, host);

server.on("listening", () =>
  console.info(
    `HTTP listening on http://${server.address().address}:${server.address().port} with mode '${process.env.NODE_ENV}'`,
  ),
);

console.info(`File ${import.meta.url} executed.`);
