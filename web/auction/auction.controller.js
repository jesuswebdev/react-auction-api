'use strict';

const Boom = require('boom');

exports.create = async (req, h) => {
  const Auction = req.server.plugins['mongoose'].connection.model('Auction');
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
  const Auction = req.server.plugins['mongoose'].connection.model('Auction');
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
      .limit(limit)
      .populate('current_bid', 'amount');
  } catch (error) {
    return Boom.internal();
  }

  return foundAuctions;
};

exports.findById = async (req, h) => {
  const Auction = req.server.plugins['mongoose'].connection.model('Auction');
  let foundAuction;

  try {
    foundAuction = await Auction.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    })
      .populate('user', 'name')
      .populate('current_bid')
      .populate({
        path: 'bids',
        select: 'user amount createdAt',
        populate: { path: 'user', select: 'name' }
      });
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

exports.bid = async (req, h) => {
  const Auction = req.server.plugins['mongoose'].connection.model('Auction');
  const Bid = req.server.plugins['mongoose'].connection.model('Bid');
  let foundAuction;
  let createdBid;
  const amount = req.payload.amount;

  try {
    foundAuction = await Auction.findById(req.params.id).populate(
      'current_bid',
      'amount'
    );

    if (!foundAuction) {
      return Boom.notFound('Auction not found.');
    }

    if (
      amount < foundAuction.minimun_bid ||
      amount <= ((foundAuction.current_bid || {}).amount || 0)
    ) {
      return Boom.badData('Bid not valid.');
    }

    createdBid = await Bid({
      user: req.auth.credentials.id,
      auction: req.params.id,
      amount
    }).save();

    await Bid.populate(createdBid, { path: 'user', select: 'name' });

    const update = {
      bids: [createdBid._id, ...foundAuction.bids],
      current_bid: createdBid._id.toString()
    };

    await Auction.findByIdAndUpdate(req.params.id, update);
  } catch (error) {
    return Boom.internal();
  }

  const publishBid = {
    _id: createdBid._id.toString(),
    user: createdBid.user,
    amount: createdBid.amount,
    createdAt: createdBid.createdAt
  };

  req.server.publish(`/auction/${req.params.id}`, publishBid);

  return h
    .response({ user: createdBid.user, amount: createdBid.amount })
    .code(201);
};

//timeout function, set active to false, set the current bid, emit socket notification
