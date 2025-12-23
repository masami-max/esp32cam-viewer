const express = require("express");
const fs = require("fs");
const app = express();

app.use("/upload", express.raw({ type: "*/*", limit: "2mb" }));

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>ESP32-CAM Image Test</h1>
        <img src="/latest.jpg" style="max-width:100%;" />
      </body>
    </html>
  `);
});

app.post("/upload", (req, res) => {
  console.log("POST /upload called");
  console.log("Received bytes:", req.body.length);

  // ★ メモリ上に保存（再起動まで有効）
  fs.writeFileSync("latest.jpg", req.body);

  res.send("OK");
});

app.get("/latest.jpg", (req, res) => {
  if (!fs.existsSync("latest.jpg")) {
    return res.status(404).send("No image yet");
  }
  res.sendFile(__dirname + "/latest.jpg");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
