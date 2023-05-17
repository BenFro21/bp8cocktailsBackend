require('dotenv').config()
const jwt = require('jsonwebtoken')
const {SECRET} = process.env

module.exports = {
    isAuthenticated: (req, res, next) => {
        const headertoken = req.headers.authorization
        if(!headertoken){
            console.log('Err in auth middleware')
            res.sendStatus(401)
        }
        let token 

        try{
            token = jwt.verify(headertoken, SECRET)
        }catch(err){
            err.statusCode = 500
            throw err
        }

        if(!token){
            const error = new Error('Not Authenticated')
            error.statusCode = 401
            throw error
        }
        next()
    }
}