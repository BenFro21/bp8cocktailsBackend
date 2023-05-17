require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const {seed} = require('./utils/seed')
const {getAllCocktails,getIngredients,getCocktailDetails,addIngredient,addCocktail,editCocktail,deleteCocktail,deleteIngredient} = require('./controllers/cocktailsCtrl')
const {login, register} = require('./controllers/usersCtrl')
const {isAuthenticated} = require('./utils/isAuthenticated')


app.use(express.json());
app.use(cors());

// seeding the db route
app.post('/seed', seed)

//user routes 
app.post('/login', login)
app.post('/register', register)

// cocktails routes 
app.get('/cocktails', getAllCocktails)
app.get('/ingredients', getIngredients)
app.get('/cocktails/:id', getCocktailDetails)
app.post('/ingredients', addIngredient)
app.post('/cocktails', isAuthenticated, addCocktail)
app.put('/cocktails/:id', isAuthenticated, editCocktail)
app.delete('/cocktails/:id', isAuthenticated, deleteCocktail)
app.delete('/ingredients/:id', isAuthenticated, deleteIngredient)




app.listen(9000, () => console.log(`My power level is over 9000`))