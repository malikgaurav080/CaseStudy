const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Admin_Mail,
      pass: process.env.Admin_Pass
    }
});

const wrongAlert = function(usermail){
var wrongPassAlert = {
    from: process.env.Admin_Mail,
    to: usermail,
    subject: 'Wrong Password Alert!!!',
    text: 'You have entered wrong password......'
};

transporter.sendMail(wrongPassAlert, function(error, info){
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);
    }
})
};


const loggedIn = function(usermail){
const AccoundLoggedIn = {
    from: process.env.Admin_Mail,
    to: usermail,
    subject: 'LoggedIn Successfully',
    text: 'you have logged in successfully if not you then immediately call on customare care number'
};
              
transporter.sendMail(AccoundLoggedIn, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
})
};

const signupAlert = function(usermail){
    const signupAlerts = {
        from: process.env.Admin_Mail,
        to: usermail,
        subject: 'SignUp Successfully',
        text: 'You have been Signup Successfully. Remember your keys for future reference for resetting the password.'
    };
    
    transporter.sendMail(signupAlerts, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    })
};

const lockerRequest = function(userEmail){

    const UserRes = {
        from: process.env.Admin_Mail,
        to: userEmail,
        subject: 'Locker Signup Request has been generated',
        text: `Your Request has been generated successfully. We will get back to you next 24 hours for further details`
    };
    transporter.sendMail(UserRes, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    })

};
module.exports = { wrongAlert, loggedIn, signupAlert, lockerRequest }