import net from 'net';

class Server {
  constructor() {
    this.server = net.createServer((socket) => {
      console.log(`Client attached: ${socket.remoteAddress}:${socket.remotePort}`);

      // Data processing
      socket.on('data', (data) => {
        console.log("=========================================");
        console.log(`${data.toString().trim()}`);
        console.log("-----------------------------------------");

        let body = "{\"ok\": true}";
        let res = `HTTP/1.0 200 OK\r\n\r\n${body}\r\n`;

        socket.write(`${res}`);
        socket.end();

        console.log(`${res.toString().trim()}`);
        console.log("=========================================");
      });

      // Обработка закрытия соединения клиентом
      socket.on('end', () => {
        console.log('Client detached\r\n');
      });

      // Обработка ошибок
      socket.on('err', (err) => {
        console.error(`Socket error: ${err.message}`);
      });
    });
  }

  async listen(port, host, ready) {
    console.log("Starting TCP listener...");
    this.server.listen(port, host, ready);
  }
}

export default { Server };