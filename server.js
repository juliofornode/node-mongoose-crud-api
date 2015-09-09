var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movies');

var movieSchema = mongoose.Schema({
  title: String,
  actor: String
});

var Movie = mongoose.model('Movie', movieSchema);

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./static'));

app.get('/api', function(req, res, next) {
  Movie.find().
    exec(function(err, movies) {
      if (err) { return next(err) }
      res.json(movies);
    })
});

app.post('/api', function(req, res, next) {
  var movie = new Movie({
    title: req.body.title,
    actor: req.body.actor
  });
  movie.save(function(err, movie) {
    if (err) { return next(err) }
    res.status(201).json(movie);
  })
});

app.delete('/api/:id', function (req, res) {
  Movie.findByIdAndRemove(req.params.id, function (err, doc) {
    res.json(doc);
  });
});

app.get('/api/:id', function (req, res) {
  Movie.findById(req.params.id, function (err, doc) {
    res.json(doc);
  });
});

app.put('/api/:id', function (req, res) {
  Movie.findById(req.params.id, function (err, movie) {
    movie.title = req.body.title;
    movie.actor = req.body.actor;
    movie.save(function(err, movie) {
      if (err) { return next(err) }
      res.status(201).json(movie);
    });
  });
});



app.listen(3000, function() {
  console.log('Listening on port 3000');
});
