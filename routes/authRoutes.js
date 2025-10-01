import express from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { jwtVerify } from "jose";
import JWT_SECRET from "../utils/getJwtSecret.js";

const router = express.Router();

// @route       POST api/auth/register
// @desc        Register new user
// @access      Public
router.post("/register", async (req, res, next) => {
  const registerationIsAllowed = process.env.ALLOW_REGISTRATIONS;
  if (!registerationIsAllowed) {
    res.status(400);
    throw new Error("Registrations are not allowed as of now.");
  }
  try {
    const { name, username, email, password } = req.body || {};
    if (!name?.trim() || !username?.trim() || !email?.trim() || !password?.trim()) {
      res.status(400);
      throw new Error("Please fill all the fields: name, username, email, password");
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    //Create Tokens
    const payload = { userId: user._id.toString() };
    const accessToken = await generateToken(payload, "5m");
    const refreshToken = await generateToken(payload, "30d");

    //Set refresh token in HTTP only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENC === "production" ? "none" : "lax", //You can later create a proxy on Vercel and make this lax
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    res.status(201).json({ accessToken, user: { id: user._id, name: user.name, username: user.username, email: user.email } });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route       POST api/auth/login
// @desc        Authenticate user
// @access      Public
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {}; //Fixes an error

    if (!email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields: email, password");
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid Credentials");
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid Credentials");
    }
    // Verified match from here onward

    //Create Tokens
    const payload = { userId: user._id.toString() };
    const accessToken = await generateToken(payload, "1m");
    const refreshToken = await generateToken(payload, "30d");

    //Set refresh token in HTTP only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENC === "production" ? "none" : "lax", //You can later create a proxy on Vercel and make this lax
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    res.status(201).json({ accessToken, user: { id: user._id, name: user.name, username: user.username, email: user.email, profile: user.profile } });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route       POST api/auth/logout
// @desc        Logout user, clear refresh token
// @access      Public
router.post("/logout", (req, res) => {
  //It doesn't really clear it. It instead creates a new cookie that expires now. So it is replaced on the client to mimic the removal of it.
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @route       POST api/auth/refresh
// @desc        Generate new access token from refresh token
// @access      Public (Needs valid refresh token in cookie)

router.post("/refresh", async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    console.log("Refreshing token...");

    if (!token) {
      res.status(401);
      throw new Error("No refresh token");
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const user = await User.findById(payload.userId);

    if (!user) {
      res.status(401);
      throw new Error("No user");
    }

    const newAccessToken = await generateToken({ userId: user._id.toString() }, "1m");

    res.json({ accessToken: newAccessToken, user: { id: user._id, name: user.name, username: user.username, email: user.email } });
  } catch (err) {
    res.status(401);
    next(err);
  }
});

export default router;
