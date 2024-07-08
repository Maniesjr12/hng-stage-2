const app = require("./app");
const http = require("http");
require("dotenv").config();

let PORT = process.env.PORT || 8000 || 6000 || 2000 || 4000;

if (process.env.NODE_ENV == "test") {
  PORT = Math.floor(Math.random() * 60000) + 5000;
}

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

module.exports = server;
