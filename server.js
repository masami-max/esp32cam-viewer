// server.js
import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

let latestImage = null; // ← ESP32 から届いた最新JPEGを保存するバッファ

//----------------------------------------------------
// ① ESP32-CAM から JPEG を受け取るエンドポイント
//----------------------------------------------------
app.post("/upload", (req, res) => {
  const chunks = [];

  req.on("data", (chunk) => {
    chunks.push(chunk); // 受信データを配列に蓄積
  });

  req.on("end", () => {
    latestImage = Buffer.concat(chunks); // 完成した JPEG
    console.log(`Image received: ${latestImage.length} bytes`);
    res.status(200).send("OK");
  });

  req.on("error", (err) => {
    console.error("Upload error:", err);
    res.status(500).send("Upload failed");
  });
});

//----------------------------------------------------
// ② ブラウザが最新画像を取得するエンドポイント
//----------------------------------------------------
app.get("/snapshot", (req, res) => {
  if (!latestImage) {
    return res.status(404).send("No image yet");
  }

  res.set("Content-Type", "image/jpeg");
  res.send(latestImage); // 完成した JPEG を一括送信（←超重要）
});

//----------------------------------------------------
// ③ 静的ファイル配信（あなたの index.html）
//----------------------------------------------------
app.use(express.static("public"));

//----------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
