const app = require("./app");
const http = require("http");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

function startServer() {
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();

module.exports = server;
