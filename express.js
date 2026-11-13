import http from "./http.js";

class Route {
  constructor(method, path, handler) {
    this._method = method;
    this._path = path;
    this._handler = handler;
    this._params = [];
    this._indexToParamMap = {};
    this._paramToIndexMap = {};
    this._pathWildcardSegments = [];

    // "/user/:userId/book/:bookId" -> ["user", "*", "book", "*"]
    // "/user/123/book/456" -> split("/") -> ["", "user", "123", "book", "456"]
    // ["", "user", "123", "book", "456"] -> splice(1) -> ["user", "123", "book", "456"]
    let pathSegments = path.split("/").splice(1); // trimming first empty param
    for (let [index, segment] of pathSegments.entries()) {
      if (segment[0] === ":") {
        let paramName = segment.slice(1); // ":userId" -> "userId"
        this._params.push(paramName); // [] -> ["userId"]
        this._indexToParamMap[index] = paramName; // { 1: "userId" }
        this._paramToIndexMap[paramName] = index; // { "userId": 1 }
        this._pathWildcardSegments.push("*");
      } else {
        this._pathWildcardSegments.push(segment);
      }
    }
    // self._pathWildcardSegments = ["user", "*", "book", "*"]
  }

  getPathWildcardSegments() {
    return this._pathWildcardSegments;
  }

  getParamName(index) {
    return this._indexToParamMap[index];
  }

  getParamsValues(path) {
    let values = {};

    let pathSegments = path.split("/").splice(1); // trimming first empty param
    for (let paramName of this._params) {
      let paramIndex = this._paramToIndexMap[paramName];
      let paramValue = pathSegments[paramIndex];
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
    let route = new Route(path, handler);
    let index = this.routes.push(route);

    let routeWildcard = route._pathWildcard;
    this.routeMap[routeWildcard] = index - 1; // Array length after adding - 1
  }

  // Generic matching: simple equality checking first, then possible paramatric matches
  match(path) {
    let simpleRouteMatch = this.simpleMatch(path);
    if (simpleRouteMatch !== null) {
      return [simpleRouteMatch, {}];
    } else {
      return this.matchWithParams(path);
    }
  }

  simpleMatch(path) {
    if (path in this.routeMap) {
      let index = this.routeMap[path];
      return this.routes[index];
    } else {
      return null;
    }
  }

  matchWithParams(path) {
    const pathSegments = path.split("/").splice(1); // trimming first empty param

    let params = {};
    let queryParams = {};

    console.log(pathSegments);
    console.log("Matching with:");

    // Filtering only route with the same segment count
    for (let route of this.routes.filter(
      (route) => route.getPathWildcardSegments().length === pathSegments.length,
    )) {
      let isMatched = true;
      for (let [segmentIndex, pathSegment] of pathSegments.entries()) {
        const paramName = route.getParamName(segmentIndex);
        console.log("    ps:", segmentIndex, pathSegment, paramName);

        if (paramName !== undefined) {
          console.log("param");
          params[paramName] = pathSegment;
        } else {
          if (route.getPathWildcardSegments()[segmentIndex] !== pathSegments[segmentIndex]) {
            isMatched = false;
            break;
          } else {
            console.log("Route doesn't match:", route.getPathWildcardSegments()[segmentIndex], pathSegments[segmentIndex]);
          }
        }
      }
      console.log("Matched:", isMatched, params, queryParams);
    }

    return [null, params, queryParams];
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
    this.routes.add("GET", path, handler);
  }

  post(path, handler) {
    this.routes.add("POST", path, handler);
  }

  put(path, handler) {
    this.routes.add("PUT", path, handler);
  }

  delete(path, handler) {
    this.routes.add("DELETE", path, handler);
  }
}

export default () => {
  return new ExpressApp();
};
