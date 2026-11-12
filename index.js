import express from "./express.js";

const app = express();

app.get('/', (req, res) => {
  res.json({ok: true});
});

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params);
});

// All routes
console.log("All routes:", app.routes);

// Test matching
console.log("routes.match(`\"/\"):", app.routes.match("/"));
console.log("routes.match(`\"/hello\"):", app.routes.match("/hello"));
console.log("routes.match(`\"/non-existent-url\"):", app.routes.match("/non-existent-url"));
console.log("routes.match(`\"/users/123/books/456\"):", app.routes.match("/users/123/books/456"));

let port = 3000;
let host = "localhost";

app.listen(port, host, () => console.log(`Express server is listening on http://${host}:${port}`));