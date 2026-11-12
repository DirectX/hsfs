import http from "./http.js";

class Route {
  constructor(path, handler) {
    this.path = path;
    this.handler = handler;
  }
}

class Routes {
  constructor() {
    this.routes = [];
    this.routeMap = {};
  }

  add(path, handler) {
    let index = this.routes.push(new Route(path, handler));
    this.routeMap[path] = index - 1;
  }

  match(path) {
    if (path in this.routeMap) {
      let index = this.routeMap[path];
      return this.routes[index];
    } else {
      return null;
    }
  }
}

class ExpressApp {
  constructor() {
    this.httpServer = new http.Server();
    this.routes = new Routes();
  }

  async listen(port, host = "localhost", ready) {
    console.log("Starting Express app...");
    await this.httpServer.listen(port, host, ready);
  }

  get(path, handler) {
    this.routes.add(path, handler);
  }
}

export default () => {
  return new ExpressApp();
};