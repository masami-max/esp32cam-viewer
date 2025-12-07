const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// ★ 生バイナリをそのまま受け取れる設定
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb' }));

// 最新画像の保存場所
let latestImage = null;

// ★ ESP32 から画像を受信（生バイナリ方式）
app.post("/upload", (req, res) => {
  if (!req.body || req.body.length === 0) {
    console.log("No binary data received");
    return res.status(400).send("No image received");
  }

  latestImage = Buffer.from(req.body);
  console.log("Image received:", latestImage.length, "bytes");
  res.sendStatus(200);
});

// ★ 最新画像を返す
app.get("/latest.jpg", (req, res) => {
  if (!latestImage) {
    return res.status(404).send("No image yet");
  }

  res.set("Content-Type", "image/jpeg");
  res.send(latestImage);
});

// ★ Viewer ページ
app.get("/view", (req, res) => {
  res.send(`
    <html>
    <head>
      <title>ESP32-CAM Viewer</title>
    </head>
    <body style="text-align:center;">
      <h1>ESP32-CAM Viewer</h1>
      <button onclick="refreshImage()">画像更新</button><br>
      <img id="cam" src="/latest.jpg" style="width:90%;max-width:600px;margin-top:20px;">
      <script>
        function refreshImage() {
          document.getElementById("cam").src = "/latest.jpg?t=" + Date.now();
        }
      </script>
    </body>
    </html>
  `);
});

// ★ ポート番号
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
