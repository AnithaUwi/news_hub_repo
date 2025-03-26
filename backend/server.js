require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Enhanced API endpoint with better error handling
app.get('/api/news', async (req, res) => {
  try {
    const { category = 'general', q: query } = req.query;
    
    // Validate inputs
    if (category && !/^[a-z]+$/i.test(category)) {
      return res.status(400).json({ error: 'Invalid category parameter' });
    }

    const endpoint = query ? 'everything' : 'top-headlines';
    const params = new URLSearchParams({
      ...(query ? { q: query } : { category }),
      pageSize: 12,
      apiKey: process.env.NEWS_API_KEY
    });

    const apiUrl = `https://newsapi.org/v2/${endpoint}?${params}`;
    
    const response = await fetch(apiUrl, {
      headers: { 
        'User-Agent': 'NewsHub/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`NewsAPI Key: ${process.env.NEWS_API_KEY ? 'Loaded' : 'Missing'}`);
});