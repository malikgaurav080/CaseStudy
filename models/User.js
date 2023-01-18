const mongoose=require('mongoose');
mongoose.set('strictQuery', true);

const schema=mongoose.Schema;

const UserSchema= new schema({
    username:{
        type: String,
        required:true,
    },
    email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
    
}, {timestamps : true});
   
module.exports = mongoose.model("User", UserSchema);