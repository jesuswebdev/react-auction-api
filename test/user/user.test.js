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

experiment("User Route Test: ", () => {
  experiment("POST /account", () => {
    let options = {};

    beforeEach(async () => {
      await User.deleteMany({});

      options = {
        method: "POST",
        url: "/account",
        payload: {
          name: "test user",
          email: "test@test.com",
          password: "testpassword"
        }
      };
    });

    after(async () => {
      await User.deleteMany({});
    });

    test("allow the user to create an account", { timeout: 5000 }, async () => {
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(201);
    });

    test("returns the user id when created", { timeout: 5000 }, async () => {
      const { statusCode, result } = await server.inject(options);
      expect(statusCode).to.equal(201);
      expect(result).to.be.an.object();
      expect(result.id)
        .to.be.a.string()
        .and.to.have.length(24);
    });

    test("fails when the username is too short", async () => {
      options.payload.name = "aa";
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when there is no username", async () => {
      const { name, ...restPayload } = options.payload;
      options.payload = { ...restPayload };
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the username is too long", async () => {
      options.payload.name = "asdasdasdasdasdasdasdasdasdasdass";
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the username is a number", async () => {
      options.payload.name = 123123;
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the email is too short", async () => {
      options.payload.email = "a@b.com";
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the email is not in correct format", async () => {
      options.payload.email = "hola mundo";
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when there is no email", async () => {
      const { email, ...restPayload } = options.payload;
      options.payload = { ...restPayload };
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the email is too long", async () => {
      options.payload.email =
        "asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasda@gmail.com";
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the email is in use", { timeout: 5000 }, async () => {
      await User({
        name: "test user",
        email: "test@test.com",
        password: "testpassword"
      }).save();
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(409);
    });

    test("fails when the password is too short", async () => {
      options.payload.password = "asdasd";
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when the password is too long", async () => {
      options.payload.password =
        "asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdas";
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });

    test("fails when there is no password", async () => {
      const { password, ...restPayload } = options.payload;
      options.payload = { ...restPayload };
      const { statusCode } = await server.inject(options);
      expect(statusCode).to.equal(400);
    });
  });
});
