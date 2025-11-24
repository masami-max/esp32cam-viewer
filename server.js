const express = require("express");
const app = express();

// ルートアクセス → 動作確認用
app.get("/", (req, res) => {
  res.send("ESP32-CAM Viewer Server is running!");
});

// 起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
