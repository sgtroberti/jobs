import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import Character from "../models/character.js";

const characterRouter = express.Router();

characterRouter.use(authMiddleware);

characterRouter.get("/", async (req, res) => {
  try {
    return res.send(await Character.find());
  } catch (error) {
    return res.status(400).send({ error: "Can't fetch, try again " + error });
  }
});

characterRouter.get("/:charId", async (req, res) => {
  try {
    return res.send(await Character.findById(req.params.charId));
  } catch (error) {
    return res.status(400).send({ error: "Can't fetch, try again " + error });
  }
});

characterRouter.get("/:charId/booksInfo", async (req, res) => {
  try {
    return res.send(
      await Character.findById(req.params.charId)
        .populate(["povBooks"])
        .select("povBooks")
    );
  } catch (error) {
    return res.status(400).send({ error: "Can't fetch, try again " + error });
  }
});

export default characterRouter;
