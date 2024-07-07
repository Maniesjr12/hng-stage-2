const express = require("express");
const authRoute = require("./auth/auth.routes");
const orgRoute = require("./organization/organization.routes");
const usersRoute = require("./users/users.routes");

const api = express.Router();

api.use("/auth", authRoute);

api.use("/organisations", orgRoute);
api.use("/users", usersRoute);

module.exports = api;
