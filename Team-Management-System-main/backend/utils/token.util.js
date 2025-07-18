import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, teamIds: user.teams },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "1h",
    }
  );
};

export const generateAccessToken = (user) => {
  const secret = isRefresh
    ? process.env.JWT_REFRESH_SECRET
    : process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};
