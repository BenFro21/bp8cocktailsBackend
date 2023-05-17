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
    seed: (req,res) => {
        sequelize.query(`
        DROP TABLE IF EXISTS cocktailIngredients;
        DROP TABLE IF EXISTS ingredients;
        DROP TABLE IF EXISTS cocktails;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            email VARCHAR(100),
            password VARCHAR(100)
        );

        CREATE TABLE cocktails (
            cocktail_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            title VARCHAR(100),
            description TEXT,
            recipe TEXT,
            image TEXT            
        );

        CREATE TABLE ingredients (
            ingredient_id SERIAL PRIMARY KEY, 
            name VARCHAR(100)
        );

        CREATE TABLE cocktailIngredients (
            cocktailIngredient_id SERIAL PRIMARY KEY,
            cocktail_id INTEGER REFERENCES cocktails(cocktail_id),
            ingredient_id INTEGER REFERENCES ingredients(ingredient_id)
        );

        INSERT INTO users (email, password)
        VALUES('Broad0601@gmail.com', 'abcdefg');

        INSERT INTO cocktails (user_id,title,description,recipe, image)
        VALUES(1, 'Manhattan', 'Classic whiskey drink. one of the oldest cocktails in America', '3 parts whiskey, 1 part sweet vermouth, splash of bitters, garnish with cherry', '${'./images/Manhattan.jpg'}'),
        (1,'Old Fashion', 'Classic Whiskey drink known for its sweeter taste', '3 parts whiskey, muttle orange, bitters, and cherry in small rocks glass, top with soda', '${'./images/1655745855495--Old Fashion.jpg'}'),
        (1,'Margarita', 'A favorite for all pallets', '3 parts tequila, 1 part lime, 1 part simple syrup, garnish with lime', '${'./images/Margarita.jpg'}'),
        (1,'Mojito','Refreshness inbound', '3 parts silver rum, 5 mint leafs muttled, simple syrup, garnish with lime', '${'./images/Mojito.jpg'}'),
        (1,'Moscow Mule', 'A christmas traditon', '3 parts vodka, 1part lime juice, top with ginger beer, garnish with lime', '${'./images/Manhattan.jpg'}');

        INSERT INTO ingredients (name)
        VALUES
        ('Soda'),
        ('Sweet Vermouth'),
        ('Bitters'),
        ('Cherry'),
        ('Orange'),
        ('Lime'),
        ('Simple Syrup'),
        ('Mint'),
        ('Ginger Beer'),
        ('Rum'),
        ('Whiskey'),
        ('Vodka'),
        ('Tequila'),
        ('Burbon'),
        ('Tripple Sec'),
        ('Gin');

        INSERT INTO cocktailIngredients (cocktail_id, ingredient_id)
        VALUES(1,11),(1,2),(1,3),(1,4),
        (2,11),(2,3),(2,5),(2,1),
        (3,13),(3,6),(3,7),(3,6),
        (4,10),(4,8),(4,7),(4,6),
        (5,12),(5,6),(5,9);

        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('err seeding the db', err))
    }
}