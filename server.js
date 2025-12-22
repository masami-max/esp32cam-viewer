const express = require("express");
const app = express();

// ★ バイナリ受信用（最大1MB）
app.use("/upload", express.raw({ type: "*/*", limit: "1mb" }));

app.get("/", (req, res) => {
  res.send("Render is running");
});

app.post("/upload", (req, res) => {
  console.log("POST /upload called");
  console.log("Received bytes:", req.body.length);
  res.send("OK");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
