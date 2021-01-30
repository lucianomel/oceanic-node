import {Schema,model} from 'mongoose'

const reviewSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    depto:{
        type:Schema.Types.ObjectId,
        ref:'Depto'
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        pro:{
            type:String,
            required:true
        },
        cons:{
            type:String,
            required:true
        }
    }
},{timestamps:true})

export default model('Review',reviewSchema)