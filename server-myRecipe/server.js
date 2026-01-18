const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let recipes = [
  {
    id: 1,
    title: 'עוגת שוקולד',
    description: 'עוגה מעולה וטעימה',
    ingredients: ['2 כוסות קמח', '1 כוס סוכר', '3 ביצים', '1/2 כוס קקאו'],
    instructions: ['תערבב את הקמח והסוכר', 'הוסף ביצים', 'הוסף קקאו', 'אפה 30 דקות ב-180 מעלות'],
    prepTime: 30,
    servings: 8,
    difficulty: 'בינוני'
  },
  {
    id: 2,
    title: 'שוקולד חם',
    description: 'משקה מיוחד וחם',
    ingredients: ['2 כוסות חלב', '100 גרם שוקולד', '1 כפית סוכר'],
    instructions: ['חמם את החלב', 'הוסף שוקולד', 'עירבב היטב'],
    prepTime: 10,
    servings: 2,
    difficulty: 'קל'
  }
];

// GET - כל המתכונים
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

// GET - מתכון ספציפי
app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) {
    return res.status(404).json({ message: 'המתכון לא נמצא' });
  }
  res.json(recipe);
});

// POST - מתכון חדש
app.post('/api/recipes', (req, res) => {
  const { title, description, ingredients, instructions, prepTime, servings, difficulty } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({ message: 'חובה למלא שם ותיאור' });
  }

  if (!prepTime || !servings) {
    return res.status(400).json({ message: 'חובה למלא זמן הכנה ומנות' });
  }

  // Convert ingredients to array if string
  let ingredientsArray = ingredients;
  if (typeof ingredients === 'string') {
    ingredientsArray = ingredients
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  // Convert instructions to array if string
  let instructionsArray = instructions;
  if (typeof instructions === 'string') {
    instructionsArray = instructions
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  const newRecipe = {
    id: recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1,
    title,
    description,
    ingredients: ingredientsArray,
    instructions: instructionsArray,
    prepTime: parseInt(prepTime),
    servings: parseInt(servings),
    difficulty: difficulty || 'בינוני'
  };

  recipes.push(newRecipe);
  res.status(201).json({ message: 'המתכון נוסף בהצלחה', recipe: newRecipe });
});

// PUT - עדכון מתכון
app.put('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) {
    return res.status(404).json({ message: 'המתכון לא נמצא' });
  }

  const { title, description, ingredients, instructions, prepTime, servings, difficulty } = req.body;

  if (title) recipe.title = title;
  if (description) recipe.description = description;
  if (ingredients) {
    recipe.ingredients = typeof ingredients === 'string'
      ? ingredients.split('\n').map(item => item.trim()).filter(item => item.length > 0)
      : ingredients;
  }
  if (instructions) {
    recipe.instructions = typeof instructions === 'string'
      ? instructions.split('\n').map(item => item.trim()).filter(item => item.length > 0)
      : instructions;
  }
  if (prepTime) recipe.prepTime = parseInt(prepTime);
  if (servings) recipe.servings = parseInt(servings);
  if (difficulty) recipe.difficulty = difficulty;

  res.json({ message: 'המתכון עודכן בהצלחה', recipe });
});

// DELETE - מחיקת מתכון
app.delete('/api/recipes/:id', (req, res) => {
  const index = recipes.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'המתכון לא נמצא' });
  }

  const deletedRecipe = recipes.splice(index, 1);
  res.json({ message: 'המתכון נמחק בהצלחה', recipe: deletedRecipe[0] });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'שגיאה בשרת' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🍳 Server running on http://localhost:${PORT}`);
  console.log(`📝 GET /api/recipes - Get all recipes`);
  console.log(`➕ POST /api/recipes - Add new recipe`);
  console.log(`📝 GET /api/recipes/:id - Get specific recipe`);
  console.log(`✏️ PUT /api/recipes/:id - Update recipe`);
  console.log(`🗑️ DELETE /api/recipes/:id - Delete recipe`);
});