const express = require('express');
const app = express();

app.use(express.json());

let movies = [
  { id: 1, title: "Inception", genre: "Sci-Fi", rating: 5, recommendation: "Yes" },
  { id: 2, title: "Titanic", genre: "Romance", rating: 4, recommendation: "Yes" },
  { id: 3, title: "Batman", genre: "Action", rating: 3, recommendation: "No" }
];

let idCounter = 4;

app.get('/movies', (req, res) => {
  const { rating } = req.query;

  if (rating) {
    const filtered = movies.filter(m => m.rating == rating);
    return res.json(filtered);
  }

  res.json(movies);
});

app.post('/movies', (req, res) => {
  const { title, genre, rating, recommendation } = req.body;

  const newMovie = {
    id: idCounter++,
    title,
    genre,
    rating,
    recommendation
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const { title, genre, rating, recommendation } = req.body;

  if (title) movie.title = title;
  if (genre) movie.genre = genre;
  if (rating) movie.rating = rating;
  if (recommendation) movie.recommendation = recommendation;

  res.json(movie);
});

app.delete('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const deleted = movies.splice(index, 1);
  res.json(deleted[0]);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});