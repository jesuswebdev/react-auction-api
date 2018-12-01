const Auction = require("./auction.controller");
const Joi = require("joi");

module.exports = {
  name: "auction-routes",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/",
      handler: Auction.create,
      options: {
        auth: {
          access: {
            scope: ["user"]
          }
        },
        validate: {
          payload: Joi.object({
            title: Joi.string()
              .trim()
              .min(4)
              .required(),
            description: Joi.string()
              .trim()
              .min(8),
            img: Joi.string()
              .trim()
              .uri()
              .required(),
            minimun_bid: Joi.number()
              .positive()
              .min(1)
              .required(),
            end_date: Joi.date()
              .min(Date.now())
              .required()
          }),
          query: false
        }
      }
    });

    server.route({
      method: "GET",
      path: "/",
      handler: Auction.find,
      options: {
        auth: false,
        validate: {
          payload: false,
          query: Joi.object({
            offset: Joi.number()
              .positive()
              .min(1),
            limit: Joi.number()
              .positive()
              .min(1),
            filter: Joi.string()
              .trim()
              .allow(["top", "new"])
          })
        }
      }
    });
  }
};
