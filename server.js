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
const multer = require('multer');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let latestImageBase64 = null;

// 画像受け取り API
app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image received');
  }

  latestImageBase64 = req.file.buffer.toString('base64');
  console.log("Image received: " + req.file.size + " bytes");

  res.send('Image uploaded OK');
});

// ブラウザから最新画像を取得
app.get('/latest-image', (req, res) => {
  if (!latestImageBase64) {
    return res.status(404).send('No image yet');
  }

  const img = Buffer.from(latestImageBase64, 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
    'Content-Length': img.length
  });
  res.end(img);
});
