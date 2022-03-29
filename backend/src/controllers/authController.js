import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists" });
    }
    const newUser = await User.create(req.body);
    newUser.password = undefined;

    return res.send({ newUser });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed: " + err });
  }
});

router.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  const userLogin = await User.findOne({ email }).select("+password");

  if (!userLogin || !(await bcrypt.compare(password, userLogin.password))) {
    return res.status(400).send({ error: "Incorrect user or password" });
  }

  userLogin.password = undefined;
  return res.send({ userLogin });
});

export default router;
