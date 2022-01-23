import express from "express";
import cors from "cors";
import { useCurrentClient } from "../core";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  useCurrentClient().client.emit("debug", `API server started on port ${port}`);
});
