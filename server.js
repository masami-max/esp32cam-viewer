const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 画像保存パス
const IMAGE_PATH = path.join(__dirname, "images", "latest.jpg");

/**
 * トップページ（テスト用）
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
 * 画像を返す
 */
app.get("/image", (req, res) => {
  // まだESP32から画像が来ていない場合はダミーを返す
  const filePath = fs.existsSync(IMAGE_PATH)
    ? IMAGE_PATH
    : path.join(__dirname, "images", "dummy.jpg");

  res.setHeader("Content-Type", "image/jpeg");
  fs.createReadStream(filePath).pipe(res);
});

// サーバ起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
