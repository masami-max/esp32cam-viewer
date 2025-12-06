// ===============================
// ESP32-CAM Viewer（完全手動更新版）
// ===============================

const express = require("express");
const multer  = require("multer");

const app = express();
const upload = multer();

// 最新の JPEG 画像を保存する変数
let latestImage = null;

// ESP32 から画像アップロード（POST）
// ★絶対に req.file.buffer を使うこと！★
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file || !req.file.buffer) {
    console.log("No file received!");
    return res.status(400).send("No file received");
  }

  latestImage = req.file.buffer;  // ← 正しい！
  console.log("Image received:", latestImage.length, "bytes");

  res.sendStatus(200);
});

// 最新画像を返す
app.get("/latest.jpg", (req, res) => {
  if (!latestImage) {
    return res.status(404).send("No image yet");
  }
  res.set("Content-Type", "image/jpeg");
  res.send(latestImage);
});

// 手動ビュー
app.get("/view", (req, res) => {
  res.send(`
    <html>
    <head>
      <title>ESP32-CAM Viewer (Manual Refresh)</title>
      <style>
        body { text-align:center; }
        #cam {
          width: 90%;
          max-width: 600px;
          border: 2px solid #888;
          margin-top: 20px;
        }
        button {
          margin-top: 20px;
          padding: 10px 25px;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <h1>ESP32-CAM Viewer（Manual Refresh）</h1>
      <button onclick="refreshImage()">画像更新</button>
      <br>
      <img id="cam" src="/latest.jpg" alt="No image">

      <script>
        function refreshImage() {
          document.getElementById("cam").src = "/latest.jpg?t=" + Date.now();
        }
      </script>
    </body>
    </html>
  `);
});

// Render ポート
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
