import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import Book from "../models/book.js";

const bookRouter = express.Router();

bookRouter.use(authMiddleware);

bookRouter.get("/", async (req, res) => {
  try {
    return res.send(await Book.find());
  } catch (error) {
    return res.status(400).send({ error: "Can't fetch, try again " + error });
  }
});

bookRouter.get("/:bookId/cover", async (req, res) => {
  try {
    return res.send(await Book.findById(req.params.bookId).select("cover"));
  } catch (error) {
    return res.status(400).send({ error: "Can't fetch, try again " + error });
  }
});

export default bookRouter;
