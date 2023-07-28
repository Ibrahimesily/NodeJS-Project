const mongoose = require('mongoose')
const _ = require('lodash')
//------------------------------------------------------
const proSchema = mongoose.Schema({
    ProductName :{
        type:String,
        required:true
    }, 
    Price:{
        type:Number,
        required:true,
        default:0
    } ,
    Description:{
        type:String
    } 
},{toJSON:{
    transform:(doc,returndoc)=> _.omit(returndoc,['__v'])
}})
//---------------------------------------------------------------------------------
const proModel = mongoose.model('Products' ,proSchema)
//---------------------------------------------------------------------------------
module.exports = proModel
