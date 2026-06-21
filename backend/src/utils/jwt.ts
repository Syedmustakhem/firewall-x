import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateToken(
  userId: string,
  email: string,
  role: string
) {

  return jwt.sign(
    {
      userId,
      email,
      role
    },
    env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

}