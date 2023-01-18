const express = require('express');
const {signUpUser, logInUser, profileDetails, GetallDetails, SendRequest, Details} = require('../Controller/userController');
const auth = require('../middleWare/UserAuth');
const authAdmin = require('../middleWare/auth');

const router=express.Router();


router.post('/signup',signUpUser);
router.post('/login',logInUser);
router.post('/sendLockerRequest', auth, SendRequest);
router.get('/profile', auth, profileDetails);
router.get('/details', authAdmin,  GetallDetails);
router.get('/testing', Details);




module.exports=router;