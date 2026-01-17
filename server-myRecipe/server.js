const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let recipes = [
  { id: 1, title: 'cake', description: 'tasty', ingredients: 'flour,sugar', instructions: 'bake 30 min' },
  { id: 2, title: 'chocolate', description: 'special', ingredients: 'chocolate,milk', instructions: 'melt chocolate' }
];

// GET כל המתכונים
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

// POST מתכון חדש
app.post('/api/recipes', (req, res) => {
  const newRecipe = { id: recipes.length + 1, ...req.body };
  recipes.push(newRecipe);
  res.json({ message: 'Recipe added', recipe: newRecipe });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
