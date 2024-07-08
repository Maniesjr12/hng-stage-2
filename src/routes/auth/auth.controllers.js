const { generateToken, verifyToken } = require("../../utils/jwt");
const { PrismaClient } = require("../../prisma/client");
const {
  validateLogin,
  validateUser,
} = require("../../validators/users.validators");
const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(422).json({ errors: error.details });

  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      console.log(existingUser);
      return res.status(422).json({ errors: "email alredy exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        organisations: {
          create: {
            name: `${firstName}'s Organisation`,
          },
        },
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ status: "Bad request", message: "Registration unsuccessful" });
  }
};

exports.login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(422).json({ errors: error.details });

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ status: "Bad request", message: "Authentication failed" });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: "Bad request", message: "Login unsuccessful" });
  }
};
