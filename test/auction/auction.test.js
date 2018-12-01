"use strict";

process.env.NODE_ENV = "test";
process.env.PORT = 4000;

const {
  test,
  experiment,
  beforeEach,
  after
} = (exports.lab = require("lab").script());
const { expect } = require("code");
const server = require("../../server");
const User = require("mongoose").model("User");
const Auction = require("mongoose").model("Auction");

const createUser = async () => {
  const { _id } = await User({
    name: "test user",
    email: "test@test.com",
    password: "testpassword"
  }).save();

  return _id.toString();
};

const createAuction = () => ({
  title: "Test Auction",
  description: "This is a test description for a test auction.",
  img: "https://testurl.com/testimg.png",
  minimun_bid: 150,
  end_date: Date.now() + 604800000
});

const clearDB = async () => {
  await User.deleteMany({});
  await Auction.deleteMany({});
};

experiment("Auction Route Test: ", () => {
  after(async () => {
    await clearDB();
  });
  experiment("POST /auction", () => {
    let options = {};

    beforeEach(async () => {
      await clearDB();
      const userId = await createUser();
      options = {
        url: "/auction",
        method: "POST",
        credentials: {
          id: userId,
          scope: ["user"]
        },
        payload: createAuction()
      };
    });

    test("creates an auction", async () => {
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(201);
    });

    test("returns the id of the created auction", async () => {
      const { statusCode, result } = await server.inject(options);
      expect(statusCode).to.equal(201);
      expect(result)
        .to.be.an.object()
        .and.to.contain("id");
      expect(result.id)
        .to.be.a.string()
        .and.to.have.length(24);
    });

    test("fails when the title is too short", async () => {
      options.payload.title = "asd";
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when there is no title", async () => {
      delete options.payload.title;
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the description is too short", async () => {
      options.payload.description = "asd";
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the img is not a url", async () => {
      options.payload.img = "testimage.png";
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when there is no img", async () => {
      delete options.payload.img;
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the minimun bid is less than 1", async () => {
      options.payload.minimun_bid = 0;
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when there is no miniumn bid", async () => {
      delete options.payload.minimun_bid;
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the end date is before the current date", async () => {
      options.payload.end_date = Date.now() - 3600000;
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when there is no end date", async () => {
      delete options.payload.end_date;
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });
  });
});
