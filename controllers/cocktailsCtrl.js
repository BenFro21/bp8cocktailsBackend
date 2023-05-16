require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect:'postgres',
    dialectOptions: {
        ssl:{
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    // get all cocktails and their ingredients 
    // get just cocktails and descriptions
    getAllCocktails: (req, res) => {
        let query = `SELECT title, description, image FROM cocktails;`
        sequelize.query(query)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    // get all ingredients 
    getIngredients: (req, res) => {
        let query= `SELECT * FROM ingredients;`
        sequelize.query(query)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },

    // get cocktail details get ingredients for paticular cocktail 
    getCocktailDetails: (req, res) => {
        let {id} = req.params
        console.log(id)
        let query = `
        SELECT c.title, c.description, c.recipe, c.image, ARRAY_AGG (i.name) ingredients FROM cocktails AS c
        JOIN cocktailingredients as ci 
        ON ci.cocktail_id = c.cocktail_id
        JOIN ingredients AS i
        ON ci.ingredient_id = i.ingredient_id
        WHERE c.cocktail_id = ${id}
        GROUP BY c.title, c.description, c.recipe, c.image
        ORDER BY c.title, c.description, c.recipe, c.image
        ;`
        sequelize.query(query)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    // add ingredients 

    addIngredient: (req, res) => {
        let {name} = req.body
        let query = `
        INSERT INTO ingredients (name)
        VALUES('${name}') RETURNING *;`
        sequelize.query(query)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))

    },
    // add cocktail
    addCocktail: (req, res) => {
        let {user_id} = req.body
        let {title, description, recipe, image} = req.body
        let query = `
        INSERT INTO cocktails (user_id, title, description, recipe, image)
        VALUES(${user_id}, '${title}', '${description}', '${recipe}', '${image}') RETURNING *;`
        sequelize.query(query)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    }, 

    // edit cocktail 
    editCocktail: (req, res) => {
        let {id} = req.params
        let {user_id, title, description, recipe, image} = req.body
        let query = `
        UPDATE cocktails SET
        user_id = ${user_id},
        title = '${title}',
        description = '${description}',
        recipe = '${recipe}',
        image = '${image}'
        WHERE cocktail_id = ${id}
        RETURNING *
        ;`
        sequelize.query(query)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))

    },
    // delete cocktail 
    deleteCocktail: (req, res) => {
        let {id} = req.params
        let query = `DELETE FROM cocktails WHERE cocktail_id = ${id}`
        sequelize.query(query)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    // delete ingredient
    deleteIngredient: (req,res) => {
        let {id} = req.params
        let query = `DELETE FROM ingredients WHERE ingredient_id=${id}`
        sequelize.query(query)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    }
}