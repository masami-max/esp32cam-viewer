const express = require("express");
const app = express();

// JPEG を raw バイナリとして受け取る
app.use(express.raw({ type: "image/jpeg", limit: "10mb" }));

let latestImage = null;

// ESP32 からの画像アップロード
app.post("/upload", (req, res) => {
  if (!req.body || req.body.length === 0) {
    console.log("No image received");
    return res.sendStatus(400);
  }

  latestImage = req.body;
  console.log("Image received:", latestImage.length, "bytes");
  res.sendStatus(200);
});

// 最新画像を返す
app.get("/latest.jpg", (req, res) => {
  if (!latestImage) return res.status(404).send("No image yet");

  res.set("Content-Type", "image/jpeg");
  res.send(latestImage);
});

// Viewer
app.get("/view", (req, res) => {
  res.send(`
    <html>
    <head>
      <title>ESP32-CAM Viewer</title>
    </head>
    <body style="text-align:center;">
      <h1>ESP32-CAM Viewer</h1>
      <button onclick="refreshImage()">画像更新</button><br>
      <img id="cam" src="/latest.jpg" style="width:90%;max-width:600px;margin-top:20px;">
      <script>
        function refreshImage() {
          document.getElementById("cam").src = "/latest.jpg?t=" + Date.now();
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
