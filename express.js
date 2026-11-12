import http from "./http.js";

class Route {
  constructor(path, handler) {
    this.path = path;
    this.handler = handler;
    this.params = [];
    this.indexToParamMap = {};
    this.paramToIndexMap = {};
    
    let paramsWildcardSegments = []; // "/param/:paramName/anotherParam/:anotherParamName" -> ["param", "*", "anotherParam", "*"]

    // "/1/2/3" -> split("/") -> ["", "1", "2", "3"] -> splice(1) -> ["1", "2", "3"]
    let pathSegments = path.split("/").splice(1); // trimming first empty param
    for (let [index, segment] of pathSegments.entries()) {
      if (segment[0] === ":") {
        let paramName = segment.slice(1);
        this.params.push(paramName);
        this.indexToParamMap[index] = paramName;
        this.paramToIndexMap[paramName] = index;
        
        paramsWildcardSegments.push("*");
      } else {
        paramsWildcardSegments.push(segment);
      }
    }

    this.paramsWildcard = paramsWildcardSegments.join("/"); // ["param", "*", "anotherParam", "*"] -> "param/*/anotherParam/*"
  }

  getParamsValues(path) {
    let values = {};

    // "/1/2/3" -> split("/") -> ["", "1", "2", "3"] -> splice(1) -> ["1", "2", "3"]
    let pathSegments = path.split("/").splice(1); // trimming first empty param
    console.log(pathSegments);
    for (let paramName of this.params) {
      let paramIndex = this.paramToIndexMap[paramName];
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
    let index = this.routes.push(new Route(path, handler));
    this.routeMap[path] = index - 1; // Array length after adding - 1
  }

  // Generic matching: simple equality checking first, then possible paramatric matches
  match(path) {
    let simpleRoute = this.simpleMatch(path);
    if (simpleRoute !== null) {
      return [simpleRoute, {}];
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
    // "/1/2/3" -> split("/") -> ["", "1", "2", "3"] -> splice(1) -> ["1", "2", "3"]
    let pathSegments = path.split("/").splice(1); // trimming first empty param
    let urlWildcard = "";

    for (let [segmentIndex, pathSegment] of pathSegments.entries()) {
      // if 
    }

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