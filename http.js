import tcp from "./tcp.js";

class Server {
  constructor() {
    this.tcpServer = new tcp.Server();
  }

  async listen(port, host, ready) {
    console.log("Starting HTTP server...");
    await this.tcpServer.listen(port, host, ready);
  }
}

export default { Server };