'use strict';

const Boom = require('boom');
// const User = require("mongoose").model("User");

exports.create = async (req, h) => {
  const User = req.server.plugins['mongoose'].connection.model('User');
  let createdUser;
  try {
    createdUser = await User(req.payload).save();
  } catch (error) {
    if (error.code === 11000) {
      return Boom.conflict('Correo electrónico en uso');
    }
    return Boom.internal();
  }
  const { _id } = createdUser;
  return h.response({ id: _id.toString() }).code(201);
};

exports.login = async (req, h) => {
  const User = req.server.plugins['mongoose'].connection.model('User');
  let foundUser;

  try {
    foundUser = await User.findOne({ email: req.payload.email });
    if (!foundUser) {
      return Boom.badData('Usuario/Contraseña incorrectos');
    }
    let same = await foundUser.comparePasswords(req.payload.password);
    if (!same) {
      return Boom.badData('Usuario/Contraseña incorrectos');
    }
  } catch (error) {
    return Boom.internal();
  }

  return foundUser.toJSON();
};
