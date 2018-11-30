"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const Iron = require("iron");
const saltRounds = 12;
const { ironConfig } = require("../../config");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String },
    investedCredits: { type: Number, default: 0 },
    googleId: { type: String },
    facebookId: { type: String },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function() {
  try {
    this.password = await bcrypt.hash(this.password, saltRounds);
    const payload = { email: this.email, id: this._id.toString() };
    this.token = await Iron.seal(payload, ironConfig.password, Iron.defaults);
  } catch (err) {
    return err;
  }
});

UserSchema.methods.comparePasswords = async function(password) {
  if (password !== undefined) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (err) {
      return err;
    }
  }
  return false;
};

UserSchema.set("toJSON", {
  transform: doc => ({
    name: doc.name,
    email: doc.email,
    token: doc.token,
    investedCredits: doc.investedCredits,
    _id: doc._id.toString()
  })
});

module.exports = mongoose.model("User", UserSchema);
