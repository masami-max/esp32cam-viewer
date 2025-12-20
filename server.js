const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT;

// ===== 画像保存先 =====
const IMAGE_PATH = path.join(__dirname, "latest.jpg");

// ===== 生バイナリ(JPEG)を受け取る設定 =====
app.use(
  "/upload",
  express.raw({
    type: "image/jpeg",
    limit: "5mb",
  })
);

// ===== 画像アップロード =====
app.post("/upload", (req, res) => {
  if (!req.body || req.body.length === 0) {
    return res.status(400).send("No image data");
  }

  fs.writeFileSync(IMAGE_PATH, req.body);
  console.log("Image received:", req.body.length, "bytes");

  res.send("OK");
});

// ===== 最新画像表示 =====
app.get("/latest.jpg", (req, res) => {
  if (!fs.existsSync(IMAGE_PATH)) {
    return res.status(404).send("No image yet");
  }
  res.sendFile(IMAGE_PATH);
});

// ===== トップページ =====
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>ESP32-CAM Image Test</title></head>
      <body>
        <h1>ESP32-CAM Image Test</h1>
        <img src="/latest.jpg" style="max-width:100%;" />
      </body>
    </html>
  `);
});

// ===== 起動 =====
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
