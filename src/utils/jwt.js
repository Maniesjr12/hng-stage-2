const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.userId, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

const verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: "Unauthorized", message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "Unauthorized", message: "Invalid token" });
  }
};

module.exports = { generateToken, verifyToken };
