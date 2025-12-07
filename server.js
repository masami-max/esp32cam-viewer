const express = require("express");
const multer = require("multer");

const app = express();

// バッファとして受け取る
const upload = multer({
  storage: multer.memoryStorage()
});

// 最新画像を保存する変数（null のままで OK）
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

// 最新画像を返す（404 を返さない → 画像が消えなくなる）
app.get("/latest.jpg", (req, res) => {
  if (!latestImage) {
    // 初回のみ「画像なし」だが 404 を返すとブラウザが画像を消すため 204 にする
    return res.status(204).end();
  }

  // 通常は最新の JPEG を返す
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

      <img id="cam" src="/latest.jpg" 
           style="width:90%;max-width:600px;margin-top:20px;border:1px solid #ccc;">

      <script>
        function refreshImage() {
          const img = document.getElementById("cam");
          img.src = "/latest.jpg?t=" + Date.now(); // キャッシュ防止
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
