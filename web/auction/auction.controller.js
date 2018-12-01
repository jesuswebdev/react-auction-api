"use strict";

const Boom = require("boom");
const Auction = require("mongoose").model("Auction");

exports.create = async (req, h) => {
  let createdAuction;
  try {
    createdAuction = await Auction(req.payload).save();
  } catch (error) {
    return Boom.internal();
  }
  return h.response({ id: createdAuction._id.toString() }).code(201);
};

exports.find = async (req, h) => {};

exports.update = async (req, h) => {};

exports.remove = async (req, h) => {};
