'use strict';

const mongoose = require('mongoose');

module.exports = {
  name: 'mongoose',
  register: async (server, options) => {
    try {
      await mongoose.connect(
        options.uri,
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true
        }
      );
      console.log('Connection with database succeeded');
    } catch (error) {
      console.error.bind(console, 'connection error');
    }

    let connection = mongoose.connection;

    const UserSchema = require('../web/user/user.model');
    connection.model('User', UserSchema);

    const AuctionSchema = require('../web/auction/auction.model');
    connection.model('Auction', AuctionSchema);

    const BidSchema = require('../web/bid/bid.model');
    connection.model('Bid', BidSchema);
    // require().userModel(connection);
    // require('../web/auction/auction.model')(connection);
    // require('../web/bid/bid.model')(connection);
    server.expose('connection', connection);
  }
};
