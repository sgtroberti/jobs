import express from "express";
import bodyParser from "body-parser";
import authRouter from "./controllers/authController.js";
import characterRouter from "./controllers/characterController.js";
import bookRouter from "./controllers/bookController.js";
import Book from "./models/book.js";
import Character from "./models/character.js";
import { seed } from "./seed/seed.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/char", characterRouter);
app.use("/book", bookRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(port, async () => {
  const testDB = await Book.find();
  if (!testDB[0]) {
    await Book.deleteMany({});
    await Character.deleteMany({});
    await seed();
  }
  console.log("Server running on port: ", port);
});
