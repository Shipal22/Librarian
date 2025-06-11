const { default: mongoose } = require("mongoose");
mongoose.connect(`mongodb://127.0.0.1:27017/Students_Library_Account`);

const studentschema = mongoose.Schema({
    adm_no : String,
    email : String,
   books_borrowed :[{
    isbn:String,
    date:{
         type: Date,
        default : Date.now
    } ,
    name : String,
    author : String,
   }],
   
})

module.exports = mongoose.model("student" , studentschema);