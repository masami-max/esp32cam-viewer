// server.js（完全安定版・生バイナリ受信 → ブラウザ即時表示）

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== Static フォルダ =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// ===== 画像保持用バッファ =====
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

// ===== 画像を返す =====
app.get("/latest.jpg", (req, res) => {
  if (!latestImage) {
    return res.status(404).send("No image yet");
  }
  res.writeHead(200, { "Content-Type": "image/jpeg" });
  res.end(latestImage);
});

// ===== ビュー画面 =====
app.get("/view", (req, res) => {
  res.send(`
  <html>
    <body>
      <h2>ESP32-CAM Viewer</h2>
      <img id="cam" src="/latest.jpg" width="640"><br><br>
      <button onclick="reload()">画像更新</button>

      <script>
        function reload() {
          document.getElementById("cam").src = "/latest.jpg?t=" + Date.now();
        }
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
