import { jwtVerify } from "jose";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import JWT_SECRET from "../utils/getJwtSecret.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const token = authHeader.split(" ")[1]; // to get the actual token
    const { payload } = await jwtVerify(token, JWT_SECRET); //Throws an error if fails

    console.log("Payload:", payload);
    const user = await User.findById(payload.userId).select("_id name username email");

    if (!user) {
      //We refetch and check to make sure the token is still valid. It is one thing to verify it, but since JWT is stateless, it is important to verify everything all the time
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    next(); // Move on
  } catch (err) {
    console.error(err);
    res.status(401);
    next(new Error("Not authorized, token failed"));
  }
};
