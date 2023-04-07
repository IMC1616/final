const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    // Conectar la base de datos
    dbConnection();

    // Http server
    this.server = http.createServer(this.app);
  }

  middlewares() {
    // Desplegar el directorio storage
    // this.app.use(express.static(path.resolve(__dirname, "../storage")));

    this.app.use(cors("*"));
    this.app.use(helmet());
    this.app.use(morgan("dev"));
    this.app.use(express.json());

    // endpoints
    this.app.use("/api", require("../routes"));
  }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    // Inicializar Server
    this.server.listen(this.port, () => {
      console.log("[SERVER]: running on port:", this.port);
    });
  }
}

module.exports = Server;
