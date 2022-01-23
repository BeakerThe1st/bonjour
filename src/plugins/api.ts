import express from "express";
import cors from "cors";
import { useCurrentClient } from "../core";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
});

app.get("/guild-info", async (req, res) => {
  const { client } = useCurrentClient();
  const guild = await client.guilds.fetch("332309672486895637");

  res.status(200).json({
    iconURL: guild.iconURL({ dynamic: true }),
    members: guild.memberCount,
    banner: guild.bannerURL(),
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  useCurrentClient().client.emit("debug", `API server started on port ${port}`);
});
