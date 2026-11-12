import net from 'net';

// Создаем TCP сервер
const server = net.createServer((socket) => {
  console.log(`Клиент подключился: ${socket.remoteAddress}:${socket.remotePort}`);

  // Обработка получения данных от клиента
  socket.on('data', (data) => {
    console.log("=========================================");
    console.log(`${data.toString().trim()}`);
    console.log("-----------------------------------------");

    let body = "{\"ok\": true}";
    let res = `HTTP/1.0 200 OK\r\n${body}\r\n`;

    socket.write(`${res}`);
    socket.end();

    console.log(`${res.toString().trim()}`);
    console.log("=========================================");
  });

  // Обработка закрытия соединения клиентом
  socket.on('end', () => {
    console.log('Клиент отключился\r\n');
  });

  // Обработка ошибок
  socket.on('err', (err) => {
    console.error(`Ошибка сокета: ${err.message}`);
  });
});

export default { server };