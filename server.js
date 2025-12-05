// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// メモリ内に最新画像を保持（高速応答）
let latestImageBuffer = null;

// --- 静的ファイル（static フォルダ）を配信 ---
app.use(express.static(path.join(__dirname, "static")));

// --- 画像アップロード（ESP32 -> サーバー） ---
// image/jpeg をそのまま受け取る（最大 10MB）
app.post("/upload", express.raw({ type: "image/jpeg", limit: "10mb" }), (req, res) => {
  try {
    console.log("Image received:", req.body.length, "bytes");
    latestImageBuffer = req.body;

    // /tmp/latest.jpg にも書き出しておく（Render上での確認や再起動後の振る舞い確認用）
    try { fs.writeFileSync("/tmp/latest.jpg", latestImageBuffer); } catch (e) { /* ignore if not writable */ }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Upload error");
  }
});

// --- 最新画像を返す ---
app.get("/latest.jpg", (req, res) => {
  // 優先：メモリ内、次：/tmp/latest.jpg、なければ 404
  if (latestImageBuffer && latestImageBuffer.length > 0) {
    res.set("Content-Type", "image/jpeg");
    return res.send(latestImageBuffer);
  }
  const tmpPath = "/tmp/latest.jpg";
  if (fs.existsSync(tmpPath)) {
    const buf = fs.readFileSync(tmpPath);
    res.set("Content-Type", "image/jpeg");
    return res.send(buf);
  }
  return res.status(404).send("No image yet");
});

// --- view ルート（static/index.html を返す） ---
app.get("/view", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

// --- 健康チェック用ルート ---
app.get("/", (req, res) => {
  res.send("ESP32-CAM Viewer Server is running! visit /view");
});

// 起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
