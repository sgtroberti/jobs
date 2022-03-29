import express from "express";
import bodyParser from "body-parser";
import router from "./controllers/authController.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", router);

app.get("/", (req, res) => {
  res.send("Hello World teste 123");
});

app.listen(port, () => {
  console.log("Rodando na porta ", port);
});
