const joi=require('joi');
const passwordComplexity=require('joi-password-complexity');


const validation=(body)=>{
    const schema=joi.object({
        email:joi.string().email().required().label('Email'),
        password:passwordComplexity().required().label('Password'),
    })

    return schema.validate(body);
}

module.exports={validation};

