import express from "./express.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/:userId", (req, res) => {
  res.send(req.params);
});

app.get("/users/:userId/books/:bookId", (req, res) => {
  res.send(req.params);
});

let port = 3000;
let host = "localhost";

app.listen(port, host, () =>
  console.log(`Express server is listening on http://${host}:${port}\r\n`),
);

process.on("SIGINT", async () => {
  console.log("\r\nShutting down...");

  await app.close();

  console.log("Server stopped");
  process.exit(0);
});
