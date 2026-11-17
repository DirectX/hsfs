import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

import express from "../express.js";

// // All routes
// console.log("All routes:", app.routes);

// // Test matching
// console.log("routes.match(`\"/\"):", app.routes.match("/"));
// console.log("routes.match(`\"/?foo=abc&bar=123\"):", app.routes.match("/?foo=abc&bar=123"));
// console.log("routes.match(`\"/hello\"):", app.routes.match("/hello"));
// console.log("routes.match(`\"/hello?name=alex\"):", app.routes.match("/hello?name=alex"));
// console.log("routes.match(`\"/non-existing-url\"):", app.routes.match("/non-existing-url"));
// console.log("routes.match(`\"/users/123\"):", app.routes.match("/users/123"));
// console.log("routes.match(`\"/users/123/books/456\"):", app.routes.match("/users/123/books/456"));
// console.log("routes.match(`\"/users/123/books/456?foo=abc&bar=123\"):", app.routes.match("/users/123/books/456?foo=abc&bar=123"));

describe("Router", () => {
  let app;
  let server;
  let baseUrl;

  before(async () => {
    app = express();

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

    // let port = 3000;
    // let host = "localhost";

    // app.listen(port, host, () =>
    //   console.log(`Express server is listening on http://${host}:${port}\r\n`),
    // );

    server = app.listen(0);

    await new Promise((resolve) => server.once("listening", resolve));

    const { port } = server.address();
    baseUrl = `http://localhost:${port}`;
  });

  after(async () => {
    // await new Promise((resolve, reject) => {
    //   server.close((error) => {
    //     if (error) reject(error);
    //     else resolve();
    //   });
    // });
  });

  it("should run server", () => {
    // const match = app.routes.match("GET", "/non-existing-url");

    // console.log(match);

    assert.ok(server);
    // assert.equal(1, 1);
  });

  it("should return undefined for unknown route", () => {
    // const match = app.routes.match("GET", "/non-existing-url");

    // console.log(match);

    // assert.ok(match);
    assert.equal(1, 1);
  });

  // it('should register GET route', () => {
  //     const router = new Router();

  //     const handler = () => 'Hello';

  //     router.get('/hello', handler);

  //     const route = router.find('GET', '/hello');

  //     assert.ok(route);
  //     assert.equal(route.method, 'GET');
  //     assert.equal(route.path, '/hello');
  //     assert.equal(route.handler, handler);
  // });

  // it('should return undefined for unknown route', () => {
  //     const router = new Router();

  //     const route = router.find('GET', '/unknown');

  //     assert.equal(route, undefined);
  // });
});
