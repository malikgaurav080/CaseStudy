const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const sk = process.env.ADMIN_SECRET_KEY;

const authAdmin = (req, res, next)=>{

    try {

        let token = req.headers.authorization;
        if(token){
            token = token.split(" ")[1];
            jwt.verify(token, sk);
        }
        else{
            return res.status(401).json({message: "Unauthorized User"});
        }

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({message: "Unauthorized User"});
    }

}

module.exports = authAdmin;