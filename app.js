const express = require('express');
const morgan = require('morgan');
const app = express();
const playStore = require('./playStoreData.js');
app.use(morgan('common'));

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
    if(sort) {
      if(!['rating', 'app'].includes(sort)) {
        return res  
          .status(400)
          .send('Sort must be one of rating or app');
      }
    }
    if(sort) {
      if(sort === "rating") {
        playStore.sort((a, b) => (a.Rating > b.Rating) ? 1 : ((b.Rating > a.Rating) ? -1 : 0));
      } else if(sort === "app") {
        playStore.sort((a, b) => (a.App > b.App) ? 1 : ((b.App > a.App) ? -1 : 0));
      } 
    }
      
    if(genres) {
      let values = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcat', 'Card'];
      if(!values.includes(genres)) {
        return res  
          .status(400)
          .send(`Genre must be one of ${values}`);
      }

      let results = playStore.filter(each => each.Genres === genres);
      return res.json(results);
      //playstore is array objects
      //each object has Genres
      //genres from request body
      //filter to see if playStore.Genres === genres
      //inside filter loop
    }
    return res.json(playStore);
});

module.exports = app;
