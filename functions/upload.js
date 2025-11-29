/**
 * upload.js
 * ESP32-CAM から受け取った画像を保存
 */

const fs = require("fs");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const imageBuffer = Buffer.concat(chunks);
    fs.writeFileSync("/tmp/latest.jpg", imageBuffer);
    res.send("OK");
  });
};
