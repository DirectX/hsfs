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

  getMethod() {
    return this._method;
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
  }

  add(method, path, handler) {
    let route = new Route(method, path, handler);
    this.routes.push(route);
  }

  match(methos, path) {
    const [urlPath, queryString] = path.split("?");

    let matchedRoute = null;
    let params = {};
    
    const queryParams = Object.fromEntries(
      new URLSearchParams(queryString)
    );

    const pathSegments = urlPath.split("/").splice(1); // trimming first empty param

    console.log("-----------------------------------------");
    console.log(path, "->", pathSegments);
    console.log(urlPath, queryString);

    // Filtering only route with the same segment count
    for (let route of this.routes.filter(
      (route) =>
        route.getPathWildcardSegments().length === pathSegments.length &&
        route.getMethod() === method,
    )) {
      let isMatched = true;

      for (let [segmentIndex, pathSegment] of pathSegments.entries()) {
        const paramName = route.getParamName(segmentIndex);
        if (paramName !== undefined) {
          params[paramName] = pathSegment;
        } else {
          if (
            route.getPathWildcardSegments()[segmentIndex] !==
            pathSegments[segmentIndex]
          ) {
            isMatched = false;
            break;
          }
        }
      }

      if (isMatched) {
        matchedRoute = route;
        return [matchedRoute, params, queryParams];
      }
    }

    return [matchedRoute, params, queryParams];
  }
}

class ExpressApp {
  constructor() {
    this.httpServer = new http.Server(this._httpDataHandler.bind(this)); // Context binding needed or arrow function
    this.routes = new Routes();
  }

  listen(port, host = "localhost", ready) {
    console.log("Starting Express app...");
    this.httpServer.listen(port, host, ready);

    return this;
  }

  close(callback) {
    return new Promise((resolve, reject) => {
      this.httpServer.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        console.log("Express app stopped");
        resolve();
      });
    });
  }

  _httpDataHandler(httpData) {
    console.log(">>> express request:", httpData);
    return "<<< express response: " + httpData;
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
