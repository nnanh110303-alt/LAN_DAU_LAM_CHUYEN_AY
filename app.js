const express = require('express');
const app = express();
const port = 3000;

app.get('/trang trinh', (req, res) => {
  res.send('Xin chào! Server Express đang chạy thành công!');
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});