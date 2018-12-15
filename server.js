'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const Hapi = require('hapi');
const Nes = require('nes');
const { db } = require('./config');

const server = Hapi.server({
  host: 'localhost',
  port: process.env.PORT || 8080,
  address: '0.0.0.0',
  routes: {
    cors: {
      additionalHeaders: ['x-auth']
    }
  }
});

async function start() {
  try {
    await server.register([
      {
        plugin: Nes,
        options: {
          auth: false
        }
      },
      {
        plugin: require('./config/mongoose'),
        options: {
          uri: db.uri
        }
      },
      {
        plugin: require('./web/auth')
      },
      {
        plugin: require('./web/user/user.routes'),
        routes: {
          prefix: '/account'
        }
      },
      {
        plugin: require('./web/auction/auction.routes'),
        routes: {
          prefix: '/auction'
        }
      }
    ]);

    server.subscription('/auction/{id}', { auth: false });
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
}

start();

module.exports = server;
