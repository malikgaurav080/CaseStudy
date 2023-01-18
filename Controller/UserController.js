const userModel = require('../models/User');
const userKeys = require('../models/keys');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const NodeCache = require('node-cache')
const myCache = new NodeCache()

const { wrongAlert, loggedIn, signupAlert, lockerRequest } = require('../mail/mailAlert')
const { validation } = require('../utills/validationSchema');
const { encrypt, decrypt} = require('../utills/AES')
const { Keyvalidation } = require('../utills/keysValidation')



  

const signUpUser = async (req, res) =>{

    const {username, email, password, key1, key2, key3, key4, key5} = req.body;
    try {
        const { error } = validation({ 
            email:req.body.email, 
            password:req.body.password
        });
        
		if (error)
			return res.status(400).json({ error: true, message: error.details[0].message });

        const existingUser = await userModel.findOne({ email : email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await userModel.create({
            email: email,
            password: hashedPassword,
            username: username
        });

        const err  = Keyvalidation(
            [req.body.key1,req.body.key2,req.body.key3,req.body.key4,req.body.key5]
            );

        if (err){
            await userModel.findByIdAndRemove(result.id);
            return res.status(400).json({ error: true,message: err});
        }

        const keys = await userKeys.create({
            userId: result.id,
            key1: encrypt(key1),
            key2: encrypt(key2),
            key3: encrypt(key3),
            key4: encrypt(key4),
            key5: encrypt(key5)
        });

        signupAlert(result.email);
        res.status(201).json({error: false, message: "Account created sucessfully"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:true,Message:"Internal server error!!"});
    }

}



const logInUser = async (req, res)=>{
    
    const {email, password} = req.body;

    try {
        const { error } = validation({
            email:req.body.email, 
            password:req.body.password
        });

        if (error)
			return res.status(400).json({ error: true, message: error.details[0].message });
        
        const existingUser = await userModel.findOne({ email : email});
        if(!existingUser){
            return res.status(404).json({message: "User not found"});
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if(!matchPassword){

            wrongAlert(existingUser.email);  
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const token = jwt.sign({email : existingUser.email, id : existingUser._id }, process.env.SECRET_KEY, {expiresIn:'15m'});

        loggedIn(existingUser.email);
        res.status(200).json({message: "Logged in sucessfully", token: token, error: false});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }

}




const profileDetails = async(req, res) => {
    userModel.find({email : req.email}, (err, docs) => {
        if (!err) {
            const token = jwt.sign({email : docs.email, id : docs._id }, process.env.SECRET_KEY, {expiresIn:'15m'});
            res.status(200).json({error:false,Profile:docs, Token:token});
        } else {
            res.send(err);
        }
    });
}


const GetallDetails = async(req, res) => {
    userModel.find({}, (err, docs) => {
      if(myCache.has('uniqueeKey')){
        console.log('Retrieved value from cache !!')
        // res.send(myCache.get('uniqueeKey'))
        res.status(200).json(myCache.get('uniqueeKey'));
      }else{
      let result = {error:false,Profile:docs};
        myCache.set('uniqueeKey',result)
        console.log('Value not present in cache,'
            + ' performing computation')
        res.json(result)
      }
    });
}
//JMeter Testing
const Details = async(req, res) => {
    userModel.find({}, (err, docs) => {
        if (!err) {
            res.status(200).send(docs);
        } else {
            res.send(err);
        }
    });
}
// const SendRequest = async (req, res) =>{ 
//     userModel.find({email : req.email}, (err, docs) => {
//         if (!err) {
//             //sending email to user and admin
//             lockerRequest(docs.email, docs.id, size)
//             res.status(200).json({error:false, message: "Request has been sent to Admin for New Locker"});
//         } else {
//             res.send(err);
//         }
//     });
// }

const SendRequest = async (req, res) =>{ 

    const data = { userEmail: req.email, Requ: req.body.Requ };
    userModel.find({email : req.email}, (err, docs) => {
        if (!err) {

            fetch('http://localhost:3002/admin/requests', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .catch((error) => {
                console.error('Error:', error);
            });

            //sending email to user and admin
            lockerRequest(req.email)
            res.status(200).json({error:false, message: "Request has been sent to Admin for New Locker"});
        } else {
            res.send(err);
        }
    });
}



module.exports={signUpUser,logInUser,profileDetails,
                 GetallDetails, SendRequest, Details};
