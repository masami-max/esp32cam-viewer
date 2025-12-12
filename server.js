// server.js（完全・安定版）

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ★ バイナリ受信を壊すので削除 ★
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// ===== Static ファイル =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/public", express.static(path.join(__dirname, "public")));


// ===== 最新画像を保持 =====
let latestImage = null;


// ===== 画像 POST 受信 =====
app.post("/upload", (req, res) => {
  let data = [];

  req.on("data", chunk => {
    data.push(chunk);
  });

  req.on("end", () => {
    latestImage = Buffer.concat(data);
    console.log(`Image received: ${latestImage.length} bytes`);
    res.status(200).send("OK");
  });
});


// ===== 最新 JPEG を返す =====
app.get("/latest.jpg", (req, res) => {
  if (!latestImage) return res.status(404).send("No image");

  res.writeHead(200, { "Content-Type": "image/jpeg" });
  res.end(latestImage);
});


// ===== ビュー画面 =====
app.get("/view", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>ESP32-CAM Viewer</title>
      <style>
        body { text-align: center; margin-top: 20px; font-family: sans-serif; }
        img { width: 320px; border: 1px solid #ccc; }
      </style>
    </head>
    <body>
      <h2>ESP32-CAM Viewer</h2>
      <img id="cam" src="/latest.jpg" />

      <script>
        function updateImage() {
          document.getElementById("cam").src =
            "/latest.jpg?t=" + Date.now();
        }
        setInterval(updateImage, 1000);
      </script>
    </body>
    </html>
  `);
});


// ===== Render Port =====
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
