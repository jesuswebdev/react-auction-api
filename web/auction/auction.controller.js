'use strict';

const Boom = require('boom');
const Auction = require('mongoose').model('Auction');

exports.create = async (req, h) => {
  let createdAuction;
  try {
    createdAuction = await Auction({
      ...req.payload,
      user: req.auth.credentials.id
    }).save();
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

  if (filter === 'new') {
    sort = { createdAt: -1 };
  }
  if (filter === 'top') {
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

exports.findById = async (req, h) => {
  let foundAuction;

  try {
    foundAuction = await Auction.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    }).populate('user', 'name');
    if (!foundAuction) {
      return Boom.notFound('Auction not found');
    }
  } catch (error) {
    return Boom.internal();
  }

  return foundAuction;
};

exports.update = async (req, h) => {};

exports.remove = async (req, h) => {};
