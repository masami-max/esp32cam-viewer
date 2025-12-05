const express = require("express");
const app = express();

// 最新画像をメモリに保持
let latestImage = null;

// ========== 画像アップロード（ESP32 → サーバー） ==========
app.post("/upload", express.raw({ type: "image/jpeg", limit: "10mb" }), (req, res) => {
  console.log("Image received:", req.body.length, "bytes");
  latestImage = req.body;   // 最新画像を保存
  res.send("OK");
});

// ========== 最新画像を返す ==========
app.get("/latest.jpg", (req, res) => {
  if (!latestImage) {
    return res.status(404).send("No image yet");
  }
  res.set("Content-Type", "image/jpeg");
  res.send(latestImage);
});

// ========== Web画面（ボタンで画像更新） ==========
app.get("/view", (req, res) => {
  res.send(`
    <html>
    <body style="text-align:center;">
      <h1>ESP32-CAM Viewer (Manual Refresh)</h1>

      <img id="cam" src="/latest.jpg" width="80%" style="border:1px solid #ccc;">
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

// ========== 動作確認用 ==========
app.get("/", (req, res) => {
  res.send("ESP32-CAM Viewer Server is running! /view へアクセスしてください。");
});

// ========== 起動 ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
