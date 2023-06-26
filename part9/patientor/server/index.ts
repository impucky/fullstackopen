import express from "express";
import cors from "cors";

const app = express();

app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
