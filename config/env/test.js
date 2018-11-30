"use strict";

const db = {
  uri: "mongodb://localhost:27017/auctionTest"
};

const ironConfig = {
  password: "testpasswordggshouldbeatleast32charactersotherwiseitthrowsanerror"
};

module.exports = {
  db,
  ironConfig
};
