import tcp from "./tcp.js";

class Server {
  constructor() {
    this.tcpServer = new tcp.Server(this._tcpDataHandler);
  }

  _tcpDataHandler() {
    return [200, "OK", [["Content-type", "application/json"]], "{ \"ok\": true }"];
  }

  async listen(port, host, ready) {
    console.log("Starting HTTP server...");
    await this.tcpServer.listen(port, host, ready);
  }
}

export default { Server };