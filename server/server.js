require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../src/config/config')
const path = require('path');
const app = express();
app.use(
    '/v1',
    createProxyMiddleware({
      target: config.apiURL,
      changeOrigin: true,
    })
  );
app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = process.env.PORT || 3000
app.listen(port);