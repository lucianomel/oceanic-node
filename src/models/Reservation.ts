import {Schema,model} from 'mongoose'

const reservationSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    depto:{
        type:Schema.Types.ObjectId,
        ref:'Depto',
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    additionalInfo:{
        type:String,
        required:false
    }
},{timestamps:true})

export default model('Reservation',reservationSchema)