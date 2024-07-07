const { PrismaClient } = require("../../prisma/client");
const { verifyToken } = require("../../utils/jwt");
const {
  validateOrg,
  validateUserId,
} = require("../../validators/organization");
const prisma = new PrismaClient();

exports.createOrg = async (req, res) => {
  const { error } = validateOrg(req.body);
  if (error) return res.status(422).json({ errors: error.details });

  const { name, description } = req.body;
  const userId = req.user.userId;

  try {
    const organisation = await prisma.organisation.create({
      data: {
        name,
        description,
        users: {
          connect: { userId },
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: organisation,
    });
  } catch (err) {
    res.status(400).json({ status: "Bad request", message: "Client error" });
  }
};

exports.getUserOrg = async (req, res) => {
  const userId = req.user.userId;

  try {
    const organisations = await prisma.organisation.findMany({
      where: { users: { some: { userId } } },
    });

    res.status(200).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: { organisations },
    });
  } catch (err) {
    res.status(400).json({ status: "Bad request", message: "Client error" });
  }
};

exports.getOrgById = async (req, res) => {
  const { orgId } = req.params;
  const userId = req.user.userId;

  try {
    const organisation = await prisma.organisation.findFirst({
      where: { orgId, users: { some: { userId } } },
    });

    if (!organisation) {
      return res
        .status(404)
        .json({ status: "Not found", message: "Organisation not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: organisation,
    });
  } catch (err) {
    res.status(400).json({ status: "Bad request", message: "Client error" });
  }
};

exports.addUsersToOrg = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  const { error } = validateUserId(req.body);
  if (error) return res.status(422).json({ errors: error.details });

  try {
    await prisma.organisation.update({
      where: { orgId },
      data: { users: { connect: { userId } } },
    });

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (err) {
    res.status(400).json({ status: "Bad request", message: "Client error" });
  }
};
