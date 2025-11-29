/**
 * latest.js
 * 最新の画像を返す
 */

const fs = require("fs");

module.exports = async (req, res) => {
  const path = "/tmp/latest.jpg";

  if (!fs.existsSync(path)) {
    return res.status(404).send("No image yet");
  }

  const image = fs.readFileSync(path);
  res.setHeader("Content-Type", "image/jpeg");
  res.send(image);
};
