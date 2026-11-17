import tcp from "./tcp.js";

class Server {
  constructor(dataHandler) {
    this._dataHandler = dataHandler;
    this.tcpServer = new tcp.Server(this._tcpDataHandler.bind(this)); // Context binding needed or arrow function
  }

  _tcpDataHandler(tcpData) {
    console.log("HTTP server received TCP data:", tcpData);

    // Top-level handler
    const response = this._dataHandler(tcpData);

    // For now simple HTTP-response.
    const status = "OK";
    const code = 200;
    const headers = [["Content-Type", "application/json"]];

    const responseData = JSON.stringify({
      ok: true,
      msg: "test response",
    });

    return [code, status, headers, responseData];
  }

  listen(port, host = "localhost", ready) {
    console.log("Starting HTTP server...");
    return this.tcpServer.listen(port, host, ready);
  }

  close() {
    return this.tcpServer.close();
  }
}

export default { Server };
