const mongoose = require("mongoose");

const userSchema  = mongoose.Schema({
    username : {
        type : String,
        required:[true, 'please add a username'],
        unique:true,
    },
    email : {
        type:String,
        required:[true,"please enter a email"],
        unique:true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'please add valid email'
        ],
    },
    password: {
        type: String,
        required:[true,'please add a password'],
        minlength: 6,
        select:false,
    },

},{timestamps:true});

module.exports = mongoose.model("User",userSchema)