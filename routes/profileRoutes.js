import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();

// @route       GET api/profile/:username
// @desc        View a user's profile
// @access      Private (TODO)
router.get("/:username", protect, async (req, res, next) => {
  try {
    // First verify if the user exists
    const username = req.params.username;
    const user = await User.findOne({ username: username }).select("username profile");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    //Check if the user is the same as the one being modified
    const ownProfile = user._id.equals(req.user._id); //True if visiting your own profile

    //Return the result
    res.json({ ownProfile, user });
  } catch (error) {
    next(error);
  }
});

// @route       PUT api/profile/:username
// @desc        Allow user to edit own profile
// @access      Private (TODO)
// @requires    avatar, description
router.put("/:username", protect, async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username }).select("username profile");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    // Check if the modifying user id exists
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      res.status(400);
      throw new Error("User not found");
    }

    //Check if the user is the same as the one being modified
    if (!user._id.equals(req.user._id)) {
      res.status(403);
      throw new Error("User not authorized to perform this update");
    }

    //Authorized -- perform the update:
    user.profile.avatar = req.body.avatar || user.profile.avatar;
    user.profile.description = req.body.description || user.profile.description;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

export default router;
