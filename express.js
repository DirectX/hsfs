import http from "./http.js";

class ExpressApp {
  constructor() {
    this.httpServer = new http.Server();
  }

  async listen(port, host = "localhost", ready) {
    console.log("Starting Express app...");
    await this.httpServer.listen(port, host, ready);
  }

  get() {}
}

export default () => {
  return new ExpressApp();
};