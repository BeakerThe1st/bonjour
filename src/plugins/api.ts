import express from "express";
import cors from "cors";
import { useCurrentClient } from "../core";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
});

app.listen(5001, () => {
  useCurrentClient().client.emit("debug", "API server started");
});
