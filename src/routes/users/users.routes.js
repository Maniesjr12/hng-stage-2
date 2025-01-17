const express = require("express");
const { getUserbyIdandOrg } = require("./users.controller");
const { verifyToken } = require("../../utils/jwt");

const usersRoute = express.Router();
usersRoute.use(verifyToken);
usersRoute.get("/:id", getUserbyIdandOrg);

module.exports = usersRoute;
