import net from 'net';

class Server {
  constructor(dataHandler) {
    this._dataHandler = dataHandler;
    this._server = net.createServer((socket) => {
      console.log(`Client attached: ${socket.remoteAddress}:${socket.remotePort}\r\n`);

      // Data processing
      socket.on('data', (data) => {
        console.log("=========================================");
        console.log(">>> Request");
        console.log("-----------------------------------------");
        console.log(`${data.toString().trim()}`);
        console.log("=========================================\r\n");

        // Calling dataHandler
        let [code, status, headers, body] = this._dataHandler(data.toString().trim());

        let res = `HTTP/1.0 ${code} ${status}\r\n`;
        for (let header of headers) {
          res += `${header[0]}: ${header[1]}\r\n`;
        }
        res += `\r\n${body}\r\n`;

        socket.write(`${res}`);
        socket.end();

        console.log("=========================================");
        console.log("<<< Response");
        console.log("-----------------------------------------");
        console.log(`${res.toString().trim()}`);
        console.log("=========================================\r\n");
      });

      // Обработка закрытия соединения клиентом
      socket.on('end', () => {
        console.log('Client detached\r\n');
      });

      // Обработка ошибок
      socket.on('error', (err) => {
        console.error(`Socket error: ${err.message}`);
      });
    });
  }

  async listen(port, host, ready) {
    console.log("Starting TCP listener...");
    this._server.listen(port, host, ready);
  }
}

export default { Server };