"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bidSchema = new Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    auction: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Auction",
      required: true
    },
    amount: { type: Number, required: true },
    winner: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", bidSchema);
