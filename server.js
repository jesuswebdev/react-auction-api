"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const Hapi = require("hapi");
const configureMongoose = require("./config/mongoose");

const server = Hapi.server({
  host: "localhost",
  port: process.env.PORT || 8080,
  address: "0.0.0.0",
  routes: {
    cors: true
  }
});

async function start() {
  try {
    configureMongoose();

    await server.register(require("./web/auth"));

    await server.register([
      {
        plugin: require("./web/user/user.routes"),
        routes: {
          prefix: "/account"
        }
      },
      {
        plugin: require("./web/auction/auction.routes"),
        routes: {
          prefix: "/auction"
        }
      }
    ]);

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
}

start();

module.exports = server;
