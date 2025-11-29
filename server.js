const express = require("express");
const app = express();
const path = require("path");

// 画像をメモリに保持
let latestImage = null;

// 画像アップロード（ESP32-CAM → サーバー）
app.post("/upload", express.raw({ type: "image/jpeg", limit: "10mb" }), (req, res) => {
  console.log("Image received:", req.body.length, "bytes");
  latestImage = req.body;   // 最新画像を保存
  res.send("OK");
});

// 最新画像を返す（viewページから使う）
app.get("/latest.jpg", (req, res) => {
  if (!latestImage) {
    return res.status(404).send("No image yet");
  }
  res.set("Content-Type", "image/jpeg");
  res.send(latestImage);
});

// Web画面（ブラウザ用）
app.get("/view", (req, res) => {
  res.send(`
    <html>
    <body style="text-align:center;">
      <h1>ESP32-CAM Viewer</h1>
      <img id="cam" src="/latest.jpg" width="80%">
      <script>
        setInterval(() => {
          document.getElementById("cam").src = "/latest.jpg?t=" + new Date().getTime();
        }, 2000);
      </script>
    </body>
    </html>
  `);
});

// 動作確認用ルート
app.get("/", (req, res) => {
  res.send('ESP32-CAM Viewer Server is running! /view にアクセスしてください。');
});

// 起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
