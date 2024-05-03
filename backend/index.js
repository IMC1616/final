// Server Model: Contiene todo el servidor de express
const Server = require("./models/Server");

// Paquete para leer y establecer las variables de entorno
require("dotenv").config();

// Inicializar la instancia del server
const server = new Server();

// Requiere e inicia el cron job
require("./cronJob");
require("./reviewAllMetersAndSuspend");
// Ejecutar el server
server.execute();
