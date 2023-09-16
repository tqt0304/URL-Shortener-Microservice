require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = new Array();

function isValidURL(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

app.post('/api/shorturl', (req, res) => {
  if (isValidURL(req.body.url)) {
    let found = 0;
    let pos = 1;
    for (let i = 0; i < urls.length; i++) {
      if (urls[i] === req.body.url) {
        found = 1; 
        break;
      }
      ++pos;
    }
    if (!found) urls.push(req.body.url);
    res.json({original_url: urls[pos-1], short_url: pos});
  } else {
    res.json({error: 'invalid url'});
  }
})

app.get('/api/shorturl/:num', (req, res) => {
  if (req.params.num > urls.length) 
    res.json({error: 'No short URL found for the given input'});
  else 
    res.redirect(urls[req.params.num-1]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
