import express from "./express.js";

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

let port = 3000;
let host = "localhost";

app.listen(port, host, () => console.log(`Express server is listening on http://${host}:${port}`));