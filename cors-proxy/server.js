const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('Missing url parameter');
  }
  request(url).pipe(res);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`CORS proxy server running on port ${port}`);
});