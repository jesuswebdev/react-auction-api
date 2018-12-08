'use strict';

const Boom = require('boom');
const Iron = require('iron');
const { ironConfig } = require('../../config');

module.exports = {
  name: 'authScheme',
  register: async function(server, options) {
    const userScheme = server => {
      return {
        authenticate: async (req, h) => {
          let payload;
          let token = req.raw.req.headers['x-auth'] || null;

          if (!token) {
            return h.unauthenticated();
          }

          try {
            payload = await Iron.unseal(
              token,
              ironConfig.password,
              Iron.defaults
            );
          } catch (error) {
            return Boom.badRequest('Token no válido');
          }

          let credentials = null;

          try {
            //find user
            const User = server.plugins['mongoose'].connection.model('User');
            let foundUser = await User.findById(payload.id);

            if (!foundUser) {
              return Boom.unauthorized(
                'Error de autenticación. El usuario no existe'
              );
            }
            credentials = {
              id: payload.id,
              role: 'user',
              scope: ['user']
            };
          } catch (error) {
            return Boom.internal();
          }

          return h.authenticated({ credentials });
        } //authenticate
      }; //return
    }; //const userScheme

    await server.auth.scheme('userScheme', userScheme);
    await server.auth.strategy('userAuth', 'userScheme');
    await server.auth.default({ strategy: 'userAuth' });
  }
};
