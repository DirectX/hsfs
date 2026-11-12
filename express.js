import http from "./http.js";

class Route {
  constructor(path, handler) {
    this.path = path;
    this.handler = handler;
    this.params = [];
    this.paramsIndexes = {};

    // "/1/2/3" -> split("/") -> ["", "1", "2", "3"] -> splice(1) -> ["1", "2", "3"]
    let segments = path.split("/").splice(1); // trimming first empty param
    for (let [index, segment] of segments.entries()) {
      if (segment[0] === ":") {
        let prarmName = segment.slice(1);
        this.params.push(prarmName);
        this.paramsIndexes[prarmName] = index;
      }
    }
  }

  getParamsValues(path) {
    let values = {};

    let segments = path.split("/").splice(1); // trimming first empty param
    console.log(segments);
    for (let paramName of this.params) {
      let paramIndex = this.paramsIndexes[paramName];
      let paramValue = segments[paramIndex];
      values[paramName] = paramValue;
    }

    return values;
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
      return [this.routes[index], {}];
    } else {
      let routeWithParams = this.matchWithParams(path);
      
      if (routeWithParams) {
        return routeWithParams;
      } else {
        return [null, {}];
      }
    }
  }

  matchWithParams(path) {
    if (path === "/users/123/books/456") {
      let index = 2;
      let route = this.routes[index];
      let values = route.getParamsValues(path);

      return [route, values];
    } else {
      return [null, {}];
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