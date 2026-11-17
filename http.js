import tcp from "./tcp.js";

class Server {
  constructor(dataHandler) {
    this._dataHandler = dataHandler;
    this.tcpServer = new tcp.Server(this._tcpDataHandler.bind(this)); // Context binding needed or arrow function
  }

  _tcpDataHandler(tcpData) {
    console.log(`TCP dataHandler: tcpData\r\n`);
    console.log(this._dataHandler(tcpData));

    let code = 200;
    let status = "OK";
    let headers = [["Content-type", "application/json"]];
    let responseData = "{\"ok\": true, \"msg\": \"test response\"}";

    return [status, code, headers, responseData];
  }

  async listen(port, host, ready) {
    console.log("Starting HTTP server...");
    await this.tcpServer.listen(port, host, ready);
  }
}

export default { Server };