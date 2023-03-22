
import validator from "validator";
import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true

    },
    username:{
        type : String,
        required : true,
        unique:true
    },
    email:{
        type : String,
        required : true,
        unique:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid Email")
            }
        }
    },
    password:{
        type : String, 
        required : true
        
    },
    pic:{
        type:String,
        default:"https://www.citypng.com/public/uploads/preview/profile-user-round-red-icon-symbol-download-png-11639594337tco5j3n0ix.png"
       },
       followers:[{type:ObjectId,ref:"user"}],
       following:[{type:ObjectId,ref:"user"}]
})

const user = mongoose.model('user', userSchema);

export default user;