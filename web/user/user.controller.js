"use strict";

const Boom = require("boom");
const User = require("mongoose").model("User");

exports.create = async (req, h) => {
  let createdUser;
  try {
    createdUser = User(req.payload);
    createdUser = await createdUser.save();
  } catch (error) {
    if (error.code === 11000) {
      return Boom.conflict("Correo electrónico en uso");
    }
    return Boom.internal();
  }
  const { _id } = createdUser;
  return h.response({ id: _id.toString() }).code(201);
};

exports.find = async (req, h) => {
  return "hola mundo";
};

exports.update = async (req, h) => {};

exports.remove = async (req, h) => {};
