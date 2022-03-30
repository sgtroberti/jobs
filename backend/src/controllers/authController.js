import express, { query } from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/auth.js";

const authRouter = express.Router();

const generateToken = (params = {}) => {
  return jwt.sign({ params }, jwtSecret, {
    expiresIn: 86400,
  });
};

authRouter.get("/", async (req, res) => {
  return res.send(await User.find());
});

authRouter.post("/signup", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists" });
    }
    const newUser = await User.create(req.body);
    newUser.password = undefined;

    return res.send({ newUser, token: generateToken({ id: newUser.id }) });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed: " + err });
  }
});

authRouter.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  const userLogin = await User.findOne({ email }).select("+password");

  if (!userLogin || !(await bcrypt.compare(password, userLogin.password))) {
    return res.status(400).send({ error: "Incorrect user or password" });
  }

  userLogin.password = undefined;

  return res.send({ userLogin, token: generateToken({ id: userLogin.id }) });
});

export default authRouter;
