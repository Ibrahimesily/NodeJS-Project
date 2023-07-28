const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const util= require('util');
const AsyncAsign =util.promisify(jwt.sign);
const _ = require('lodash')
require('dotenv').config()
const secrtkey =process.env.secrtkey
//------------------------------------------------------
const userSchema = mongoose.Schema({
    FirstName :{
        type:String,
        required:true
    }, 
    LastName:{
        type:String,
        required:true
    } ,
    UserName:{
        type:String,
        required:true
    } ,
    Password:{
        type:String,
        required:true
    } ,
    PhoneNumber:{
        type:String,
        required:true
    } ,
    Email:{
        type:String,
        required:true
    } ,
    Address:{
        type:String,
        required:true
    },
    Role:{
        type : String,
        required:true,
        enum : ['admin','user'],
        default:'user'
    },
    Cart:{
    type:[String] 
    }
},{toJSON:{
    transform:(doc,returndoc)=> _.omit(returndoc,['__v','Password'])
}})
//---------------------------------------------------------------------------------
userSchema.pre('save', async function(next) {
    if(this.isModified('Password')){
        const salatRound = 7 ;
        const hashpass = await bcrypt.hash(this.Password, salatRound)
        this.Password=hashpass;
    }
    next();
});
//---------------------------------------------------------------------------------
userSchema.methods.generateToken = function(){
    let token = AsyncAsign({
        id:this.id,
        Role:this.Role
    } ,secrtkey);
    return token
}
//---------------------------------------------------------------------------------
const userModel = mongoose.model('User' ,userSchema)
//---------------------------------------------------------------------------------
module.exports = userModel
