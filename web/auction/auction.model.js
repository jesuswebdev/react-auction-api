'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionSchema = new Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    img: { type: String },
    current_winning_bid: { type: mongoose.SchemaTypes.ObjectId, ref: 'Bid' },
    bids: { type: [mongoose.SchemaTypes.ObjectId], ref: 'Bid', default: [] },
    description: { type: String, default: 'No description available.' },
    minimun_bid: { type: Number, min: 1, default: 1 },
    views: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    end_date: { type: Date, min: Date.now() + 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Auction', auctionSchema);
