import tcp from "./tcp.js";

function listen(host, port) {
    let tcpServer = tcp.server;

    // Запускаем сервер
    tcpServer.listen(port, host, () => {
        console.log(`TCP-сервер запущен на ${host}:${port}\r\n`);
    });

    console.log("Done.");
}

export default { listen };