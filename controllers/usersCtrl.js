const bcrypt = require("bcryptjs");
require('dotenv').config();
const {CONNECTION_STRING,SECRET} = process.env;
const Sequelize = require('sequelize');
const jwt = require("jsonwebtoken");

const createToken = (email,id) => {
    return jwt.sign(
        {
            email,
            id,
        },
        SECRET,
        {
            expiresIn: "2 days"
        }
    )
}

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect:'postgres',
    dialectOptions: {
        ssl:{
            rejectUnauthorized: false
        }
    }
})


module.exports = {
    
    register: (req, res) => {
        const {email, password} = req.body;
        console.log(email, password)
        sequelize.query(`SELECT * FROM users WHERE email = '${email}'`)
        .then((dbRes) => {
            if(dbRes[0][0]){
                return res.status(400).send("Email already in use try logging in")
            }else{
                let salt = bcrypt.genSaltSync(10);
                const passhash = bcrypt.hashSync(password, salt);
                sequelize.query(`
                INSERT INTO users(email, password) VALUES('${email}', '${passhash}');
                SELECT * FROM users WHERE email = '${email}';
                `)
                .then(dbRes => {
                    delete dbRes[0][0].passhash;
                    const token = createToken(email, dbRes[0][0].user_id)
                    const userToSend = {...dbRes[0][0], token}
                    res.status(200).send(userToSend)
                })
                .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
    },

    login: (req,res) => {
        const {email, password} = req.body;
        sequelize.query(`SELECT * FROM users WHERE email='${email}'`)
        .then(dbRes => {
            if(!dbRes[0][0]){
                return res.status(400).send("Account not found")
            }
            console.log(dbRes[0][0])
            const authenticated = bcrypt.compareSync(
                password,
                
                dbRes[0][0].password
            );
            if(!authenticated) {
                res.status(403).send("incorrect password")
            }
            delete dbRes[0][0].passhash
            const token = createToken(email, dbRes[0][0].user_id)
            const userToSend = {...dbRes[0][0], token}
            res.status(200).send(userToSend)
        })
        .catch(err => console.log(err))
    }
}