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

exports.find = async (req, h) => {
  let foundAuctions;
  let sort = {};
  const query = req.query;
  const skip = query.offset || 0;
  const limit = query.limit || 0;
  const filter = query.filter || null;

  if (filter === "new") {
    sort = { createdAt: -1 };
  }
  if (filter === "top") {
    sort = { views: -1 };
  }

  try {
    foundAuctions = await Auction.find({ active: true })
      .sort(sort)
      .skip(skip)
      .limit(limit);
  } catch (error) {
    return Boom.internal();
  }

  return foundAuctions;
};

exports.update = async (req, h) => {};

exports.remove = async (req, h) => {};
