const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// JPEGなどのバイナリをそのまま受け取る
app.use(express.raw({ type: "image/jpeg", limit: "5mb" }));

const PORT = process.env.PORT || 3000;

// 画像保存パス
const IMAGE_PATH = path.join(__dirname, "images", "latest.jpg");

/**
 * トップページ（表示確認用）
 */
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>ESP32-CAM Image Test</h2>
        <img src="/image" style="max-width:100%;" />
      </body>
    </html>
  `);
});

/**
 * 最新画像を返す
 */
app.get("/image", (req, res) => {
  const filePath = fs.existsSync(IMAGE_PATH)
    ? IMAGE_PATH
    : path.join(__dirname, "images", "dummy.jpg");

  res.setHeader("Content-Type", "image/jpeg");
  fs.createReadStream(filePath).pipe(res);
});

/**
 * ESP32-CAM から画像を受け取る
 */
app.post("/upload", (req, res) => {
  if (!req.body || req.body.length === 0) {
    return res.status(400).send("No image data");
  }

  fs.writeFileSync(IMAGE_PATH, req.body);
  console.log("Image uploaded:", req.body.length, "bytes");

  res.send("OK");
});

// サーバ起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
