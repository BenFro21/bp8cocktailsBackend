require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const {seed} = require('./utils/seed')
const {
    getAllCocktails,
    getIngredients,
    getCocktailDetails,
    addIngredient,
    addCocktail,
    editCocktail,
    deleteCocktail,
    deleteIngredient
    } = require('./controllers/cocktailsCtrl')


app.use(express.json());
app.use(cors());

// seeding the db route
app.post('/seed', seed)

// cocktails routes 
app.get('/cocktails', getAllCocktails)
app.get('/ingredients', getIngredients)
app.get('/cocktails/:id', getCocktailDetails)
app.post('/ingredients', addIngredient)
app.post('/cocktails', addCocktail)
app.put('/cocktails/:id', editCocktail)
app.delete('/cocktails/:id', deleteCocktail)
app.delete('/ingredients/:id', deleteIngredient)




app.listen(9000, () => console.log(`My power level is over 9000`))