"use strict";

const Boom = require("boom");
const Iron = require("iron");
const { ironConfig } = require("../../config");
// const User = require('mongoose').model('User');

module.exports = {
  name: "authScheme",
  register: async function(server, options) {
    const userScheme = server => {
      return {
        authenticate: async (req, h) => {
          let token = null;
          let payload = null;
          let token = req.raw.req.headers["x-auth"] || null;

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
            return Boom.badRequest("Token no válido");
          }

          let credentials = null;

          // try {
          //   //find user
          //     let foundUser = await User.findById(payload.id).populate('account_type', 'permissions role');

          //     if (!foundUser) {
          //         return Boom.unauthorized('Error de autenticación. El usuario no existe');
          //     }
          //     const permissions = foundUser.account_type.permissions;
          //     credentials = {
          //         id: payload.id,
          //         role: foundUser.account_type.role,
          //         scope: [
          //             ...permissions.create,
          //             ...permissions.read,
          //             ...permissions.update,
          //             ...permissions.delete
          //         ]
          //     };
          // }
          // catch (error) {
          //     return Boom.internal();
          // }

          return h.authenticated({ credentials });
        } //authenticate
      }; //return
    }; //const userScheme

    await server.auth.scheme("userScheme", userScheme);
    await server.auth.strategy("userAuth", "userScheme");
    await server.auth.default({ strategy: "userAuth" });
  }
};
