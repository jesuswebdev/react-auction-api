const User = require("./user.controller");
const Joi = require("joi");

module.exports = {
  name: "user-routes",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/",
      handler: User.create,
      options: {
        auth: false,
        validate: {
          payload: Joi.object({
            name: Joi.string()
              .trim()
              .min(4)
              .max(32)
              .required(),
            email: Joi.string()
              .trim()
              .email()
              .min(10)
              .max(64)
              .required(),
            password: Joi.string()
              .trim()
              .min(8)
              .max(64)
              .required()
          }),
          query: false
        }
      }
    });

    server.route({
      method: "POST",
      path: "/login",
      handler: User.login,
      options: {
        auth: false,
        validate: {
          payload: Joi.object({
            email: Joi.string()
              .trim()
              .email()
              .min(10)
              .max(64)
              .required(),
            password: Joi.string()
              .trim()
              .min(8)
              .max(64)
              .required()
          }),
          query: false
        }
      }
    });
  }
};
