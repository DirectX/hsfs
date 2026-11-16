import tcp from "./tcp.js";

class Server {
  constructor(dataHandler) {
    this._dataHandler = dataHandler;
    this.tcpServer = new tcp.Server(this._tcpDataHandler.bind(this)); // Context binding needed or arrow function
  }

  _tcpDataHandler(tcpData) {
    let requestData = tcpData;
    console.log(`TCP dataHandler: requestData\r\n`);

    console.log(this._dataHandler("from handler"));

    return [200, "OK", [["Content-type", "application/json"]], requestData];
    // return [200, "OK", [["Content-type", "application/json"]], "{ \"ok\": true }"];
  }

  async listen(port, host, ready) {
    console.log("Starting HTTP server...");
    await this.tcpServer.listen(port, host, ready);
  }
}

export default { Server };