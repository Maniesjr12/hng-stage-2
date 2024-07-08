const { PrismaClient } = require("../../prisma/client");
const prisma = new PrismaClient();

exports.getUserbyIdandOrg = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findFirst({
      where: {
        userId: id,
        organisations: { some: { users: { some: { userId } } } },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: "Not found", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "Bad request", message: "Client error" });
  }
};
