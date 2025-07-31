// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(cors())

app.get('/api/news', async (req, res) => {
  console.log("request recieved")
  const query = req.query.q || '';
  const url = `https://newsapi.org/v2/top-headlines?country=us&q=${query}&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error fetching news', err });
  }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
