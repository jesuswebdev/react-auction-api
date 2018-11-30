"use strict";

const mongoose = require("mongoose");
const { db } = require("./index");

module.exports = () => {
  mongoose.connect(
    db.uri,
    { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }
  );
  mongoose.connection.on(
    "error",
    console.error.bind(console, "connection error")
  );
  mongoose.connection.on("open", () =>
    console.log("Connection with database succeeded")
  );

  require("../web/user/user.model");
};
