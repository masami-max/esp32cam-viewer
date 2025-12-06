const express = require("express");
const multer = require("multer");

const app = express();

// バッファとして受け取る
const upload = multer({
  storage: multer.memoryStorage()
});

// 最新画像を保存する変数
let latestImage = null;

// ESP32 からのアップロード処理
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
    return res.sendStatus(400);
  }

  latestImage = req.file.buffer;
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

// Viewer ページ
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

// ポート
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
