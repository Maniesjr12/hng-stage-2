const express = require("express");
const {
  createOrg,
  getUserOrg,
  getOrgById,
  addUsersToOrg,
} = require("./organization.controllers");
const { verifyToken } = require("../../utils/jwt");

const orgRoute = express.Router();

orgRoute.use(verifyToken);

orgRoute.post("/", createOrg);

orgRoute.get("/", getUserOrg);

orgRoute.get("/:orgId", getOrgById);

orgRoute.post("/:orgId/users", addUsersToOrg);

module.exports = orgRoute;
