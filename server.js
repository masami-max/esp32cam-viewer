const express = require("express");
const app = express();

// 最新画像をメモリに保持
let latestImage = null;

// ESP32 → upload
app.post("/upload", express.raw({ type: "image/jpeg", limit: "10mb" }), (req, res) => {
  console.log("Image received:", req.body.length, "bytes");
  latestImage = req.body;
  res.send("OK");
});

// ブラウザ → 最新画像取得
app.get("/latest.jpg", (req, res) => {
  if (!latestImage) return res.status(404).send("No image yet");
  res.set("Content-Type", "image/jpeg");
  res.send(latestImage);
});

// ブラウザ → ビューページ
app.get("/view", (req, res) => {
  res.send(`
    <html>
    <body style="text-align:center;">
      <h1>ESP32-CAM Viewer</h1>
      <img id="cam" src="/latest.jpg" width="80%">
      <br><br>
      <button onclick="refreshImg()" style="font-size:20px;">画像更新</button>

      <script>
        function refreshImg() {
          document.getElementById("cam").src = "/latest.jpg?t=" + Date.now();
        }
      </script>
    </body>
    </html>
  `);
});

// 起動メッセージ
app.get("/", (req, res) => {
  res.send("ESP32-CAM Viewer Server is running! /view にアクセスしてください。");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
