const express = require('express');
const morgan = require('morgan');
const app = express();
const playStore = require('./playStoreData.js');
app.use(morgan('common'));

app.get('/apps', (req, res) => {
  const { sort } = req.query;
    if(sort) {
      if(!['rating', 'app'].includes(sort)) {
        return res  
          .status(400)
          .send('Sort must be one of rating or app');
      }
    }

    if(sort) {
      playStore.sort((a, b) => (a.rating > b.raing) ? 1 : ((b.rating > a.rating) ? -1 : 0));
      console.log(playStore);
    }
    res.json(playStore);
  //sort= rating or app, otherwise error, if no value, no sort
  //genres=If genres, values = Action, Puzzle, Strategy, Casual, Arcat, Card
  //genres: otherwise error. Filter list by value given
});


app.listen(8000, () => {
  console.log('Server started on http://localhost:8000');
});
