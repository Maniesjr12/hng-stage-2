const { PrismaClient } = require("../../prisma/client");
const prisma = new PrismaClient();

exports.getUserbyIdandOrg = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { userId: userId },
      include: {
        organisations: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Check if the requesting user is the user themselves or belongs to an organization the user belongs to
    const isUserAllowed =
      req.user.id === userId ||
      user.organisations.some((org) =>
        org.users.some((u) => u.id === req.user.id)
      );

    if (!isUserAllowed) {
      return res.status(403).json({
        status: "fail",
        message: "Not authorized to access this user record",
      });
    }

    // Return the user data
    res.status(200).json({
      status: "success",
      message: "User record retrieved successfully",
      data: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};
