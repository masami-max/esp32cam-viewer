const express = require("express");
const app = express();

const PORT = process.env.PORT || 10000;

/* 文字列を受け取るため */
app.use(express.text({ type: "*/*" }));

/* トップページ */
app.get("/", (req, res) => {
  res.send("<h1>Render is running</h1>");
});

/* ESP32 からの POST を受け取る */
app.post("/upload", (req, res) => {
  console.log("POST /upload called");
  console.log("Body:", req.body);
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
