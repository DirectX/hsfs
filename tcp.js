import net from "net";

class Server {
  constructor(dataHandler) {
    this._dataHandler = dataHandler;
    this._server = net.createServer((socket) => {
      console.log(
        `Client attached: ${socket.remoteAddress}:${socket.remotePort}\r\n`,
      );

      // Data processing
      socket.on("data", (data) => {
        console.log("=========================================");
        console.log(">>> Request");
        console.log("-----------------------------------------");
        console.log(`${data.toString().trim()}`);
        console.log("=========================================\r\n");

        try {
          // Calling dataHandler
          const [code, status, headers, body] = this._dataHandler(
            data.toString(),
          );

          let response = `HTTP/1.0 ${code} ${status}\r\n`;

          for (const [name, value] of headers) {
            response += `${name}: ${value}\r\n`;
          }

          response += `\r\n${body}`;

          socket.end(response);

          console.log("=========================================");
          console.log("<<< Response");
          console.log("-----------------------------------------");
          console.log(response);
          console.log("=========================================\r\n");
        } catch (error) {
          console.error("Request processing error:", error);

          socket.end(
            "HTTP/1.0 500 Internal Server Error\r\n" +
              "Content-Length: 0\r\n" +
              "Connection: close\r\n\r\n",
          );
        }
      });

      // Обработка закрытия соединения клиентом
      socket.on("end", () => {
        console.log("Client detached\r\n");
      });

      // Обработка ошибок
      socket.on("error", (err) => {
        console.error(`Socket error: ${err.message}`);
      });
    });
  }

  listen(port, host = "localhost", ready) {
    console.log("Starting TCP listener...");
    return this._server.listen(port, host, ready);
  }

  close() {
    if (!this._server.listening) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this._server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

export default { Server };
